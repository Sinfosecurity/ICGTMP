import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fadeUpOnce } from '../../lib/fadeUp';
import { LeadershipOrgChart } from '../LeadershipOrgChart';
import { useMotion } from '../MotionProvider';

export function SceneLeadership() {
  const { ready } = useMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const root = rootRef.current;
    const cards = root.querySelectorAll<HTMLElement>('.cineLeaderCard');

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(cards, { opacity: 1, y: 0 });
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        fadeUpOnce(cards, { stagger: 0.06, trigger: root });
      });
      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={rootRef}
      id="home-leadership"
      className="cineLeadership"
      aria-labelledby="cine-leadership-title"
    >
      <div className="cineLeadershipInner">
        <div className="cineLeadershipHead">
          <p className="sectionKicker sectionKickerOnDark">Leadership</p>
          <h2 id="cine-leadership-title">Our leadership</h2>
          <p>Committed. Experienced. Grassroots focused.</p>
          <Link className="goldOutline" to="/leadership">
            Meet the leadership team <span aria-hidden="true">→</span>
          </Link>
        </div>

        <LeadershipOrgChart idPrefix="cine-org" />
      </div>
    </section>
  );
}
