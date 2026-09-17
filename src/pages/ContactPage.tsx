import { MapPin, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { mapsUrl, org } from '../data/content';
import { mailtoHref } from '../lib/form';
import { submitMessage } from '../lib/formTransport';
import { PageShell } from '../components/PageShell';
import { WhatsAppJoinLink } from '../components/WhatsAppJoinLink';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'pending' | 'failed'>('idle');
  const [error, setError] = useState('');

  const payload = { name, email, message, company_website: honeypot };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 3 || !email.includes('@') || message.trim().length < 8) {
      setError('Enter your name, a valid email and a short message.');
      return;
    }
    setError('');
    setStatus('sending');
    const result = await submitMessage({
      fullName: name,
      email,
      message,
      website: honeypot,
      source: 'website',
    });
    if (result.ok) setStatus('sent');
    else if (result.emailPendingConfirm) setStatus('pending');
    else {
      setStatus('failed');
      setError(result.error ?? `We could not reach the form service. Email ${org.email} directly.`);
    }
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
        <form className="contactForm" onSubmit={onSubmit} noValidate>
          <label className="hpField" aria-hidden="true">
            Company website
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Message
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>
          <p className="formPrivacy">
            This message is sent to {org.email}. Read the <a href="#privacy">Privacy Policy</a>.
          </p>
          {error ? <p className="fieldError">{error}</p> : null}
          {status === 'sent' && <p>Thank you. Your message has been sent to {org.email}.</p>}
          {status === 'pending' && (
            <p>
              The inbox needs a one-time confirmation. Please email{' '}
              <a href={mailtoHref('ICGTMP contact form', payload)}>{org.email}</a> directly as well.
            </p>
          )}
          <button className="goldPill" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
