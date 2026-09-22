import { submitPublicForm, type FormPayload } from './form';

/** Why a submission could not be stored. `rejected` means the server said no. */
export type FailureKind = 'offline' | 'timeout' | 'network' | 'rejected' | 'unknown';

export type TransportResult = {
  ok: boolean;
  storedInSheet: boolean;
  emailSent: boolean;
  emailPendingConfirm?: boolean;
  /** The sheet already holds a matching entry, so no new row was written. */
  duplicate?: boolean;
  /** Set when the submission succeeded but something still needs attention. */
  warning?: string;
  failure?: FailureKind;
  error?: string;
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
};

export type MessagePayload = {
  fullName: string;
  email: string;
  message: string;
  website?: string;
  source?: string;
};

type SheetResponse = {
  ok?: boolean;
  duplicate?: boolean;
  error?: string;
};

type SheetOutcome =
  | { kind: 'ok'; duplicate: boolean }
  /** No endpoint is configured, so the sheet leg never ran. */
  | { kind: 'skipped' }
  | { kind: 'rejected'; message: string }
  | { kind: 'unreachable'; failure: Exclude<FailureKind, 'rejected'> };

const TIMEOUT_MS = 12_000;

/**
 * Plain statements of what went wrong. The fallback the visitor should take
 * next is UI copy, so callers append it rather than baking it in here.
 */
const FAILURE_MESSAGES: Record<FailureKind, string> = {
  offline: 'You appear to be offline. Check your connection and try again.',
  timeout: 'The form service did not respond in time.',
  network: 'We could not reach the form service.',
  rejected: 'The form service could not accept this submission.',
  unknown: 'We could not reach the form service.',
};

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
async function postSheet(body: Record<string, string>): Promise<SheetOutcome> {
  const url = sheetEndpoint();
  if (!url) return { kind: 'skipped' };
  if (isOffline()) return { kind: 'unreachable', failure: 'offline' };

  let response: Response;
  try {
    response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
  } catch (error) {
    return { kind: 'unreachable', failure: isAbort(error) ? 'timeout' : 'network' };
  }

  if (!response.ok) return { kind: 'unreachable', failure: 'network' };

  let data: SheetResponse;
  try {
    data = (await response.json()) as SheetResponse;
  } catch {
    // A missing or misconfigured deployment answers with an HTML error page.
    return { kind: 'unreachable', failure: 'unknown' };
  }

  if (data.ok) return { kind: 'ok', duplicate: Boolean(data.duplicate) };
  return { kind: 'rejected', message: data.error?.trim() || FAILURE_MESSAGES.rejected };
}

async function postEmail(payload: FormPayload, subject: string): Promise<'sent' | 'pending' | 'failed'> {
  const result = await submitPublicForm(payload, subject);
  if (result.status === 'sent') return 'sent';
  if (result.status === 'pending-confirm') return 'pending';
  return 'failed';
}

function settle(
  sheetSettled: PromiseSettledResult<SheetOutcome>,
  emailSettled: PromiseSettledResult<'sent' | 'pending' | 'failed'>,
): TransportResult {
  const sheet: SheetOutcome =
    sheetSettled.status === 'fulfilled'
      ? sheetSettled.value
      : { kind: 'unreachable', failure: 'unknown' };
  const emailState = emailSettled.status === 'fulfilled' ? emailSettled.value : 'failed';

  const storedInSheet = sheet.kind === 'ok';
  const duplicate = sheet.kind === 'ok' && sheet.duplicate;
  const emailSent = emailState === 'sent';
  const emailPendingConfirm = emailState === 'pending';

  if (storedInSheet || emailSent) {
    return {
      ok: true,
      storedInSheet,
      emailSent,
      emailPendingConfirm,
      duplicate,
      // The email got through but the spreadsheet - the system of record -
      // refused the data, so a coordinator has to enter this one by hand.
      warning: !storedInSheet && sheet.kind === 'rejected' ? sheet.message : undefined,
    };
  }

  // Nothing landed anywhere. A rejection explains more than a transport error.
  if (sheet.kind === 'rejected') {
    return {
      ok: false,
      storedInSheet: false,
      emailSent: false,
      emailPendingConfirm,
      failure: 'rejected',
      error: sheet.message,
    };
  }

  const failure: FailureKind = sheet.kind === 'unreachable' ? sheet.failure : 'unknown';

  return {
    ok: false,
    storedInSheet: false,
    emailSent: false,
    emailPendingConfirm,
    failure,
    error: FAILURE_MESSAGES[failure],
  };
}

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
  };

  if (website) {
    try {
      await postSheet(sheetBody);
    } catch {
      // Honeypot: still report success so a bot is not given a signal.
    }
    return { ok: true, storedInSheet: false, emailSent: false };
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
  };

  if (website) {
    try {
      await postSheet(sheetBody);
    } catch {
      // Honeypot: still report success so a bot is not given a signal.
    }
    return { ok: true, storedInSheet: false, emailSent: false };
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
