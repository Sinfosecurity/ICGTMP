let lockCount = 0;
let savedY = 0;
let unlockTimer: number | null = null;

function applyLock() {
  savedY = window.scrollY;
  document.documentElement.classList.add('scrollLock');
  document.body.classList.add('scrollLock');
  document.body.style.top = `-${savedY}px`;
}

function applyUnlock() {
  document.documentElement.classList.remove('scrollLock');
  document.body.classList.remove('scrollLock');
  document.body.style.top = '';
  window.scrollTo(0, savedY);
}

export function lockPageScroll(): () => void {
  if (unlockTimer != null) {
    window.clearTimeout(unlockTimer);
    unlockTimer = null;
    lockCount += 1;
  } else if (lockCount === 0) {
    applyLock();
    lockCount = 1;
  } else {
    lockCount += 1;
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;
    unlockTimer = window.setTimeout(() => {
      unlockTimer = null;
      if (lockCount === 0) applyUnlock();
    }, 0);
  };
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function focusables(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => !el.closest('[aria-hidden="true"]') && el.getClientRects().length > 0,
  );
}

export function trapTab(event: KeyboardEvent, root: HTMLElement) {
  if (event.key !== 'Tab') return;
  const nodes = focusables(root);
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
