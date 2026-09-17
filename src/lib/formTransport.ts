import { org } from '../data/content';
import { submitPublicForm, type FormPayload } from './form';

export type TransportResult = {
  ok: boolean;
  storedInSheet: boolean;
  emailSent: boolean;
  emailPendingConfirm?: boolean;
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

const REACH_ERROR = `We could not reach the form service. Email ${org.email} directly.`;
const TIMEOUT_MS = 12_000;

function sheetEndpoint(): string {
  return (import.meta.env.VITE_SHEET_ENDPOINT || '').trim();
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
 * redirect: 'follow' is required so script.google.com → googleusercontent.com
 * resolves and the JSON body is readable. Do not "fix" this to application/json.
 */
async function postSheet(body: Record<string, string>): Promise<boolean> {
  const url = sheetEndpoint();
  if (!url) return false;

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    redirect: 'follow',
  });

  const data = (await response.json().catch(() => ({}))) as SheetResponse;
  return Boolean(response.ok && data.ok);
}

async function postEmail(payload: FormPayload, subject: string): Promise<'sent' | 'pending' | 'failed'> {
  const result = await submitPublicForm(payload, subject);
  if (result.status === 'sent') return 'sent';
  if (result.status === 'pending-confirm') return 'pending';
  return 'failed';
}

function settle(sheet: PromiseSettledResult<boolean>, email: PromiseSettledResult<'sent' | 'pending' | 'failed'>): TransportResult {
  const storedInSheet = sheet.status === 'fulfilled' && sheet.value;
  const emailState = email.status === 'fulfilled' ? email.value : 'failed';
  const emailSent = emailState === 'sent';
  const emailPendingConfirm = emailState === 'pending';
  const ok = storedInSheet || emailSent;

  if (ok) {
    return { ok: true, storedInSheet, emailSent, emailPendingConfirm };
  }

  if (emailPendingConfirm) {
    return {
      ok: false,
      storedInSheet,
      emailSent: false,
      emailPendingConfirm: true,
      error: REACH_ERROR,
    };
  }

  return { ok: false, storedInSheet: false, emailSent: false, error: REACH_ERROR };
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
