function headerOffset(): number {
  const header = document.querySelector('.siteHeader');
  return header instanceof HTMLElement ? header.getBoundingClientRect().height + 8 : 124;
}

function resolveScrollId(id: string): string {
  if (id !== 'leadership' && id !== 'news-and-events') return id;
  const row = document.getElementById('home-lower');
  const news = document.getElementById('news-and-events');
  const lead = document.getElementById('leadership');
  if (!row || !news || !lead) return id;
  const sameRow = Math.abs(news.getBoundingClientRect().top - lead.getBoundingClientRect().top) < 48;
  return sameRow ? 'home-lower' : id;
}

export function scrollWindowToId(id: string, behavior: ScrollBehavior): boolean {
  const el = document.getElementById(resolveScrollId(id));
  if (!el) return false;
  const top = window.scrollY + el.getBoundingClientRect().top - headerOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export function scrollToIdWhenReady(id: string, behavior: ScrollBehavior): () => void {
  let cancelled = false;
  let frames = 0;
  const timers: number[] = [];

  const align = (nextBehavior: ScrollBehavior) => {
    if (cancelled) return false;
    return scrollWindowToId(id, nextBehavior);
  };

  const verify = () => {
    if (cancelled) return;
    const el = document.getElementById(resolveScrollId(id));
    if (!el) return;
    const delta = el.getBoundingClientRect().top - headerOffset();
    if (Math.abs(delta) > 10) {
      window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: 'auto' });
    }
  };

  const start = () => {
    if (cancelled) return;
    if (!align(frames === 0 ? behavior : 'auto')) {
      if (frames++ < 40) {
        requestAnimationFrame(start);
      }
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(verify));
    timers.push(window.setTimeout(verify, 160));
    timers.push(window.setTimeout(verify, 480));
  };

  requestAnimationFrame(start);

  return () => {
    cancelled = true;
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}
