import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ToastProvider } from '../components/Toaster';
import { applyDocumentMeta, metaForPath } from '../lib/seo';
import { JoinProvider } from './JoinProvider';
import { pathForLegacyHash } from './legacyHash';

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const next = pathForLegacyHash(hash);
    if (!next) return;
    navigate({ pathname: next, hash: '' }, { replace: true });
  }, [hash, navigate]);

  useEffect(() => {
    applyDocumentMeta(metaForPath(pathname));
    window.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => {
      const heading = document.querySelector('main h1');
      if (!(heading instanceof HTMLElement)) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

export function RootLayout() {
  return (
    <ToastProvider>
      <JoinProvider>
        <div className="app">
          <a className="skipLink" href="#main">
            Skip to content
          </a>
          <Header />
          <div id="main">
            <Outlet />
          </div>
          <Footer />
        </div>
        <RouteEffects />
      </JoinProvider>
    </ToastProvider>
  );
}
