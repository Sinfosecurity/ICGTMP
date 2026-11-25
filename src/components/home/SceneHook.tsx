import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { fadeUpOnce } from '../../lib/fadeUp';
import { useMotion } from '../MotionProvider';

const STATEMENT =
  "Traders, artisans and professionals keep Lagos East running. ICGMTP makes sure they're counted.";

export function SceneHook() {
  const { ready } = useMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const root = rootRef.current;
    const line = root.querySelector<HTMLElement>('.cineHookLine');
    if (!line) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(line, { opacity: 1, y: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        fadeUpOnce(line, { trigger: root });
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={rootRef} className="cineHook" aria-labelledby="cine-hook-title">
      <h2 id="cine-hook-title" className="visuallyHidden">
        Why ICGMTP exists
      </h2>
      <p className="cineHookLine cineReveal">{STATEMENT}</p>
    </section>
  );
}
