import gsap from 'gsap';
import { MOTION_EASE } from './motion';

type FadeExtras = gsap.TweenVars & {
  trigger?: gsap.DOMTarget;
};

/**
 * One-shot fade-up reveal. Never uses scrub.
 * Targets should also carry `.cineReveal` so CSS keeps them hidden until
 * `html.motion-ready` — avoids a visible-then-hidden FOUC before GSAP runs.
 */
export function fadeUpOnce(targets: gsap.TweenTarget, extras: FadeExtras = {}) {
  const { trigger, scrollTrigger, ...tween } = extras;
  const scrollOpts =
    scrollTrigger && typeof scrollTrigger === 'object' ? scrollTrigger : {};

  return gsap.fromTo(
    targets,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: MOTION_EASE,
      immediateRender: true,
      ...tween,
      scrollTrigger: {
        trigger: trigger ?? (targets as gsap.DOMTarget),
        start: 'top 85%',
        once: true,
        ...scrollOpts,
      },
    },
  );
}
