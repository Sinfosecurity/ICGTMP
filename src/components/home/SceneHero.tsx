import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { MOTION_EASE } from '../../lib/motion';
import { useJoin } from '../../routes/JoinProvider';
import { useMotion } from '../MotionProvider';
import { WhatsAppJoinLink } from '../WhatsAppJoinLink';

const SUPPORT =
  'ICGMTP mobilizes traders, market communities, artisans, entrepreneurs and professionals across Lagos East for a greater Lagos and a renewed Nigeria.';

export function SceneHero() {
  const onJoin = useJoin();
  const { ready } = useMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const root = rootRef.current;
    const content = root.querySelectorAll<HTMLElement>(
      '.cineIntroLabel, .cineIntroTitle, .cineIntroSupport, .cineIntroActions',
    );

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(content, { opacity: 1, y: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          content,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: MOTION_EASE,
            immediateRender: true,
          },
        );
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={rootRef}
      id="home-story"
      className="cineIntro"
      aria-labelledby="cine-intro-title"
    >
      <div className="cineIntroInner">
        <p className="cineIntroLabel cineReveal">ICGMTP</p>
        <h1 id="cine-intro-title" className="cineIntroTitle cineReveal">
          The strength of Lagos is its people.
        </h1>
        <p className="cineIntroSupport cineReveal">{SUPPORT}</p>
        <div className="cineIntroActions cineReveal">
          <button type="button" className="goldPill" data-join-trigger onClick={() => onJoin()}>
            Join ICGMTP
          </button>
          <WhatsAppJoinLink className="cineIntroOutline cineIntroWhatsApp" />
          <a className="cineIntroTextLink" href="#cine-hook-title">
            Who we are <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
