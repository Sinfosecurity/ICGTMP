import { ArrowRight, X } from 'lucide-react';
import {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from 'react';
import { membershipCategories, type MembershipCategory } from '../data/content';
import { lgaDirectory, lgaNames, type LgaName } from '../data/locations';
import { org } from '../data/content';
import { mailtoHref } from '../lib/form';
import { focusables, lockPageScroll, trapTab } from '../lib/scrollLock';
import { submitMembership } from '../lib/formTransport';
import { useToast } from './Toaster';
import { WhatsAppJoinLink } from './WhatsAppJoinLink';
import {
  clearMembershipDraft,
  loadMembershipDraft,
  saveMembershipDraft,
  validateMembership,
  type FieldErrors,
  type MembershipDraft,
} from '../lib/membership';

type Props = {
  open: boolean;
  preset?: MembershipCategory;
  onClose: () => void;
};

/** Visual order, so the first reported error is the first one on screen. */
const FIELD_ORDER: (keyof MembershipDraft)[] = [
  'fullName',
  'phone',
  'email',
  'lga',
  'lcda',
  'ward',
  'profession',
  'marketAssociation',
  'category',
  'volunteerInterest',
];

const fieldId = (name: string) => `join-${name}`;
const errorId = (name: string) => `join-${name}-error`;

export function JoinModal({ open, preset, onClose }: Props) {
  const titleId = 'join-modal-title';
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const [draft, setDraft] = useState<MembershipDraft>(loadMembershipDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<'idle' | 'sent' | 'pending'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [sending, setSending] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
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
    setSubmitted('idle');
    setSubmitError('');
    setSending(false);
    setDuplicate(false);
    setHoneypot('');
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
      const result = await submitMembership({
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        lga: values.lga,
        lcda: values.lcda,
        ward: values.ward,
        profession: values.profession,
        marketAssociation: values.marketAssociation,
        category: values.category,
        volunteerInterest: values.volunteerInterest,
        website,
        source: 'website',
      });
      setSending(false);

      if (result.ok) {
        clearMembershipDraft();
        setDuplicate(Boolean(result.duplicate));
        setSubmitted('sent');
        toast.success(
          result.duplicate ? 'You are already registered' : 'Registration received',
          {
            description: result.duplicate
              ? 'We already have this phone number on file, so nothing was duplicated.'
              : `A coordinator will follow up with ${values.fullName.split(' ')[0] || 'you'}.`,
            dedupeKey: 'membership',
          },
        );
        if (result.warning) {
          toast.warning('Saved by email only', {
            description: `${result.warning} A coordinator will add you to the register by hand.`,
            dedupeKey: 'membership-warning',
          });
        }
        return;
      }

      if (result.emailPendingConfirm) {
        setSubmitted('pending');
        toast.warning('One more step needed', {
          description: `The inbox needs a one-time confirmation. Please also email ${org.email}.`,
          dedupeKey: 'membership',
        });
        return;
      }

      const message = result.error ?? 'We could not reach the form service.';
      setSubmitError(message);
      toast.error('Registration not sent', {
        description: message,
        dedupeKey: 'membership',
        // A rejection is about the data, so retrying the same values is pointless.
        action:
          result.failure === 'rejected'
            ? undefined
            : { label: 'Try again', onClick: () => void send(values, website) },
      });
    },
    [toast],
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const nextErrors = validateMembership(draft);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      toast.error('Check the highlighted fields', {
        description: nextErrors[firstInvalid],
        dedupeKey: 'membership',
        duration: 8000,
      });
      return;
    }

    await send(draft, honeypot);
  };

  if (!open) return null;

  const lcdas = draft.lga ? lgaDirectory[draft.lga] : [];

  const setField = <K extends keyof MembershipDraft>(key: K, value: MembershipDraft[K]) => {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      saveMembershipDraft(next);
      return next;
    });
    // Clear a field's error as soon as the visitor edits it.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

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
              {submitted === 'sent'
                ? duplicate
                  ? 'You are already registered'
                  : 'Your interest has been recorded'
                : 'We still need a follow-up'}
            </h2>
            {submitted === 'sent' && (
              <p>
                {duplicate
                  ? 'This phone number is already on the ICGTMP register, so we did not add a second entry. '
                  : 'Your details are with the ICGTMP coordinators and a member of the team will follow up. '}
                You can also <WhatsAppJoinLink icon={false} label="join the WhatsApp group" />.
              </p>
            )}
            {submitted === 'pending' && (
              <p>
                The inbox needs a one-time confirmation. Please also send this directly to{' '}
                <a href={mailtoHref('ICGTMP membership interest', { name: draft.fullName, email: draft.email, phone: draft.phone })}>
                  {org.email}
                </a>
                .
              </p>
            )}
            <button type="button" className="goldPill" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="modalKicker">JOIN ICGTMP</p>
            <h2 id={titleId}>Register your interest</h2>
            <p>
              Complete the form below. Your details go to the ICGTMP membership register so
              coordinators can follow up. Read the <a href="#privacy" onClick={onClose}>Privacy Policy</a>.
            </p>
            <form onSubmit={onSubmit} noValidate aria-busy={sending}>
              <label className="hpField" aria-hidden="true">
                Company website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
              <Field name="fullName" label="Full Name" error={errors.fullName}>
                <input
                  value={draft.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  autoComplete="name"
                  required
                />
              </Field>
              <Field name="phone" label="Phone" error={errors.phone}>
                <input
                  value={draft.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0803 000 0000"
                  required
                />
              </Field>
              <Field name="email" label="Email" error={errors.email}>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setField('email', e.target.value)}
                  autoComplete="email"
                  required
                />
              </Field>
              <Field name="lga" label="LGA" error={errors.lga}>
                <select
                  value={draft.lga}
                  onChange={(e) => {
                    setField('lga', e.target.value as LgaName | '');
                    setField('lcda', '');
                  }}
                  required
                >
                  <option value="">Select LGA</option>
                  {lgaNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field name="lcda" label="LCDA" error={errors.lcda}>
                <select
                  value={draft.lcda}
                  onChange={(e) => setField('lcda', e.target.value)}
                  disabled={!draft.lga}
                  required
                >
                  <option value="">{draft.lga ? 'Select LCDA' : 'Select LGA first'}</option>
                  {lcdas.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field name="ward" label="Ward">
                <input
                  value={draft.ward}
                  onChange={(e) => setField('ward', e.target.value)}
                  placeholder="Your ward"
                />
              </Field>
              <Field name="profession" label="Profession / Trade">
                <input
                  value={draft.profession}
                  onChange={(e) => setField('profession', e.target.value)}
                  placeholder="e.g. trader, tailor, engineer"
                />
              </Field>
              <Field name="marketAssociation" label="Market / Association">
                <input
                  value={draft.marketAssociation}
                  onChange={(e) => setField('marketAssociation', e.target.value)}
                />
              </Field>
              <Field name="category" label="Membership Category" error={errors.category}>
                <select
                  value={draft.category}
                  onChange={(e) => setField('category', e.target.value as MembershipCategory | '')}
                  required
                >
                  <option value="">Select category</option>
                  {membershipCategories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                name="volunteerInterest"
                label="Volunteer Interest"
                error={errors.volunteerInterest}
                wide
              >
                <textarea
                  rows={3}
                  value={draft.volunteerInterest}
                  onChange={(e) => setField('volunteerInterest', e.target.value)}
                  placeholder="Skills, time or support you can offer"
                />
              </Field>
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

function Field({
  name,
  label,
  error,
  children,
  wide,
}: {
  name: string;
  label: string;
  error?: string;
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }>;
  wide?: boolean;
}) {
  const id = fieldId(name);
  return (
    <label className={wide ? 'wideField' : undefined} htmlFor={id}>
      {label}
      <span className="fieldControl">
        {cloneElement(children, {
          id,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? errorId(name) : undefined,
        })}
        {error ? (
          <em className="fieldError" id={errorId(name)}>
            {error}
          </em>
        ) : null}
      </span>
    </label>
  );
}
