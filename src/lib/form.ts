import { org } from '../data/site';

export type FormPayload = Record<string, string>;

const HONEYPOT_KEYS = ['_gotcha', 'company_website'];

export function mailtoHref(subject: string, payload: FormPayload) {
  const body = Object.entries(payload)
    .filter(([key]) => !key.startsWith('_') && !HONEYPOT_KEYS.includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  return `mailto:${org.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
