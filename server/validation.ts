import { z } from 'zod';
import {
  WAITLIST_ROLES,
  WAITLIST_COMPANY_STRUCTURES,
  type WaitlistRole,
  type WaitlistCompanyStructure,
  type ReleasePhase,
} from '../packages/contracts/src/erp';

export const waitlistZodSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Enter your full name (at least 2 characters).')
      .max(120, 'Full name cannot exceed 120 characters.'),
    workEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email('Enter a valid work email address.')
      .max(254, 'Email cannot exceed 254 characters.'),
    organization: z
      .string()
      .trim()
      .optional(),
    companyName: z
      .string()
      .trim()
      .optional(),
    role: z
      .string()
      .refine((val) => WAITLIST_ROLES.includes(val as WaitlistRole), {
        message: 'Select your operational role from the list.',
      }),
    companyStructure: z
      .string()
      .trim()
      .optional(),
    entityCount: z
      .string()
      .trim()
      .optional(),
    priorityPhases: z
      .array(z.enum(['Phase 1', 'Phase 2', 'Phase 3'] as const))
      .min(1, 'Select at least one priority rollout phase.'),
    notes: z
      .string()
      .trim()
      .max(1000, 'Notes cannot exceed 1000 characters.')
      .optional(),
    consentGiven: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must agree to the privacy notice to proceed.',
      }),
    consentVersion: z.string().optional(),
    source: z.string().trim().max(100).optional(),
    website: z.string().optional(), // Honeypot field (must be empty for human submissions)
  })
  .transform((data) => {
    const organization = (data.organization || data.companyName || '').trim();
    const companyStructure = (data.companyStructure || data.entityCount || '').trim();

    return {
      fullName: data.fullName,
      workEmail: data.workEmail,
      organization,
      role: data.role as WaitlistRole,
      companyStructure: companyStructure as WaitlistCompanyStructure,
      priorityPhases: data.priorityPhases as ReleasePhase[],
      notes: data.notes || undefined,
      consentGiven: data.consentGiven,
      consentVersion: data.consentVersion || process.env.CONSENT_VERSION || '2026-11-20-v1',
      source: data.source || undefined,
      website: data.website || '',
    };
  })
  .refine((data) => data.organization.length >= 2, {
    message: 'Enter your organization or legal entity name (at least 2 characters).',
    path: ['organization'],
  })
  .refine((data) => WAITLIST_COMPANY_STRUCTURES.includes(data.companyStructure), {
    message: 'Select your legal entity structure from the list.',
    path: ['companyStructure'],
  });

export type ValidatedWaitlistData = z.infer<typeof waitlistZodSchema>;
