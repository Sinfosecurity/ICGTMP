import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useCallback, useRef, useState, type FormEvent } from 'react';
import { mapsUrl, org } from '../data/site';
import { mailtoHref } from '../lib/form';
import { submitMessage } from '../lib/formTransport';
import { checkCooldown, clearAttempts, describeWait, recordAttempt } from '../lib/rateLimit';
import { LIMITS, checkEmail, checkFullName, checkLength, newSubmissionId } from '../lib/validation';
import { ErrorSummary } from '../components/ErrorSummary';
import { FormField } from '../components/FormField';
import { PageShell } from '../components/PageShell';
import { useToast } from '../components/Toaster';
import { WhatsAppJoinLink } from '../components/WhatsAppJoinLink';

type ContactDraft = { name: string; email: string; message: string };
type ContactField = keyof ContactDraft;
type ContactErrors = Partial<Record<ContactField, string>>;

const FIELD_ORDER: ContactField[] = ['name', 'email', 'message'];

const COOLDOWN_KEY = 'contact';
const COOLDOWN_MAX = 3;
const COOLDOWN_WINDOW_MS = 10 * 60 * 1000;

const fieldId = (name: ContactField) => `contact-${name}`;

function validateField(field: ContactField, draft: ContactDraft): string | undefined {
  switch (field) {
    case 'name':
      return checkFullName(draft.name);
    case 'email':
      return checkEmail(draft.email);
    case 'message':
      if (draft.message.trim().length < 8) return 'Enter a short message.';
      return checkLength(draft.message, LIMITS.message);
    default:
      return undefined;
  }
}

function validate(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of FIELD_ORDER) {
    const error = validateField(field, draft);
    if (error) errors[field] = error;
  }
  return errors;
}

const emptyDraft = (): ContactDraft => ({ name: '', email: '', message: '' });

export function ContactPage() {
  const toast = useToast();
  const summaryRef = useRef<HTMLDivElement>(null);
  const submissionId = useRef(newSubmissionId());
  const openedAt = useRef(Date.now());

  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState('');
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const invalidFields = FIELD_ORDER.filter((field) => errors[field]);

  const setField = (key: ContactField, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const blur = (key: ContactField) => {
    setTouched((current) => ({ ...current, [key]: true }));
    setErrors((current) => ({ ...current, [key]: validateField(key, draft) }));
  };

  const send = useCallback(
    async (values: ContactDraft, website: string) => {
      setSending(true);
      setSubmitError('');
      recordAttempt(COOLDOWN_KEY, COOLDOWN_WINDOW_MS);

      const result = await submitMessage({
        fullName: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        message: values.message.trim(),
        website,
        source: 'website',
        submissionId: submissionId.current,
        elapsedMs: Date.now() - openedAt.current,
      });
      setSending(false);

      if (result.ok) {
        setSent(true);
        setReference(result.reference ?? '');
        setDraft(emptyDraft());
        setTouched({});
        clearAttempts(COOLDOWN_KEY);
        // A fresh message is a new submission, not a retry of this one.
        submissionId.current = newSubmissionId();
        openedAt.current = Date.now();
        toast.success('Message sent', {
          description: result.reference
            ? `Your reference is ${result.reference}.`
            : `ICGTMP will reply to ${values.email}.`,
          dedupeKey: COOLDOWN_KEY,
        });
        return;
      }

      if (result.code === 'INVALID_FIELD' && result.field) {
        const field = (result.field === 'fullName' ? 'name' : result.field) as ContactField;
        if (FIELD_ORDER.includes(field)) {
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
      }

      const message = result.error ?? 'We could not reach the form service.';
      setSubmitError(message);
      toast.error('Message not sent', {
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

    const nextErrors = validate(draft);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });

    if (FIELD_ORDER.some((field) => nextErrors[field])) {
      setShowSummary(true);
      window.setTimeout(() => summaryRef.current?.focus(), 20);
      return;
    }
    setShowSummary(false);

    const cooldown = checkCooldown(COOLDOWN_KEY, COOLDOWN_MAX, COOLDOWN_WINDOW_MS);
    if (cooldown.blocked) {
      const message = `You have sent ${COOLDOWN_MAX} messages already. Try again in ${describeWait(cooldown.secondsLeft)}.`;
      setSubmitError(message);
      toast.error('Too many attempts', { description: message, dedupeKey: COOLDOWN_KEY });
      return;
    }

    setSent(false);
    await send(draft, honeypot);
  };

  return (
    <PageShell kicker="Contact" title="Write to ICGTMP">
      <div className="contactLayout">
        <div>
          <p>
            The working address is at Ita&apos;le Market, Epe Waterfront. Write by email, or join
            the public WhatsApp group.
          </p>
          <p>
            <MapPin size={16} aria-hidden="true" /> {org.addressLines.join(', ')}
          </p>
          <p className="contactPhones">
            <Phone size={16} aria-hidden="true" />
            {org.phones.map((phone) => (
              <a key={phone.tel} href={`tel:${phone.tel}`}>
                {phone.display}
              </a>
            ))}
          </p>
          <p>
            <Mail size={16} aria-hidden="true" /> <a href={`mailto:${org.email}`}>{org.email}</a>
          </p>
          <p>
            <WhatsAppJoinLink />
          </p>
          <p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </p>
          <p className="quietNote">Office visits are by arrangement through email.</p>
        </div>

        <form className="contactForm" onSubmit={onSubmit} noValidate aria-busy={sending}>
          {showSummary ? (
            <ErrorSummary
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

          <FormField
            id={fieldId('name')}
            label="Full name"
            required
            error={touched.name ? errors.name : undefined}
          >
            <input
              value={draft.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => blur('name')}
              autoComplete="name"
              autoCapitalize="words"
              maxLength={LIMITS.fullName}
              required
            />
          </FormField>

          <FormField
            id={fieldId('email')}
            label="Email"
            required
            error={touched.email ? errors.email : undefined}
          >
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
              required
            />
          </FormField>

          <FormField
            id={fieldId('message')}
            label="Message"
            required
            error={touched.message ? errors.message : undefined}
            hint={
              draft.message.length > LIMITS.message * 0.8
                ? `${draft.message.length}/${LIMITS.message} characters`
                : undefined
            }
          >
            <textarea
              rows={5}
              value={draft.message}
              onChange={(e) => setField('message', e.target.value)}
              onBlur={() => blur('message')}
              maxLength={LIMITS.message}
              required
            />
          </FormField>

          <p className="formPrivacy">
            This message is sent to {org.email}. Read the <Link to="/privacy">Privacy Policy</Link>.
          </p>

          {submitError ? (
            <p className="formAlert" role="alert">
              {submitError} You can email{' '}
              <a href={mailtoHref('ICGTMP contact form', draft)}>{org.email}</a> instead.
            </p>
          ) : null}

          {sent ? (
            <p className="formNotice" role="status">
              Thank you. Your message has reached {org.email}.
              {reference ? ` Your reference is ${reference}.` : ''}
            </p>
          ) : null}

          <button className="goldPill" type="submit" disabled={sending}>
            {sending ? 'Sending…' : submitError ? 'Try again' : 'Send message'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
