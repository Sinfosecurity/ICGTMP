/**
 * Client-side submission throttle.
 *
 * This is a courtesy guard, not a security control: it lives in localStorage
 * and anyone can clear it. Its job is to stop an impatient visitor hammering
 * the submit button and to answer instantly instead of burning a round trip.
 * The real limit is enforced in apps-script/Code.gs.
 */

type Attempt = number;

const PREFIX = 'icgtmp.rate.';

export type Cooldown = {
  blocked: boolean;
  /** Whole seconds until the next attempt is allowed. */
  secondsLeft: number;
};

const ALLOWED: Cooldown = { blocked: false, secondsLeft: 0 };

function read(key: string): Attempt[] {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

function write(key: string, attempts: Attempt[]): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(attempts));
  } catch {
    // Storage being unavailable just means no client-side throttle.
  }
}

/** Attempts still inside the window, oldest first. */
function recent(key: string, windowMs: number): Attempt[] {
  const cutoff = Date.now() - windowMs;
  return read(key)
    .filter((at) => at > cutoff)
    .sort((a, b) => a - b);
}

export function checkCooldown(key: string, max: number, windowMs: number): Cooldown {
  const attempts = recent(key, windowMs);
  if (attempts.length < max) return ALLOWED;
  const freesAt = attempts[0] + windowMs;
  return { blocked: true, secondsLeft: Math.max(1, Math.ceil((freesAt - Date.now()) / 1000)) };
}

export function recordAttempt(key: string, windowMs: number): void {
  write(key, [...recent(key, windowMs), Date.now()]);
}

/** Called after a successful submission, so a later correction is not blocked. */
export function clearAttempts(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Nothing to recover from.
  }
}

export function describeWait(seconds: number): string {
  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}
