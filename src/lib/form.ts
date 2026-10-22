import { org } from '../data/site';

export type FormPayload = Record<string, string>;

export type FormResult =
  | { status: 'sent' }
  | { status: 'pending-confirm' }
  | { status: 'failed'; message: string };

function endpoint() {
  return (
    import.meta.env.VITE_FORM_ENDPOINT || `https://formsubmit.co/ajax/${org.email}`
  );
}

const HONEYPOT_KEYS = ['_gotcha', 'company_website'];

function withoutHoneypot(payload: FormPayload): FormPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !HONEYPOT_KEYS.includes(key)),
  );
}

export function isHoneypotFilled(payload: FormPayload): boolean {
  return HONEYPOT_KEYS.some((key) => Boolean(payload[key]?.trim()));
}

export async function submitPublicForm(payload: FormPayload, subject: string): Promise<FormResult> {
  if (isHoneypotFilled(payload)) {
    return { status: 'sent' };
  }

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 12_000);
    let response: Response;
    try {
      response = await fetch(endpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...withoutHoneypot(payload),
          _subject: subject,
          _template: 'table',
          _captcha: 'false',
          _honey: '',
        }),
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timer);
    }

    const data = (await response.json().catch(() => ({}))) as {
      success?: string | boolean;
      message?: string;
    };
    const message = String(data.message || data.success || '');
    const accepted = response.ok && (data.success === true || data.success === 'true');

    if (/activate|confirm|check your email/i.test(message)) {
      return { status: 'pending-confirm' };
    }

    if (accepted) {
      return { status: 'sent' };
    }

    return {
      status: 'failed',
      message: message || 'The form service could not accept this submission.',
    };
  } catch {
    return {
      status: 'failed',
      message: `We could not reach the form service. Email ${org.email} directly.`,
    };
  }
}

export function mailtoHref(subject: string, payload: FormPayload) {
  const body = Object.entries(payload)
    .filter(([key]) => !key.startsWith('_') && !HONEYPOT_KEYS.includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  return `mailto:${org.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
