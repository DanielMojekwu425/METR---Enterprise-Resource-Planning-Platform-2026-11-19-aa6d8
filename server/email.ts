import { Resend } from 'resend';
import type { DbWaitlistRow } from './db';

const apiKey = process.env.RESEND_API_KEY?.trim();
const resend = apiKey && !apiKey.startsWith('re_sample') ? new Resend(apiKey) : null;

const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
const adminEmail = process.env.ADMIN_EMAIL || 'danielm@3csaquarah.com';

export async function sendVerificationEmail(
  to: string,
  fullName: string,
  verificationUrl: string
): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  if (!resend) {
    console.log(
      `📧 [3Metr Email: Dev Mode] Verification email for ${fullName} <${to}>:\n🔗 Click to verify: ${verificationUrl}\n(Set RESEND_API_KEY in .env to send live emails via Resend)`
    );
    return { success: true, devMode: true };
  }

  try {
    await resend.emails.send({
      from: `3Metr ERP <${senderEmail}>`,
      to,
      subject: 'Verify your 3Metr Early Access Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your 3Metr Early Access Request</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F5F7FA; margin: 0; padding: 40px 20px;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D7E0E8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(16,42,69,0.05);">
            <div style="background-color: #102A43; padding: 24px 32px; border-bottom: 3px solid #0F766E;">
              <h1 style="color: #FFFFFF; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.02em;">3Metr ERP</h1>
              <p style="color: #2DD4BF; margin: 4px 0 0 0; font-size: 13px; font-weight: 500;">Unified Operations &amp; Double-Entry Finance</p>
            </div>
            
            <div style="padding: 32px; color: #172B4D; font-size: 15px; line-height: 1.6;">
              <h2 style="color: #102A43; font-size: 20px; font-weight: 700; margin-top: 0;">Welcome, ${escapeHtml(fullName)}!</h2>
              <p>Thank you for requesting early access to the <strong>3Metr</strong> multi-entity ERP platform.</p>
              <p>To confirm your work email address and secure your spot in our onboarding review queue, please verify your email by clicking the button below:</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" style="background-color: #0F766E; color: #FFFFFF; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Verify Email Address</a>
              </div>
              
              <p style="font-size: 13px; color: #526579;">If the button does not work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #0F766E; word-break: break-all;">${verificationUrl}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #E5EBF0; margin: 28px 0;" />
              
              <p style="font-size: 12px; color: #526579; margin-bottom: 0;">If you did not request early access to 3Metr, you can safely ignore this email.</p>
            </div>
            
            <div style="background-color: #F5F7FA; padding: 16px 32px; border-top: 1px solid #E5EBF0; font-size: 12px; color: #526579; text-align: center;">
              © ${new Date().getFullYear()} 3Metr ERP. Built for multi-entity financial precision.
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ [3Metr Email] Failed to send verification email:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendAdminNotificationEmail(
  row: DbWaitlistRow
): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  if (!resend) {
    console.log(
      `📧 [3Metr Email: Dev Mode] Admin notification for ${row.full_name} (${row.organization}) → ${adminEmail}`
    );
    return { success: true, devMode: true };
  }

  const phases: string[] = [];
  if (row.interest_phase1) phases.push('Phase 1');
  if (row.interest_phase2) phases.push('Phase 2');
  if (row.interest_phase3) phases.push('Phase 3');

  try {
    await resend.emails.send({
      from: `3Metr Waitlist Bot <${senderEmail}>`,
      to: adminEmail,
      subject: `[3Metr Waitlist] New Signup: ${row.full_name} (${row.organization})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; color: #172B4D; padding: 24px;">
          <h2 style="color: #102A43;">New 3Metr Early Access Registration</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold; width: 160px;">Name</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;">${escapeHtml(row.full_name)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold;">Work Email</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;"><a href="mailto:${escapeHtml(row.work_email)}">${escapeHtml(row.work_email)}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold;">Organization</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;">${escapeHtml(row.organization)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold;">Role</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;">${escapeHtml(row.role)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold;">Structure</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;">${escapeHtml(row.company_structure)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold;">Priority Phases</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;">${escapeHtml(phases.join(', '))}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold;">Notes</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;">${escapeHtml(row.current_tools_notes || 'None')}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold;">Source / UTM</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;">${escapeHtml(row.source || 'Direct')}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #E5EBF0; font-weight: bold;">Registered At</td><td style="padding: 8px; border-bottom: 1px solid #E5EBF0;">${new Date(row.created_at).toUTCString()}</td></tr>
          </table>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ [3Metr Email] Failed to send admin notification email:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
