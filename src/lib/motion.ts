import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const MOTION_EASE = 'power3.out';
export const MOTION_DURATION = 1;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type MotionRuntime = {
  lenis: Lenis | null;
  reduced: boolean;
  destroy: () => void;
};

/** Start Lenis + ScrollTrigger once. Skips Lenis when reduced motion is preferred. */
export function startMotionRuntime(): MotionRuntime {
  ScrollTrigger.config({ ignoreMobileResize: true });

  let lenis: Lenis | null = null;
  let tickerFn: ((time: number) => void) | null = null;
  const reduced = prefersReducedMotion();

  if (!reduced) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    tickerFn = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
  }

  const destroy = () => {
    if (tickerFn) gsap.ticker.remove(tickerFn);
    lenis?.destroy();
    lenis = null;
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };

  return { lenis, reduced, destroy };
}
