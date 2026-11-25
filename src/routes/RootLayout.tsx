import { useEffect, type MouseEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MotionProvider, useMotion } from '../components/MotionProvider';
import { ToastProvider } from '../components/Toaster';
import { applyDocumentMeta, metaForPath } from '../lib/seo';
import { JoinProvider } from './JoinProvider';
import { pathForLegacyHash } from './legacyHash';

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { scrollTo, ready } = useMotion();

  useEffect(() => {
    const next = pathForLegacyHash(hash);
    if (!next) return;
    navigate({ pathname: next, hash: '' }, { replace: true });
  }, [hash, navigate]);

  useEffect(() => {
    applyDocumentMeta(metaForPath(pathname), pathname);
    if (!ready) return;
    const frame = window.requestAnimationFrame(() => {
      const id = hash.startsWith('#') ? decodeURIComponent(hash.slice(1)) : '';
      const target = id && id !== 'main' ? document.getElementById(id) : null;
      if (target) {
        scrollTo(target, true);
        const heading = target.querySelector('h1, h2');
        if (heading instanceof HTMLElement) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
        return;
      }
      scrollTo(null, true);
      const heading = document.querySelector('main h1');
      if (!(heading instanceof HTMLElement)) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, ready, scrollTo]);

  return null;
}

function samePageHashHref(href: string | null): string | null {
  if (!href || !href.startsWith('#') || href === '#') return null;
  return href;
}

function Shell() {
  const { pathname } = useLocation();
  const { scrollTo } = useMotion();
  const cinematic = pathname === '/';

  const onHashClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = samePageHashHref(anchor.getAttribute('href'));
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    scrollTo(el);
    if (hash !== '#main') {
      window.history.pushState(null, '', hash);
    }
  };

  return (
    <div className={cinematic ? 'app appCinematic' : 'app'} onClick={onHashClick}>
      <a className="skipLink" href="#main">
        Skip to content
      </a>
      <Header />
      <div id="main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export function RootLayout() {
  return (
    <ToastProvider>
      <JoinProvider>
        <MotionProvider>
          <Shell />
          <RouteEffects />
        </MotionProvider>
      </JoinProvider>
    </ToastProvider>
  );
}
