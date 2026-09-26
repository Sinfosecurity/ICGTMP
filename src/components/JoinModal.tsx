import { ArrowRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { membershipCategories, org, type MembershipCategory } from '../data/content';
import { lgaDirectory, lgaNames, type LgaName } from '../data/locations';
import { mailtoHref } from '../lib/form';
import { focusables, lockPageScroll, trapTab } from '../lib/scrollLock';
import { submitMembership } from '../lib/formTransport';
import { checkCooldown, clearAttempts, describeWait, recordAttempt } from '../lib/rateLimit';
import { LIMITS, formatNgPhone, newSubmissionId, normalizeNgPhone } from '../lib/validation';
import { ErrorSummary } from './ErrorSummary';
import { FormField } from './FormField';
import { useToast } from './Toaster';
import { WhatsAppJoinLink } from './WhatsAppJoinLink';
import {
  MEMBERSHIP_FIELD_ORDER,
  MEMBERSHIP_REQUIRED,
  clearMembershipDraft,
  loadMembershipDraft,
  saveMembershipDraft,
  validateField,
  validateMembership,
  type FieldErrors,
  type MembershipDraft,
  type MembershipField,
} from '../lib/membership';

type Props = {
  open: boolean;
  preset?: MembershipCategory;
  onClose: () => void;
};

/** Courtesy throttle. The register enforces the real one. */
const COOLDOWN_KEY = 'membership';
const COOLDOWN_MAX = 3;
const COOLDOWN_WINDOW_MS = 10 * 60 * 1000;

const fieldId = (name: MembershipField) => `join-${name}`;

export function JoinModal({ open, preset, onClose }: Props) {
  const titleId = 'join-modal-title';
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  /** Identifies this filled-in form, so a retry cannot create a second row. */
  const submissionId = useRef(newSubmissionId());
  const openedAt = useRef(Date.now());
  const toast = useToast();

  const [draft, setDraft] = useState<MembershipDraft>(loadMembershipDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<MembershipField, boolean>>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState<'idle' | 'sent' | 'duplicate'>('idle');
  const [reference, setReference] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [sending, setSending] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (!open) return;
    return lockPageScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const saved = loadMembershipDraft();
    setDraft({ ...saved, category: preset || saved.category || '' });
    setErrors({});
    setTouched({});
    setShowSummary(false);
    setSubmitted('idle');
    setReference('');
    setSubmitError('');
    setSending(false);
    setHoneypot('');
    submissionId.current = newSubmissionId();
    openedAt.current = Date.now();
    const t = window.setTimeout(() => {
      const first = dialogRef.current ? focusables(dialogRef.current)[0] : null;
      (first ?? closeRef.current)?.focus();
    }, 20);
    return () => window.clearTimeout(t);
  }, [open, preset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (dialogRef.current) trapTab(event, dialogRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const send = useCallback(
    async (values: MembershipDraft, website: string) => {
      setSending(true);
      setSubmitError('');
      recordAttempt(COOLDOWN_KEY, COOLDOWN_WINDOW_MS);

      const result = await submitMembership({
        fullName: values.fullName.trim(),
        // Sent in E.164 so the register holds one shape, not five.
        phone: normalizeNgPhone(values.phone) ?? values.phone.trim(),
        email: values.email.trim().toLowerCase(),
        lga: values.lga,
        lcda: values.lcda,
        ward: values.ward.trim(),
        profession: values.profession.trim(),
        marketAssociation: values.marketAssociation.trim(),
        category: values.category,
        volunteerInterest: values.volunteerInterest.trim(),
        website,
        source: 'website',
        submissionId: submissionId.current,
        elapsedMs: Date.now() - openedAt.current,
      });
      setSending(false);

      if (result.ok) {
        clearMembershipDraft();
        clearAttempts(COOLDOWN_KEY);
        setReference(result.reference ?? '');
        setSubmitted(result.code === 'DUPLICATE' ? 'duplicate' : 'sent');
        toast.success(
          result.code === 'DUPLICATE' ? 'You are already registered' : 'Registration received',
          {
            description:
              result.code === 'DUPLICATE'
                ? 'We already hold these details, so nothing was duplicated.'
                : result.reference
                  ? `Your reference is ${result.reference}.`
                  : 'A coordinator will follow up.',
            dedupeKey: COOLDOWN_KEY,
          },
        );
        return;
      }

      // The register rejected one field. Put the visitor on it.
      if (result.code === 'INVALID_FIELD' && result.field) {
        const field = result.field as MembershipField;
        setErrors((current) => ({ ...current, [field]: result.error }));
        setTouched((current) => ({ ...current, [field]: true }));
        document.getElementById(fieldId(field))?.focus();
        toast.error('Check the highlighted field', {
          description: result.error,
          dedupeKey: COOLDOWN_KEY,
          duration: 8000,
        });
        return;
      }

      const message = result.error ?? 'We could not reach the form service.';
      setSubmitError(message);
      toast.error('Registration not sent', {
        description: message,
        dedupeKey: COOLDOWN_KEY,
        action: result.retryable
          ? { label: 'Try again', onClick: () => void send(values, website) }
          : undefined,
      });
    },
    [toast],
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;

    const nextErrors = validateMembership(draft);
    setErrors(nextErrors);
    setTouched(
      MEMBERSHIP_FIELD_ORDER.reduce<Partial<Record<MembershipField, boolean>>>((all, field) => {
        all[field] = true;
        return all;
      }, {}),
    );

    const invalid = MEMBERSHIP_FIELD_ORDER.filter((field) => nextErrors[field]);
    if (invalid.length) {
      setShowSummary(true);
      // The summary is the announcement; focus it rather than a single field so
      // the visitor hears how many problems there are before jumping to one.
      window.setTimeout(() => summaryRef.current?.focus(), 20);
      return;
    }
    setShowSummary(false);

    const cooldown = checkCooldown(COOLDOWN_KEY, COOLDOWN_MAX, COOLDOWN_WINDOW_MS);
    if (cooldown.blocked) {
      const message = `You have submitted this form ${COOLDOWN_MAX} times already. Try again in ${describeWait(cooldown.secondsLeft)}.`;
      setSubmitError(message);
      toast.error('Too many attempts', { description: message, dedupeKey: COOLDOWN_KEY });
      return;
    }

    await send(draft, honeypot);
  };

  if (!open) return null;

  const lcdas = draft.lga ? lgaDirectory[draft.lga] : [];
  const invalidFields = MEMBERSHIP_FIELD_ORDER.filter((field) => errors[field]);
  const volunteerUsed = draft.volunteerInterest.length;
  const volunteerHint =
    volunteerUsed > LIMITS.volunteerInterest * 0.8
      ? `${volunteerUsed}/${LIMITS.volunteerInterest} characters`
      : draft.category === 'Volunteer'
        ? 'Required for volunteers.'
        : 'Optional.';

  const setField = <K extends MembershipField>(key: K, value: MembershipDraft[K]) => {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      saveMembershipDraft(next);
      return next;
    });
    // Clear a field's error as soon as the visitor edits it; re-check on blur.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  /** Validates against the draft as it will be once this change is applied. */
  const blur = (key: MembershipField, overrides?: Partial<MembershipDraft>) => {
    setTouched((current) => ({ ...current, [key]: true }));
    const error = validateField(key, { ...draft, ...overrides });
    setErrors((current) => ({ ...current, [key]: error }));
  };

  const fieldProps = (key: MembershipField) => ({
    id: fieldId(key),
    error: touched[key] ? errors[key] : undefined,
    required: MEMBERSHIP_REQUIRED.includes(key),
  });

  return (
    <div className="modalBackdrop" onMouseDown={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="joinModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} className="closeModal" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        {submitted !== 'idle' ? (
          <div className="joinSuccess">
            <p className="modalKicker">THANK YOU</p>
            <h2 id={titleId}>
              {submitted === 'duplicate' ? 'You are already registered' : 'Your interest has been recorded'}
            </h2>
            <p>
              {submitted === 'duplicate'
                ? 'These details are already on the ICGTMP register, so we did not add a second entry. '
                : 'Your details are on the ICGTMP register and a coordinator will follow up. '}
              You can also <WhatsAppJoinLink icon={false} label="join the WhatsApp group" />.
            </p>
            {reference ? (
              <p className="referenceNote">
                Your reference: <strong>{reference}</strong>
                <span>Quote this if you contact a coordinator.</span>
              </p>
            ) : null}
            <button type="button" className="goldPill" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="modalKicker">JOIN ICGTMP</p>
            <h2 id={titleId}>Register your interest</h2>
            <p>
              Your details go to the ICGTMP membership register so coordinators can follow up.
              Fields marked <span aria-hidden="true">*</span>
              <span className="srOnly">with an asterisk</span> are required. Read the{' '}
              <a href="#privacy" onClick={onClose}>Privacy Policy</a>.
            </p>
            <form onSubmit={onSubmit} noValidate aria-busy={sending}>
              {showSummary ? (
                <ErrorSummary
                  className="wideField"
                  summaryRef={summaryRef}
                  items={invalidFields.map((field) => ({
                    id: fieldId(field),
                    message: errors[field] ?? '',
                  }))}
                />
              ) : null}

              <label className="hpField" aria-hidden="true">
                Company website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>

              <FormField label="Full Name" {...fieldProps('fullName')}>
                <input
                  value={draft.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  onBlur={() => blur('fullName')}
                  autoComplete="name"
                  autoCapitalize="words"
                  maxLength={LIMITS.fullName}
                />
              </FormField>

              <FormField
                label="Phone"
                hint="Nigerian mobile, e.g. 0803 000 0000"
                {...fieldProps('phone')}
              >
                <input
                  value={draft.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  onBlur={() => {
                    // Show the number back in the shape the register stores.
                    const normalized = normalizeNgPhone(draft.phone);
                    const tidy = normalized ? formatNgPhone(normalized) : draft.phone;
                    if (tidy !== draft.phone) setField('phone', tidy);
                    blur('phone', { phone: tidy });
                  }}
                  autoComplete="tel"
                  inputMode="tel"
                  type="tel"
                  placeholder="0803 000 0000"
                  maxLength={LIMITS.phone}
                />
              </FormField>

              <FormField label="Email" {...fieldProps('email')}>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setField('email', e.target.value)}
                  onBlur={() => blur('email')}
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="off"
                  spellCheck={false}
                  maxLength={LIMITS.email}
                />
              </FormField>

              <FormField label="LGA" {...fieldProps('lga')}>
                <select
                  value={draft.lga}
                  onChange={(e) => {
                    const lga = e.target.value as LgaName | '';
                    setField('lga', lga);
                    setField('lcda', '');
                    blur('lga', { lga });
                  }}
                >
                  <option value="">Select LGA</option>
                  {lgaNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="LCDA" {...fieldProps('lcda')}>
                <select
                  value={draft.lcda}
                  onChange={(e) => {
                    setField('lcda', e.target.value);
                    blur('lcda', { lcda: e.target.value });
                  }}
                  disabled={!draft.lga}
                >
                  <option value="">{draft.lga ? 'Select LCDA' : 'Select LGA first'}</option>
                  {lcdas.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Ward" {...fieldProps('ward')}>
                <input
                  value={draft.ward}
                  onChange={(e) => setField('ward', e.target.value)}
                  onBlur={() => blur('ward')}
                  placeholder="Your ward"
                  maxLength={LIMITS.ward}
                />
              </FormField>

              <FormField label="Profession / Trade" {...fieldProps('profession')}>
                <input
                  value={draft.profession}
                  onChange={(e) => setField('profession', e.target.value)}
                  onBlur={() => blur('profession')}
                  placeholder="e.g. trader, tailor, engineer"
                  maxLength={LIMITS.profession}
                />
              </FormField>

              <FormField label="Market / Association" {...fieldProps('marketAssociation')}>
                <input
                  value={draft.marketAssociation}
                  onChange={(e) => setField('marketAssociation', e.target.value)}
                  onBlur={() => blur('marketAssociation')}
                  maxLength={LIMITS.marketAssociation}
                />
              </FormField>

              <FormField label="Membership Category" {...fieldProps('category')}>
                <select
                  value={draft.category}
                  onChange={(e) => {
                    const category = e.target.value as MembershipCategory | '';
                    setField('category', category);
                    blur('category', { category });
                  }}
                >
                  <option value="">Select category</option>
                  {membershipCategories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Volunteer Interest"
                hint={volunteerHint}
                wide
                {...fieldProps('volunteerInterest')}
                required={draft.category === 'Volunteer'}
              >
                <textarea
                  rows={3}
                  value={draft.volunteerInterest}
                  onChange={(e) => setField('volunteerInterest', e.target.value)}
                  onBlur={() => blur('volunteerInterest')}
                  placeholder="Skills, time or support you can offer"
                  maxLength={LIMITS.volunteerInterest}
                />
              </FormField>

              {submitError ? (
                <p className="formAlert wideField" role="alert">
                  {submitError} You can email{' '}
                  <a
                    href={mailtoHref('ICGTMP membership interest', {
                      name: draft.fullName,
                      email: draft.email,
                      phone: draft.phone,
                    })}
                  >
                    {org.email}
                  </a>{' '}
                  instead. Your answers are kept on this device.
                </p>
              ) : null}

              <p className="formPrivacy wideField">
                By submitting, you agree that ICGTMP may contact you about membership, volunteering
                or partnership. We do not sell this information.
              </p>
              <button className="goldPill" type="submit" disabled={sending}>
                {sending ? 'Sending…' : submitError ? 'Try again' : 'Submit interest'}{' '}
                <ArrowRight size={17} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
