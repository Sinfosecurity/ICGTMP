import { submitPublicForm, type FormPayload } from './form';

/**
 * The stable contract with apps-script/Code.gs, plus the transport-level
 * outcomes the script never gets to answer.
 */
export type SubmitCode =
  // from the server
  | 'CREATED'
  | 'DUPLICATE'
  | 'INVALID_FIELD'
  | 'RATE_LIMITED'
  | 'BUSY'
  | 'SERVER_ERROR'
  | 'UNKNOWN_FORM'
  // decided here
  | 'OFFLINE'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'BAD_RESPONSE'
  | 'NOT_CONFIGURED';

export type TransportResult = {
  ok: boolean;
  code: SubmitCode;
  /** The field the server rejected, matching the client's field names. */
  field?: string;
  error?: string;
  /** Short receipt the visitor can quote back to a coordinator. */
  reference?: string;
  /** Seconds to wait before a rate-limited submission is worth retrying. */
  retryAfter?: number;
  /** Whether resending the same values could plausibly succeed. */
  retryable: boolean;
  /** The email notification also went out. */
  notified: boolean;
  emailPendingConfirm?: boolean;
};

export type MembershipPayload = {
  fullName: string;
  phone: string;
  email: string;
  lga: string;
  lcda: string;
  ward?: string;
  profession?: string;
  marketAssociation?: string;
  category: string;
  volunteerInterest?: string;
  website?: string;
  source?: string;
  submissionId: string;
  elapsedMs: number;
};

export type MessagePayload = {
  fullName: string;
  email: string;
  message: string;
  website?: string;
  source?: string;
  submissionId: string;
  elapsedMs: number;
};

type SheetResponse = {
  ok?: boolean;
  code?: string;
  field?: string;
  error?: string;
  reference?: string;
  retryAfter?: number;
};

const TIMEOUT_MS = 12_000;

/**
 * Plain statements of what went wrong. What the visitor should do instead is
 * UI copy, so callers append it rather than it being baked in here.
 */
const MESSAGES: Record<SubmitCode, string> = {
  CREATED: '',
  DUPLICATE: 'These details are already on the register.',
  INVALID_FIELD: 'Please check the highlighted field.',
  RATE_LIMITED: 'Too many attempts. Please wait a little before trying again.',
  BUSY: 'The register is busy right now.',
  SERVER_ERROR: 'Something went wrong on our side.',
  UNKNOWN_FORM: 'This form could not be processed.',
  OFFLINE: 'You appear to be offline. Check your connection and try again.',
  TIMEOUT: 'The form service did not respond in time.',
  NETWORK: 'We could not reach the form service.',
  BAD_RESPONSE: 'The form service returned an unexpected response.',
  NOT_CONFIGURED: 'The form is not connected to the register yet.',
};

/** Resending identical values only helps when the failure was transport-level. */
const RETRYABLE: SubmitCode[] = ['OFFLINE', 'TIMEOUT', 'NETWORK', 'BAD_RESPONSE', 'BUSY', 'SERVER_ERROR'];

const SERVER_CODES: SubmitCode[] = [
  'CREATED',
  'DUPLICATE',
  'INVALID_FIELD',
  'RATE_LIMITED',
  'BUSY',
  'SERVER_ERROR',
  'UNKNOWN_FORM',
];

function sheetEndpoint(): string {
  return (import.meta.env.VITE_SHEET_ENDPOINT || '').trim();
}

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, redirect: 'follow' });
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Apps Script web apps cannot answer CORS preflight. text/plain avoids OPTIONS.
 * redirect: 'follow' is required so script.google.com -> googleusercontent.com
 * resolves and the JSON body is readable. Do not "fix" this to application/json.
 */
async function postSheet(body: Record<string, string | number>): Promise<SheetResponse & { code: SubmitCode }> {
  const url = sheetEndpoint();
  if (!url) return { code: 'NOT_CONFIGURED' };
  if (isOffline()) return { code: 'OFFLINE' };

  let response: Response;
  try {
    response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
  } catch (error) {
    return { code: isAbort(error) ? 'TIMEOUT' : 'NETWORK' };
  }

  if (!response.ok) return { code: 'NETWORK' };

  let data: SheetResponse;
  try {
    data = (await response.json()) as SheetResponse;
  } catch {
    // A missing or misconfigured deployment answers with an HTML error page.
    return { code: 'BAD_RESPONSE' };
  }

  const code = SERVER_CODES.includes(data.code as SubmitCode)
    ? (data.code as SubmitCode)
    : data.ok
      ? 'CREATED'
      : 'BAD_RESPONSE';

  return { ...data, code };
}

async function postEmail(payload: FormPayload, subject: string): Promise<'sent' | 'pending' | 'failed'> {
  const result = await submitPublicForm(payload, subject);
  if (result.status === 'sent') return 'sent';
  if (result.status === 'pending-confirm') return 'pending';
  return 'failed';
}

/**
 * The spreadsheet decides the outcome; the email is a notification, not a
 * second chance. Reporting success because an email went out while the register
 * rejected the row is how people end up believing they are members when no row
 * exists. The one exception is a site with no endpoint configured, where the
 * email is all there is.
 */
function settle(
  sheetSettled: PromiseSettledResult<SheetResponse & { code: SubmitCode }>,
  emailSettled: PromiseSettledResult<'sent' | 'pending' | 'failed'>,
): TransportResult {
  const sheet =
    sheetSettled.status === 'fulfilled'
      ? sheetSettled.value
      : ({ code: 'NETWORK' } as SheetResponse & { code: SubmitCode });
  const emailState = emailSettled.status === 'fulfilled' ? emailSettled.value : 'failed';

  const notified = emailState === 'sent';
  const emailPendingConfirm = emailState === 'pending';
  const base = { notified, emailPendingConfirm };

  if (sheet.code === 'NOT_CONFIGURED') {
    return notified
      ? { ...base, ok: true, code: 'CREATED', retryable: false }
      : {
          ...base,
          ok: false,
          code: 'NETWORK',
          error: MESSAGES.NETWORK,
          retryable: true,
        };
  }

  const ok = sheet.code === 'CREATED' || sheet.code === 'DUPLICATE';

  return {
    ...base,
    ok,
    code: sheet.code,
    field: sheet.field,
    reference: sheet.reference,
    retryAfter: sheet.retryAfter,
    retryable: RETRYABLE.includes(sheet.code),
    error: ok ? undefined : sheet.error?.trim() || MESSAGES[sheet.code],
  };
}

/** A bot that filled the honeypot is told nothing useful. */
const HONEYPOT_RESULT: TransportResult = {
  ok: true,
  code: 'CREATED',
  retryable: false,
  notified: false,
};

export async function submitMembership(payload: MembershipPayload): Promise<TransportResult> {
  const website = payload.website?.trim() ?? '';
  const sheetBody = {
    form: 'membership',
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    lga: payload.lga,
    lcda: payload.lcda,
    ward: payload.ward ?? '',
    profession: payload.profession ?? '',
    marketAssociation: payload.marketAssociation ?? '',
    category: payload.category,
    volunteerInterest: payload.volunteerInterest ?? '',
    website,
    source: payload.source ?? 'website',
    submissionId: payload.submissionId,
    elapsedMs: payload.elapsedMs,
  };

  if (website) {
    try {
      await postSheet(sheetBody);
    } catch {
      // Honeypot: still report success so a bot is not given a signal.
    }
    return HONEYPOT_RESULT;
  }

  const emailPayload: FormPayload = {
    name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    lga: payload.lga,
    lcda: payload.lcda,
    ward: payload.ward ?? '',
    profession: payload.profession ?? '',
    marketAssociation: payload.marketAssociation ?? '',
    category: payload.category,
    volunteerInterest: payload.volunteerInterest ?? '',
  };

  const [sheet, email] = await Promise.allSettled([
    postSheet(sheetBody),
    postEmail(emailPayload, 'ICGTMP membership interest'),
  ]);

  return settle(sheet, email);
}

export async function submitMessage(payload: MessagePayload): Promise<TransportResult> {
  const website = payload.website?.trim() ?? '';
  const sheetBody = {
    form: 'message',
    fullName: payload.fullName,
    email: payload.email,
    message: payload.message,
    website,
    source: payload.source ?? 'website',
    submissionId: payload.submissionId,
    elapsedMs: payload.elapsedMs,
  };

  if (website) {
    try {
      await postSheet(sheetBody);
    } catch {
      // Honeypot: still report success so a bot is not given a signal.
    }
    return HONEYPOT_RESULT;
  }

  const [sheet, email] = await Promise.allSettled([
    postSheet(sheetBody),
    postEmail(
      { name: payload.fullName, email: payload.email, message: payload.message },
      'ICGTMP contact form',
    ),
  ]);

  return settle(sheet, email);
}
