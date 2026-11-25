import {
  leaderHasPhoto,
  leaderInitials,
  type Leader,
} from '../data/leaders';
import { leadershipTiers } from '../data/leadershipTiers';
import { CoverImage } from './CoverImage';

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

type Props = {
  /** Prefix for aria label ids (avoid clashes when chart appears twice). */
  idPrefix?: string;
};

/**
 * Presentational tiered org chart (Conveners → DG → DDGs → Secretary → Diaspora).
 * Shared by homepage SceneLeadership and the Leadership inner page — no motion.
 */
export function LeadershipOrgChart({ idPrefix = 'org' }: Props) {
  const { conveners, directorGeneral, ddgs, secretary, diaspora } = leadershipTiers();

  return (
    <div className="cineOrgChart">
      <div className="cineOrgTier">
        <p className="cineOrgTierLabel" id={`${idPrefix}-conveners`}>
          Conveners
        </p>
        <div
          className="cineOrgRow cineOrgRow--three"
          role="group"
          aria-labelledby={`${idPrefix}-conveners`}
        >
          {conveners.map((leader) => (
            <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--convener" />
          ))}
        </div>
      </div>

      <OrgConnector />

      <div className="cineOrgTier">
        <p className="cineOrgTierLabel" id={`${idPrefix}-dg`}>
          Director-General
        </p>
        <div
          className="cineOrgRow cineOrgRow--one"
          role="group"
          aria-labelledby={`${idPrefix}-dg`}
        >
          {directorGeneral.map((leader) => (
            <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--dg" />
          ))}
        </div>
      </div>

      <OrgConnector />

      <div className="cineOrgTier cineOrgTier--level3">
        <p className="cineOrgTierLabel" id={`${idPrefix}-ddgs`}>
          Deputy Directors-General
        </p>
        <div
          className="cineOrgRow cineOrgRow--three"
          role="group"
          aria-labelledby={`${idPrefix}-ddgs`}
        >
          {ddgs.map((leader) => (
            <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--ddg" />
          ))}
        </div>

        <OrgConnector variant="subtle" />

        <p className="cineOrgTierLabel" id={`${idPrefix}-secretary`}>
          Secretary
        </p>
        <div
          className="cineOrgRow cineOrgRow--one"
          role="group"
          aria-labelledby={`${idPrefix}-secretary`}
        >
          {secretary.map((leader) => (
            <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--ddg" />
          ))}
        </div>
      </div>

      <OrgConnector />

      <div className="cineOrgTier cineOrgTier--diaspora">
        <p className="cineOrgTierLabel" id={`${idPrefix}-diaspora`}>
          Lagosians in Diaspora
        </p>
        <div
          className="cineOrgRow cineOrgRow--two"
          role="group"
          aria-labelledby={`${idPrefix}-diaspora`}
        >
          {diaspora.map((leader) => (
            <OrgCard key={leader.slug} leader={leader} sizeClass="cineOrgCard--ddg" />
          ))}
        </div>
      </div>
    </div>
  );
}
