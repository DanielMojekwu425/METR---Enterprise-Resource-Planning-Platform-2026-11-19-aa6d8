import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, CheckCircle2, Lock, Mail, RotateCcw, AlertCircle } from 'lucide-react';
import {
  validateWaitlistSubmission,
  WAITLIST_ROLES,
  WAITLIST_COMPANY_STRUCTURES,
  type ReleasePhase,
  type WaitlistRecord,
  type WaitlistSubmissionInput,
} from '@metr/contracts';
import { Button, Reveal } from '@metr/ui';

const PHASE_CHOICES: { phase: ReleasePhase; description: string }[] = [
  {
    phase: 'Phase 1',
    description: 'Company Setup, CRM, Quotes & Orders, Invoicing, and Accounting',
  },
  {
    phase: 'Phase 2',
    description: 'Purchasing, Warehousing, Contracts, Projects & Customer Support',
  },
  {
    phase: 'Phase 3',
    description: 'HR & Payroll, Fixed Assets, Bank Feeds & Customer/Supplier Portals',
  },
];

const INITIAL_FORM: WaitlistSubmissionInput = {
  fullName: '',
  workEmail: '',
  organization: '',
  role: '',
  companyStructure: '',
  priorityPhases: ['Phase 1'],
  notes: '',
  consentGiven: false,
  website: '',
};

export function WaitlistSection() {
  const [form, setForm] = useState<WaitlistSubmissionInput>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof WaitlistSubmissionInput, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<WaitlistRecord | null>(null);
  const [pilotQueueCount, setPilotQueueCount] = useState<number>(38);
  const [verificationBanner, setVerificationBanner] = useState<{
    type: 'success' | 'already' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    // Check verification status from URL query params (after email link click)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const verified = params.get('verified');
      if (verified === 'success') {
        setVerificationBanner({
          type: 'success',
          message:
            '🎉 Email verified successfully! Your priority position in the 3Metr onboarding queue is now confirmed.',
        });
      } else if (verified === 'already') {
        setVerificationBanner({
          type: 'already',
          message:
            'Your email address is already verified. You are confirmed in the 3Metr early access queue.',
        });
      } else if (verified === 'invalid' || verified === 'error') {
        setVerificationBanner({
          type: 'error',
          message:
            'The verification link was invalid or has expired. Please submit your details below or contact our team.',
        });
      }
    }

    // Fetch live waitlist count
    fetch('/api/v1/waitlist/count')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (mounted && payload?.data?.totalCount) {
          setPilotQueueCount(payload.data.totalCount);
        }
      })
      .catch(() => {
        // Keep default count if backend count endpoint is unreachable
      });

    return () => {
      mounted = false;
    };
  }, []);

  const togglePhase = (phase: ReleasePhase) => {
    setForm((prev) => {
      const exists = prev.priorityPhases.includes(phase);
      const next = exists
        ? prev.priorityPhases.filter((p) => p !== phase)
        : [...prev.priorityPhases, phase];
      return { ...prev, priorityPhases: next };
    });
    if (fieldErrors.priorityPhases) {
      setFieldErrors((prev) => ({ ...prev, priorityPhases: undefined }));
    }
  };

  const handleFieldChange = (field: keyof WaitlistSubmissionInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateWaitlistSubmission(form);
    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const idempotencyKey =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `3metr-${Date.now()}`;

      // Capture UTM params or referrer as source
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const source = urlParams?.get('utm_source') || (typeof document !== 'undefined' ? document.referrer : '') || 'website_direct';

      const payloadToSend = {
        ...form,
        source: source.slice(0, 100),
      };

      const response = await fetch('/api/v1/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payloadToSend),
      });

      const payload = await response.json();

      if (!response.ok) {
        if (payload?.error?.details && Array.isArray(payload.error.details)) {
          setSubmitError(payload.error.message || 'Please check the highlighted fields.');
        } else {
          setSubmitError(payload?.error?.message || 'Unable to submit request. Please try again.');
        }
        return;
      }

      setSubmittedRecord(payload.data.record);
      if (typeof payload.data.totalCount === 'number') {
        setPilotQueueCount(payload.data.totalCount);
      }
    } catch {
      setSubmitError('Connection interrupted while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setForm(INITIAL_FORM);
    setFieldErrors({});
    setSubmitError(null);
  };

  return (
    <section id="waitlist" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Email verification status banner */}
        {verificationBanner && (
          <div
            role="status"
            className={`mb-8 p-4 rounded-[0.75rem] border flex items-start gap-3 ${
              verificationBanner.type === 'error'
                ? 'bg-[#FFDAD6]/50 border-[#BA1A1A]/30 text-[#93000A]'
                : 'bg-[#9CF2E8]/20 border-[#0F766E]/30 text-[#005C55]'
            }`}
          >
            {verificationBanner.type === 'error' ? (
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-[#BA1A1A]" />
            ) : (
              <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-[#0F766E]" />
            )}
            <div className="text-[14px] font-medium leading-relaxed">
              {verificationBanner.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 5 Columns: Stakeholder Early Access Context */}
          <Reveal className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0F766E] mb-3">
                Early Access &amp; Stakeholder Pilot
              </p>
              <h2 className="font-[Manrope] text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.2] tracking-[-0.02em] text-[#102A43]">
                Reserve a Phase 1 workspace onboarding slot.
              </h2>
              <p className="mt-4 text-[15px] sm:text-[16px] leading-[26px] text-[#3E4947]">
                Join finance leaders, operations directors, and business owners piloting 3Metr
                across multi-company sales, invoicing, and accounting workflows.
              </p>
            </div>

            <div className="rounded-[1rem] bg-[#F5F7FA] border border-[#D7E0E8] p-5 space-y-4">
              <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-[#E5EBF0]">
                <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                  Teams on the Waitlist
                </span>
                <span className="font-[Manrope] font-tabular text-[26px] font-extrabold text-[#102A43]">
                  {pilotQueueCount}
                </span>
              </div>

              <ul className="space-y-2.5 text-[14px] text-[#172B4D]">
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#0F766E] mt-0.5 shrink-0" aria-hidden="true" />
                  <span>Guided Chart of Accounts and tax configuration review</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#0F766E] mt-0.5 shrink-0" aria-hidden="true" />
                  <span>Live walkthrough from customer quote to balanced financial statements</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#0F766E] mt-0.5 shrink-0" aria-hidden="true" />
                  <span>Tailored onboarding plan for your companies, currencies, and team</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#526579]">
              <Lock size={14} className="text-[#0F766E] shrink-0" aria-hidden="true" />
              <span>
                Your information stays strictly confidential and is used solely to coordinate your
                onboarding walkthrough.
              </span>
            </div>
          </Reveal>

          {/* Right 7 Columns: Validated Waitlist Form or Confirmation Receipt */}
          <div className="lg:col-span-7">
            {submittedRecord ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                role="status"
                aria-live="polite"
                className="metr-card rounded-[1.25rem] p-6 sm:p-8 space-y-6 border-[#0F766E]/40"
              >
                <div className="flex items-start gap-4 pb-5 border-b border-[#E5EBF0]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[0.75rem] bg-[#0F766E]/10 text-[#0F766E] shrink-0">
                    <Mail size={24} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0F766E]">
                      Verification Email Dispatched
                    </p>
                    <h3 className="font-[Manrope] text-[24px] font-bold text-[#102A43] mt-0.5">
                      Welcome to the 3Metr Queue, {submittedRecord.fullName}!
                    </h3>
                    <p className="text-[14px] text-[#526579] mt-1.5 leading-relaxed">
                      We sent a confirmation link to <strong className="text-[#102A43]">{submittedRecord.workEmail}</strong>.
                      Please click the link in that email to confirm your email address and activate your priority position.
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                  <div className="rounded-[0.75rem] bg-[#F5F7FA] border border-[#E5EBF0] p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                      Reference ID
                    </dt>
                    <dd className="mt-1 font-mono font-tabular font-semibold text-[#102A43]">
                      {submittedRecord.referenceCode}
                    </dd>
                  </div>

                  <div className="rounded-[0.75rem] bg-[#F5F7FA] border border-[#E5EBF0] p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                      Organization &amp; Scope
                    </dt>
                    <dd className="mt-1 font-semibold text-[#172B4D]">
                      {submittedRecord.organization} · {submittedRecord.companyStructure}
                    </dd>
                  </div>

                  <div className="rounded-[0.75rem] bg-[#F5F7FA] border border-[#E5EBF0] p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                      Work Email
                    </dt>
                    <dd className="mt-1 font-medium text-[#172B4D]">
                      {submittedRecord.workEmail}
                    </dd>
                  </div>

                  <div className="rounded-[0.75rem] bg-[#F5F7FA] border border-[#E5EBF0] p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
                      Priority Rollout Phases
                    </dt>
                    <dd className="mt-1 font-semibold text-[#0F766E]">
                      {submittedRecord.priorityPhases.join(' · ')}
                    </dd>
                  </div>
                </dl>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-[12px] text-[#526579]">
                    Registered · {new Date(submittedRecord.submittedAt).toUTCString()}
                  </span>
                  <Button variant="secondary" size="sm" onClick={handleReset}>
                    <RotateCcw size={14} aria-hidden="true" />
                    Register Another Team Member
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="metr-card rounded-[1.25rem] p-6 sm:p-8 space-y-5"
              >
                {/* Honeypot field (hidden from genuine users, traps bots) */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: 0,
                    opacity: 0,
                    pointerEvents: 'none',
                    height: 0,
                    width: 0,
                  }}
                  aria-hidden="true"
                >
                  <label htmlFor="waitlist-website">Leave this field empty</label>
                  <input
                    id="waitlist-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website || ''}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                  />
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-[0.5rem] bg-[#FFDAD6]/60 border border-[#BA1A1A]/30 px-4 py-3 text-[13px] font-medium text-[#93000A]"
                  >
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="waitlist-name"
                      className="block text-[13px] font-semibold text-[#172B4D] mb-1.5"
                    >
                      Full Name <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <input
                      id="waitlist-name"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Adaeze Okonkwo"
                      value={form.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      aria-invalid={Boolean(fieldErrors.fullName)}
                      aria-describedby={fieldErrors.fullName ? 'err-fullName' : undefined}
                      className="metr-input w-full px-3.5 text-[14px]"
                    />
                    {fieldErrors.fullName && (
                      <p id="err-fullName" className="mt-1.5 text-[12px] font-medium text-[#BA1A1A]">
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="waitlist-email"
                      className="block text-[13px] font-semibold text-[#172B4D] mb-1.5"
                    >
                      Work Email <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <input
                      id="waitlist-email"
                      name="workEmail"
                      type="email"
                      autoComplete="email"
                      placeholder="adaeze@meridian-ops.ng"
                      value={form.workEmail}
                      onChange={(e) => handleFieldChange('workEmail', e.target.value)}
                      aria-invalid={Boolean(fieldErrors.workEmail)}
                      aria-describedby={fieldErrors.workEmail ? 'err-workEmail' : undefined}
                      className="metr-input w-full px-3.5 text-[14px]"
                    />
                    {fieldErrors.workEmail && (
                      <p
                        id="err-workEmail"
                        className="mt-1.5 text-[12px] font-medium text-[#BA1A1A]"
                      >
                        {fieldErrors.workEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="waitlist-company"
                      className="block text-[13px] font-semibold text-[#172B4D] mb-1.5"
                    >
                      Organization Name <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <input
                      id="waitlist-company"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="Meridian Systems Ltd"
                      value={form.organization}
                      onChange={(e) => handleFieldChange('organization', e.target.value)}
                      aria-invalid={Boolean(fieldErrors.organization)}
                      aria-describedby={fieldErrors.organization ? 'err-organization' : undefined}
                      className="metr-input w-full px-3.5 text-[14px]"
                    />
                    {fieldErrors.organization && (
                      <p
                        id="err-organization"
                        className="mt-1.5 text-[12px] font-medium text-[#BA1A1A]"
                      >
                        {fieldErrors.organization}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="waitlist-role"
                      className="block text-[13px] font-semibold text-[#172B4D] mb-1.5"
                    >
                      Your Role <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <select
                      id="waitlist-role"
                      name="role"
                      value={form.role}
                      onChange={(e) => handleFieldChange('role', e.target.value)}
                      aria-invalid={Boolean(fieldErrors.role)}
                      aria-describedby={fieldErrors.role ? 'err-role' : undefined}
                      className="metr-input w-full px-3.5 text-[14px]"
                    >
                      <option value="">Select role...</option>
                      {WAITLIST_ROLES.map((roleOpt) => (
                        <option key={roleOpt} value={roleOpt}>
                          {roleOpt}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.role && (
                      <p id="err-role" className="mt-1.5 text-[12px] font-medium text-[#BA1A1A]">
                        {fieldErrors.role}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="waitlist-entities"
                    className="block text-[13px] font-semibold text-[#172B4D] mb-1.5"
                  >
                    Company Structure <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <select
                    id="waitlist-entities"
                    name="companyStructure"
                    value={form.companyStructure}
                    onChange={(e) => handleFieldChange('companyStructure', e.target.value)}
                    aria-invalid={Boolean(fieldErrors.companyStructure)}
                    aria-describedby={fieldErrors.companyStructure ? 'err-companyStructure' : undefined}
                    className="metr-input w-full px-3.5 text-[14px]"
                  >
                    <option value="">Select company structure...</option>
                    {WAITLIST_COMPANY_STRUCTURES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.companyStructure && (
                    <p
                      id="err-companyStructure"
                      className="mt-1.5 text-[12px] font-medium text-[#BA1A1A]"
                    >
                      {fieldErrors.companyStructure}
                    </p>
                  )}
                </div>

                {/* Priority Phases Checkboxes */}
                <fieldset>
                  <legend className="text-[13px] font-semibold text-[#172B4D] mb-2">
                    Modules You’re Most Interested In <span className="text-[#BA1A1A]">*</span>
                  </legend>
                  <div className="space-y-2.5">
                    {PHASE_CHOICES.map((choice) => {
                      const checked = form.priorityPhases.includes(choice.phase);
                      return (
                        <label
                          key={choice.phase}
                          className={`flex items-start gap-3 rounded-[0.5rem] border p-3 cursor-pointer transition-colors ${
                            checked
                              ? 'border-[#0F766E]/45 bg-[#0F766E]/[0.04]'
                              : 'border-[#D7E0E8] bg-white hover:bg-[#F5F7FA]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePhase(choice.phase)}
                            className="sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 inline-flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border shrink-0 transition-colors ${
                              checked
                                ? 'bg-[#0F766E] border-[#0F766E] text-white'
                                : 'bg-white border-[#D7E0E8]'
                            }`}
                          >
                            {checked && <Check size={12} strokeWidth={3} />}
                          </span>
                          <span className="text-[13px] leading-[19px]">
                            <strong className="font-semibold text-[#102A43]">{choice.phase}</strong>
                            <span className="text-[#526579]"> — {choice.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {fieldErrors.priorityPhases && (
                    <p className="mt-1.5 text-[12px] font-medium text-[#BA1A1A]">
                      {fieldErrors.priorityPhases}
                    </p>
                  )}
                </fieldset>

                <div>
                  <label
                    htmlFor="waitlist-notes"
                    className="block text-[13px] font-semibold text-[#172B4D] mb-1.5"
                  >
                    Current Tools or Setup Notes{' '}
                    <span className="font-normal text-[#526579]">(Optional)</span>
                  </label>
                  <textarea
                    id="waitlist-notes"
                    name="notes"
                    rows={3}
                    placeholder="Current accounting software, currency needs, or team onboarding goals..."
                    value={form.notes ?? ''}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    className="w-full rounded-[0.5rem] border border-[#D7E0E8] bg-white px-3.5 py-2.5 text-[14px] text-[#172B4D] placeholder:text-[#526579] focus:outline-none focus:border-[#0F766E] focus:ring-[3px] focus:ring-[#0F766E]/15"
                  />
                </div>

                {/* Consent & Privacy Notice Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.consentGiven}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, consentGiven: e.target.checked }));
                        if (fieldErrors.consentGiven) {
                          setFieldErrors((prev) => ({ ...prev, consentGiven: undefined }));
                        }
                      }}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 inline-flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border shrink-0 transition-colors ${
                        form.consentGiven
                          ? 'bg-[#0F766E] border-[#0F766E] text-white'
                          : 'bg-white border-[#D7E0E8]'
                      }`}
                    >
                      {form.consentGiven && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="text-[13px] leading-[19px] text-[#3E4947]">
                      I agree to the{' '}
                      <a
                        href="#privacy"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(
                            '3Metr Privacy Notice:\n\nWe collect your contact information and organization operational details solely for early-access coordination, technical requirements review, and onboarding communication. We never sell or share your data with external advertisers.'
                          );
                        }}
                        className="font-semibold text-[#0F766E] underline hover:text-[#0D655E]"
                      >
                        3Metr Privacy Notice
                      </a>{' '}
                      and consent to onboarding communications. <span className="text-[#BA1A1A]">*</span>
                    </span>
                  </label>
                  {fieldErrors.consentGiven && (
                    <p className="mt-1.5 text-[12px] font-medium text-[#BA1A1A]">
                      {fieldErrors.consentGiven}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[12px] text-[#526579]">
                    No automated spam. Direct onboarding review with the 3Metr team.
                  </p>
                  <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Request...' : 'Request Early Access'}
                    {!isSubmitting && <ArrowRight size={16} aria-hidden="true" />}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
