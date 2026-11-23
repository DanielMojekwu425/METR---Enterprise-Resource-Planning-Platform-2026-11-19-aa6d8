import crypto from 'node:crypto';
import path from 'node:path';
import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import {
  initDb,
  insertWaitlistSignup,
  verifyWaitlistEmail,
  getWaitlistCount,
  formatDbRowToRecord,
} from './server/db';
import { sendVerificationEmail, sendAdminNotificationEmail } from './server/email';
import { createRateLimiter } from './server/rateLimit';
import { waitlistZodSchema } from './server/validation';

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const APP_URL = (process.env.APP_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

function makeRequestId(): string {
  return `req_${crypto.randomBytes(6).toString('hex')}`;
}

async function startServer() {
  // Initialize Database connection & verify schema
  await initDb();

  const app = express();
  // Trust proxy for reverse proxies / Cloud Run / Vercel so rate limiter gets client IP
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '64kb' }));

  // Strict rate limiter for waitlist submission: max 5 requests per 15 minutes per IP
  const waitlistLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many waitlist submissions from this network. Please wait a few minutes before trying again.',
  });

  // GET /api/v1/waitlist/count — Standard 3Metr response envelope (Section B6)
  app.get('/api/v1/waitlist/count', async (_req, res) => {
    try {
      const totalCount = await getWaitlistCount();
      res.json({
        data: {
          totalCount,
        },
        meta: {
          requestId: makeRequestId(),
          nextCursor: null,
        },
      });
    } catch (err) {
      console.error('Error fetching waitlist count:', err);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unable to retrieve waitlist statistics.',
        },
      });
    }
  });

  // GET /api/v1/waitlist/verify — Double opt-in confirmation endpoint
  app.get('/api/v1/waitlist/verify', async (req, res) => {
    const token = typeof req.query.token === 'string' ? req.query.token.trim() : '';

    if (!token) {
      return res.redirect(`${APP_URL}/?verified=error#waitlist`);
    }

    try {
      const result = await verifyWaitlistEmail(token);
      if (!result.success || !result.row) {
        return res.redirect(`${APP_URL}/?verified=invalid#waitlist`);
      }

      if (result.alreadyVerified) {
        return res.redirect(`${APP_URL}/?verified=already#waitlist`);
      }

      console.log(`✅ [3Metr Waitlist] Email verified successfully for: ${result.row.work_email}`);
      return res.redirect(`${APP_URL}/?verified=success#waitlist`);
    } catch (err) {
      console.error('Error during email verification:', err);
      return res.redirect(`${APP_URL}/?verified=error#waitlist`);
    }
  });

  // POST /api/v1/waitlist — Validated, rate-limited, bot-protected waitlist registration
  app.post('/api/v1/waitlist', waitlistLimiter, async (req, res) => {
    const requestId = makeRequestId();

    // 1. Honeypot check: If the hidden website input has any value, silently discard without DB write
    if (req.body && typeof req.body.website === 'string' && req.body.website.trim().length > 0) {
      console.warn(`🤖 [3Metr Honeypot] Bot submission blocked from IP: ${req.ip}`);
      // Return a 200 OK fake success so bots do not retry or probe further
      return res.status(200).json({
        data: {
          success: true,
          message: 'Please check your email to verify your address.',
        },
        meta: { requestId },
      });
    }

    // 2. Server-side validation via Zod
    const parseResult = waitlistZodSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || [];
      const fieldErrors = issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: fieldErrors[0]?.message || 'Please correct the highlighted fields before submitting.',
          details: fieldErrors,
        },
        requestId,
      });
    }

    const validatedData = parseResult.data;

    try {
      // 3. Generate secure random verification token for double opt-in
      const verificationToken = crypto.randomBytes(24).toString('hex');

      // 4. Insert or handle duplicate in Postgres
      const { row, isDuplicate } = await insertWaitlistSignup(validatedData, verificationToken);
      const totalCount = await getWaitlistCount();
      const record = formatDbRowToRecord(row, totalCount);

      if (isDuplicate) {
        return res.status(200).json({
          data: {
            record,
            totalCount,
            idempotentReplay: true,
            message: 'This email address is already registered on our early access queue.',
          },
          meta: {
            requestId,
            nextCursor: null,
          },
        });
      }

      // 5. Send double opt-in verification email & admin notification
      const verificationUrl = `${APP_URL}/api/v1/waitlist/verify?token=${verificationToken}`;

      // Dispatch emails in background (fire-and-forget with error logging)
      sendVerificationEmail(validatedData.workEmail, validatedData.fullName, verificationUrl).catch(
        (err) => console.error('Failed to send verification email:', err)
      );

      sendAdminNotificationEmail(row).catch((err) =>
        console.error('Failed to send admin notification:', err)
      );

      return res.status(201).json({
        data: {
          record,
          totalCount,
          idempotentReplay: false,
          requiresVerification: true,
          message: 'Registration received! Please check your email inbox to verify your address.',
        },
        meta: {
          requestId,
          nextCursor: null,
        },
      });
    } catch (err: unknown) {
      console.error('❌ [3Metr Waitlist] Server error during registration:', err);
      return res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while processing your request. Please try again.',
        },
        requestId,
      });
    }
  });

  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`3Metr ERP Web Server listening on http://0.0.0.0:${PORT}`);
    console.log(`📡 Base App URL configured as: ${APP_URL}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start 3Metr server:', err);
  process.exit(1);
});
