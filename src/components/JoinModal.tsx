import { ArrowRight, X } from 'lucide-react';
import { cloneElement, useEffect, useId, useRef, useState, type FormEvent, type ReactElement } from 'react';
import { membershipCategories, type MembershipCategory } from '../data/content';
import { lgaDirectory, lgaNames, type LgaName } from '../data/locations';
import { org } from '../data/content';
import { mailtoHref } from '../lib/form';
import { focusables, lockPageScroll, trapTab } from '../lib/scrollLock';
import { submitMembership } from '../lib/formTransport';
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

export function JoinModal({ open, preset, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<MembershipDraft>(loadMembershipDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<'idle' | 'sent' | 'pending' | 'failed'>('idle');
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
    setSubmitted('idle');
    setSubmitError('');
    setSending(false);
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

  if (!open) return null;

  const lcdas = draft.lga ? lgaDirectory[draft.lga] : [];

  const setField = <K extends keyof MembershipDraft>(key: K, value: MembershipDraft[K]) => {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      saveMembershipDraft(next);
      return next;
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateMembership(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSending(true);
    const result = await submitMembership({
      fullName: draft.fullName,
      phone: draft.phone,
      email: draft.email,
      lga: draft.lga,
      lcda: draft.lcda,
      ward: draft.ward,
      profession: draft.profession,
      marketAssociation: draft.marketAssociation,
      category: draft.category,
      volunteerInterest: draft.volunteerInterest,
      website: honeypot,
      source: 'website',
    });
    setSending(false);
    if (result.ok) {
      clearMembershipDraft();
      setSubmitted('sent');
    } else if (result.emailPendingConfirm) {
      setSubmitted('pending');
    } else {
      setSubmitted('failed');
      setSubmitError(result.error ?? `We could not reach the form service. Email ${org.email} directly.`);
    }
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
              {submitted === 'sent' ? 'Your interest has been sent' : 'We still need a follow-up'}
            </h2>
            {submitted === 'sent' && (
              <p>
                Your details were emailed to {org.email}. A coordinator will follow up from that
                inbox. You can also <WhatsAppJoinLink icon={false} label="join the WhatsApp group" />.
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
            {submitted === 'failed' && (
              <p>
                {submitError} You can email{' '}
                <a href={mailtoHref('ICGTMP membership interest', { name: draft.fullName, email: draft.email, phone: draft.phone })}>
                  {org.email}
                </a>{' '}
                now.
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
              Complete the form below. Your details are sent to {org.email} so coordinators can
              follow up. Read the <a href="#privacy" onClick={onClose}>Privacy Policy</a>.
            </p>
            <form onSubmit={onSubmit} noValidate>
              <label className="hpField" aria-hidden="true">
                Company website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
              <Field label="Full Name" error={errors.fullName}>
                <input
                  value={draft.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  autoComplete="name"
                  required
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input
                  value={draft.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0803 000 0000"
                  required
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setField('email', e.target.value)}
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="LGA" error={errors.lga}>
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
              <Field label="LCDA" error={errors.lcda}>
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
              <Field label="Ward">
                <input
                  value={draft.ward}
                  onChange={(e) => setField('ward', e.target.value)}
                  placeholder="Your ward"
                />
              </Field>
              <Field label="Profession / Trade">
                <input
                  value={draft.profession}
                  onChange={(e) => setField('profession', e.target.value)}
                  placeholder="e.g. trader, tailor, engineer"
                />
              </Field>
              <Field label="Market / Association">
                <input
                  value={draft.marketAssociation}
                  onChange={(e) => setField('marketAssociation', e.target.value)}
                />
              </Field>
              <Field label="Membership Category" error={errors.category}>
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
              <Field label="Volunteer Interest" error={errors.volunteerInterest} wide>
                <textarea
                  rows={3}
                  value={draft.volunteerInterest}
                  onChange={(e) => setField('volunteerInterest', e.target.value)}
                  placeholder="Skills, time or support you can offer"
                />
              </Field>
              <p className="formPrivacy wideField">
                By submitting, you agree that ICGTMP may contact you about membership, volunteering
                or partnership. We do not sell this information.
              </p>
              <button className="goldPill" type="submit" disabled={sending}>
                {sending ? 'Sending…' : 'Submit interest'} <ArrowRight size={17} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  wide,
}: {
  label: string;
  error?: string;
  children: ReactElement<{ id?: string }>;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <label className={wide ? 'wideField' : undefined} htmlFor={id}>
      {label}
      <span className="fieldControl">
        {cloneElement(children, { id })}
        {error ? <em className="fieldError">{error}</em> : null}
      </span>
    </label>
  );
}
