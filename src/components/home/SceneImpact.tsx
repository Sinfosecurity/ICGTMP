import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { goals } from '../../data/goals';
import { fadeUpOnce } from '../../lib/fadeUp';
import { MOTION_EASE } from '../../lib/motion';
import { useMotion } from '../MotionProvider';

function parseFigure(figure?: string): { value: number; suffix: string } | null {
  if (!figure) return null;
  const match = figure.trim().match(/^([\d.]+)\s*([A-Za-z%]*)$/);
  if (!match) return null;
  return { value: Number(match[1]), suffix: match[2] ?? '' };
}

function counterLabel(el: HTMLElement): string {
  return `${el.dataset.count ?? ''}${el.dataset.suffix ?? ''}`;
}

export function SceneImpact() {
  const { ready } = useMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const root = rootRef.current;
    const stats = root.querySelector<HTMLElement>('.cineImpactStats');
    const counters = root.querySelectorAll<HTMLElement>('[data-count]');
    const quote = root.querySelector<HTMLElement>('.cineImpactQuote');

    const showFinalCounters = () => {
      counters.forEach((el) => {
        el.textContent = counterLabel(el);
      });
    };

    const revealDone = (el: HTMLElement | null) => {
      if (!el) return;
      gsap.set(el, { opacity: 1, y: 0 });
      el.classList.add('is-revealed');
    };

    // Keep real end values in the DOM until a scroll-triggered count starts.
    showFinalCounters();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        showFinalCounters();
        revealDone(stats);
        revealDone(quote);
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (stats) {
          fadeUpOnce(stats, {
            trigger: stats,
            onComplete: () => revealDone(stats),
          });
        }
        if (quote) {
          fadeUpOnce(quote, {
            trigger: quote,
            onComplete: () => revealDone(quote),
          });
        }

        counters.forEach((el) => {
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix ?? '';
          if (!Number.isFinite(target)) {
            el.textContent = counterLabel(el);
            return;
          }

          const state = { value: target };
          gsap.fromTo(
            state,
            { value: 0 },
            {
              value: target,
              duration: 1.2,
              ease: MOTION_EASE,
              immediateRender: false,
              scrollTrigger: {
                trigger: stats ?? el,
                start: 'top 85%',
                once: true,
              },
              onStart: () => {
                el.textContent = `0${suffix}`;
              },
              onUpdate: () => {
                el.textContent = `${Math.round(state.value)}${suffix}`;
              },
              onComplete: () => {
                el.textContent = `${target}${suffix}`;
              },
            },
          );
        });
      });

      return () => mm.revert();
    }, root);

    return () => {
      showFinalCounters();
      revealDone(stats);
      revealDone(quote);
      ctx.revert();
    };
  }, [ready]);

  return (
    <section ref={rootRef} className="cineImpact" aria-labelledby="cine-impact-title">
      <div className="cineImpactInner">
        <p className="sectionKicker">Purpose</p>
        <h2 id="cine-impact-title">Our impact goals</h2>
        <div className="cineImpactStats cineReveal">
          {goals.map((item) => {
            const parsed = parseFigure(item.figure);
            return (
              <div className="cineImpactStat" key={item.id}>
                {parsed ? (
                  <b data-count={String(parsed.value)} data-suffix={parsed.suffix}>
                    {parsed.value}
                    {parsed.suffix}
                  </b>
                ) : (
                  <b className="cineImpactLabel">{item.title}</b>
                )}
                {parsed ? <strong>{item.title}</strong> : null}
                <small>{item.detail}</small>
              </div>
            );
          })}
        </div>
        <p className="cineImpactCaption">
          Figures marked as targets are stated goals — not independently verified counts.
        </p>
        <blockquote className="cineImpactQuote cineReveal">
          <p>The real strength of Lagos is its people.</p>
          <cite>ICGMTP organising principle</cite>
        </blockquote>
      </div>
    </section>
  );
}
