/**
 * Field rules shared by every form on the site.
 *
 * These are mirrored in apps-script/Code.gs, which is the authority: the client
 * copy exists to give immediate feedback, not to be trusted. When a rule changes
 * here, change it there too.
 */

export const LIMITS = {
  fullName: 120,
  email: 160,
  phone: 24,
  ward: 80,
  profession: 120,
  marketAssociation: 160,
  organisation: 160,
  contactPerson: 120,
  supportType: 160,
  country: 80,
  volunteerInterest: 1000,
  message: 4000,
} as const;

/**
 * Nigerian mobile numbers are 0 + [7-9] + [0-1] + eight digits, so 0803…,
 * 0703…, 0817…, 0913… all pass while a run of ten arbitrary digits does not.
 */
const NG_MOBILE = /^[789][01]\d{8}$/;

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/**
 * Throwaway inboxes we cannot follow up on. Deliberately short - a long list
 * ages badly and starts rejecting real people.
 */
const DISPOSABLE_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'sharklasers.com',
  'tempmail.com',
  'throwawaymail.com',
  'trashmail.com',
  'yopmail.com',
];

/** Returns the number as +234XXXXXXXXXX, or null when it is not a valid NG mobile. */
export function normalizeNgPhone(raw: string): string | null {
  let digits = String(raw ?? '').replace(/\D/g, '');
  if (digits.startsWith('234')) digits = digits.slice(3);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  return NG_MOBILE.test(digits) ? `+234${digits}` : null;
}

/** Renders +2348030000000 back as 0803 000 0000 for display. */
export function formatNgPhone(e164: string): string {
  const digits = String(e164 ?? '').replace(/\D/g, '').replace(/^234/, '');
  if (!NG_MOBILE.test(digits)) return e164;
  return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function normalizeEmail(raw: string): string {
  return String(raw ?? '').trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  const value = normalizeEmail(raw);
  return value.length <= LIMITS.email && EMAIL.test(value);
}

export function isDisposableEmail(raw: string): boolean {
  const domain = normalizeEmail(raw).split('@')[1] ?? '';
  return DISPOSABLE_DOMAINS.includes(domain);
}

/** The one place that decides whether an email may be submitted. */
export function checkEmail(raw: string): string | undefined {
  const value = normalizeEmail(raw);
  if (!value) return 'Enter your email address.';
  return checkOptionalEmail(raw);
}

export function checkOptionalEmail(raw: string): string | undefined {
  const value = normalizeEmail(raw);
  if (!value) return undefined;
  if (!isValidEmail(value)) return 'Enter a valid email address.';
  if (isDisposableEmail(value)) return 'Use an email address you check regularly.';
  return undefined;
}

export function checkPhone(raw: string): string | undefined {
  if (!String(raw ?? '').trim()) return 'Enter your phone number.';
  if (!normalizeNgPhone(raw)) return 'Enter a valid Nigerian mobile number, e.g. 0803 000 0000.';
  return undefined;
}

export function checkFullName(raw: string): string | undefined {
  const value = String(raw ?? '').trim();
  if (!value) return 'Enter your full name.';
  if (value.length < 3) return 'Enter your full name.';
  if (value.length > LIMITS.fullName) return `Keep this under ${LIMITS.fullName} characters.`;
  // A register that coordinators have to phone from needs more than one name.
  if (!/\s/.test(value)) return 'Enter both your first and last name.';
  return undefined;
}

export function checkLength(raw: string, max: number): string | undefined {
  return String(raw ?? '').trim().length > max ? `Keep this under ${max} characters.` : undefined;
}

/**
 * Identifies one filled-in form so a retry after a timeout updates nothing and
 * creates nothing. Generated once per opened form, not once per submit attempt.
 */
export function newSubmissionId(): string {
  const cryptoApi = typeof crypto !== 'undefined' ? crypto : undefined;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
