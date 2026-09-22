import { MapPin, Mail } from 'lucide-react';
import { useCallback, useState, type FormEvent } from 'react';
import { mapsUrl, org } from '../data/content';
import { mailtoHref } from '../lib/form';
import { submitMessage } from '../lib/formTransport';
import { PageShell } from '../components/PageShell';
import { useToast } from '../components/Toaster';
import { WhatsAppJoinLink } from '../components/WhatsAppJoinLink';

type ContactDraft = { name: string; email: string; message: string };
type ContactErrors = Partial<Record<keyof ContactDraft, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_ORDER: (keyof ContactDraft)[] = ['name', 'email', 'message'];

function validate(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {};
  if (draft.name.trim().length < 3) errors.name = 'Enter your full name.';
  if (!emailPattern.test(draft.email.trim())) errors.email = 'Enter a valid email address.';
  if (draft.message.trim().length < 8) errors.message = 'Enter a short message.';
  return errors;
}

export function ContactPage() {
  const toast = useToast();
  const [draft, setDraft] = useState<ContactDraft>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const payload = { name: draft.name, email: draft.email, message: draft.message };

  const setField = (key: keyof ContactDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const send = useCallback(
    async (values: ContactDraft, website: string) => {
      setSending(true);
      setSubmitError('');
      const result = await submitMessage({
        fullName: values.name,
        email: values.email,
        message: values.message,
        website,
        source: 'website',
      });
      setSending(false);

      if (result.ok) {
        setSent(true);
        setDraft({ name: '', email: '', message: '' });
        toast.success('Message sent', {
          description: `Thank you. ICGTMP will reply to ${values.email}.`,
          dedupeKey: 'contact',
        });
        if (result.warning) {
          toast.warning('Saved by email only', {
            description: result.warning,
            dedupeKey: 'contact-warning',
          });
        }
        return;
      }

      if (result.emailPendingConfirm) {
        setSubmitError(`The inbox needs a one-time confirmation. Please email ${org.email} directly as well.`);
        toast.warning('One more step needed', {
          description: `The inbox needs a one-time confirmation. Please email ${org.email} directly as well.`,
          dedupeKey: 'contact',
        });
        return;
      }

      const message = result.error ?? 'We could not reach the form service.';
      setSubmitError(message);
      toast.error('Message not sent', {
        description: message,
        dedupeKey: 'contact',
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
    const nextErrors = validate(draft);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name]);
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      toast.error('Check the highlighted fields', {
        description: nextErrors[firstInvalid],
        dedupeKey: 'contact',
        duration: 8000,
      });
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
          <label className="hpField" aria-hidden="true">
            Company website
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
          <label htmlFor="contact-name">
            Full name
            <input
              id="contact-name"
              value={draft.name}
              onChange={(e) => setField('name', e.target.value)}
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              required
            />
            {errors.name ? (
              <span className="fieldError" id="contact-name-error">
                {errors.name}
              </span>
            ) : null}
          </label>
          <label htmlFor="contact-email">
            Email
            <input
              id="contact-email"
              type="email"
              value={draft.email}
              onChange={(e) => setField('email', e.target.value)}
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              required
            />
            {errors.email ? (
              <span className="fieldError" id="contact-email-error">
                {errors.email}
              </span>
            ) : null}
          </label>
          <label htmlFor="contact-message">
            Message
            <textarea
              id="contact-message"
              rows={5}
              value={draft.message}
              onChange={(e) => setField('message', e.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              required
            />
            {errors.message ? (
              <span className="fieldError" id="contact-message-error">
                {errors.message}
              </span>
            ) : null}
          </label>
          <p className="formPrivacy">
            This message is sent to {org.email}. Read the <a href="#privacy">Privacy Policy</a>.
          </p>
          {submitError ? (
            <p className="formAlert" role="alert">
              {submitError} You can email{' '}
              <a href={mailtoHref('ICGTMP contact form', payload)}>{org.email}</a> instead.
            </p>
          ) : null}
          {sent ? (
            <p className="formNotice" role="status">
              Thank you. Your message has been sent to {org.email}.
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
