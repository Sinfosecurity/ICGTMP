import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  leaderHasPhoto,
  leaderInitials,
  type Leader,
} from '../../data/leaders';
import { leadershipTiers } from '../../data/leadershipTiers';
import { fadeUpOnce } from '../../lib/fadeUp';
import { CoverImage } from '../CoverImage';
import { useMotion } from '../MotionProvider';

/** Gold uppercase role labels for org-chart portrait cards. */
function tierRoleLabel(leader: Leader): string {
  if (leader.role === 'Convener') return 'CONVENER';
  if (leader.role === 'Director-General') return 'DIRECTOR-GENERAL';
  if (leader.role === 'Deputy Director-General, Finance') return 'DDG, FINANCE';
  if (leader.role === 'Deputy Director-General, Operations') return 'DDG, OPERATIONS';
  if (leader.role === 'Deputy Director-General, Diaspora') return 'DDG, DIASPORA';
  if (leader.role === 'Secretary') return 'SECRETARY';
  if (leader.role === 'Diaspora Coordinator, Europe') return 'DIASPORA COORDINATOR, EUROPE';
  if (leader.role === 'Diaspora Coordinator, Canada') return 'DIASPORA COORDINATOR, CANADA';
  return leader.role.toUpperCase();
}

function Portrait({
  leader,
  objectPosition,
}: {
  leader: Leader;
  objectPosition?: string;
}) {
  const hasPhoto = leaderHasPhoto(leader.photo);
  if (!hasPhoto) {
    return (
      <span className="cineLeaderMono cineLeaderMono-tier" aria-hidden="true">
        {leaderInitials(leader.name)}
      </span>
    );
  }
  const pos = objectPosition ?? leader.objectPosition ?? '50% 20%';
  return (
    <CoverImage
      src={leader.photo}
      alt={`Portrait of ${leader.name}`}
      objectPosition={pos}
      objectPositionMobile={
        objectPosition ?? leader.objectPositionMobile ?? leader.objectPosition ?? '50% 18%'
      }
      width={800}
      height={1000}
      loading="lazy"
    />
  );
}

function OrgCard({
  leader,
  sizeClass,
}: {
  leader: Leader;
  sizeClass: 'cineOrgCard--convener' | 'cineOrgCard--dg' | 'cineOrgCard--ddg';
}) {
  return (
    <article className={`cineLeaderCard cineOrgCard cineReveal ${sizeClass}`}>
      <div className="cineLeaderPhoto">
        <Portrait leader={leader} objectPosition="center top" />
      </div>
      <p className="cineLeaderRole">{tierRoleLabel(leader)}</p>
      <h3 className="cineLeaderName">{leader.name}</h3>
    </article>
  );
}

function OrgConnector({ variant = 'default' }: { variant?: 'default' | 'subtle' }) {
  return (
    <div
      className={`cineOrgConnector${variant === 'subtle' ? ' cineOrgConnector--subtle' : ''}`}
      aria-hidden="true"
    />
  );
}

export function SceneLeadership() {
  const { ready } = useMotion();
  const rootRef = useRef<HTMLElement>(null);
  const { conveners, directorGeneral, ddgs, secretary, diaspora } = leadershipTiers();

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

        <div className="cineOrgChart">
          <div className="cineOrgTier">
            <p className="cineOrgTierLabel" id="cine-org-conveners">
              Conveners
            </p>
            <div
              className="cineOrgRow cineOrgRow--three"
              role="group"
              aria-labelledby="cine-org-conveners"
            >
              {conveners.map((leader) => (
                <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--convener" />
              ))}
            </div>
          </div>

          <OrgConnector />

          <div className="cineOrgTier">
            <p className="cineOrgTierLabel" id="cine-org-dg">
              Director-General
            </p>
            <div
              className="cineOrgRow cineOrgRow--one"
              role="group"
              aria-labelledby="cine-org-dg"
            >
              {directorGeneral.map((leader) => (
                <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--dg" />
              ))}
            </div>
          </div>

          <OrgConnector />

          {/* Tier 3: DDGs + Secretary (two centred rows, same card language) */}
          <div className="cineOrgTier cineOrgTier--level3">
            <p className="cineOrgTierLabel" id="cine-org-ddgs">
              Deputy Directors-General
            </p>
            <div
              className="cineOrgRow cineOrgRow--three"
              role="group"
              aria-labelledby="cine-org-ddgs"
            >
              {ddgs.map((leader) => (
                <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--ddg" />
              ))}
            </div>

            <OrgConnector variant="subtle" />

            <p className="cineOrgTierLabel" id="cine-org-secretary">
              Secretary
            </p>
            <div
              className="cineOrgRow cineOrgRow--one"
              role="group"
              aria-labelledby="cine-org-secretary"
            >
              {secretary.map((leader) => (
                <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--ddg" />
              ))}
            </div>
          </div>

          <OrgConnector />

          {/* Tier 4: Diaspora coordinators at Tier-3 portrait scale */}
          <div className="cineOrgTier cineOrgTier--diaspora">
            <p className="cineOrgTierLabel" id="cine-org-diaspora">
              Lagosians in Diaspora
            </p>
            <div
              className="cineOrgRow cineOrgRow--two"
              role="group"
              aria-labelledby="cine-org-diaspora"
            >
              {diaspora.map((leader) => (
                <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--ddg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
