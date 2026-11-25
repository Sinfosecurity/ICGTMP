import type Lenis from 'lenis';

/** Fixed header clearance for Lenis / native in-page scrolls. */
export const SCROLL_HEADER_OFFSET = 72;

export type ScrollToTargetOptions = {
  lenis?: Lenis | null;
  /** Native scroll behavior when Lenis is inactive. Default: `auto`. */
  behavior?: ScrollBehavior;
  /** Lenis immediate jump (no animation). */
  immediate?: boolean;
};

function resolveElement(target: string | Element): Element | null {
  if (typeof target !== 'string') return target;
  const raw = target.trim();
  if (!raw || raw === '#') return null;
  const id = raw.startsWith('#') ? decodeURIComponent(raw.slice(1)) : raw;
  if (!id) return null;
  return document.getElementById(id);
}

/**
 * Scroll to an element, `#hash`, or top of page.
 * Uses Lenis when active; otherwise native window scroll with the same header offset.
 */
export function scrollToTarget(
  target: string | Element | null | undefined,
  options: ScrollToTargetOptions = {},
): boolean {
  const { lenis = null, behavior = 'auto', immediate = false } = options;

  if (target == null || target === '' || target === '#') {
    if (lenis) {
      lenis.scrollTo(0, { immediate, offset: 0 });
      return true;
    }
    window.scrollTo({ top: 0, behavior });
    return true;
  }

  if (typeof target === 'string' && (target === '#main' || target === 'main')) {
    const main = document.getElementById('main');
    if (!main) return false;
    return scrollToTarget(main, options);
  }

  const el = resolveElement(target);
  if (!el) return false;

  if (lenis) {
    lenis.scrollTo(el, { offset: -SCROLL_HEADER_OFFSET, immediate });
    return true;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}
