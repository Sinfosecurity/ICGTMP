import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { startMotionRuntime, type MotionRuntime } from '../lib/motion';
import { scrollToTarget } from '../lib/scrollToTarget';

type MotionContextValue = {
  reduced: boolean;
  ready: boolean;
  lenis: Lenis | null;
  scrollTo: (target: string | Element | null | undefined, immediate?: boolean) => boolean;
};

const MotionContext = createContext<MotionContextValue>({
  reduced: false,
  ready: false,
  lenis: null,
  scrollTo: () => false,
});

export function useMotion() {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [runtime, setRuntime] = useState<MotionRuntime | null>(null);

  useEffect(() => {
    const next = startMotionRuntime();
    setRuntime(next);
    const root = document.documentElement;
    root.classList.toggle('reducedMotion', next.reduced);
    root.classList.toggle('smoothScroll', Boolean(next.lenis));
    return () => {
      next.destroy();
      root.classList.remove('reducedMotion', 'smoothScroll', 'motion-ready');
    };
  }, []);

  // Lift CSS hide only after scene effects have had a chance to attach GSAP from-states.
  useEffect(() => {
    if (!runtime) return;
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        document.documentElement.classList.add('motion-ready');
      });
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
      document.documentElement.classList.remove('motion-ready');
    };
  }, [runtime]);

  useEffect(() => {
    runtime?.lenis?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, runtime]);

  const scrollTo = useCallback(
    (target: string | Element | null | undefined, immediate = false) =>
      scrollToTarget(target, {
        lenis: runtime?.lenis ?? null,
        immediate,
        behavior: runtime?.reduced ? 'auto' : 'smooth',
      }),
    [runtime],
  );

  const value = useMemo(
    () => ({
      reduced: runtime?.reduced ?? false,
      ready: Boolean(runtime),
      lenis: runtime?.lenis ?? null,
      scrollTo,
    }),
    [runtime, scrollTo],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
