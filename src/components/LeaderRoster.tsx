import { useState } from 'react';
import {
  leaderGroups,
  leaderHasPhoto,
  leaderInitials,
  leaderRows,
  type Leader,
  type LeaderGroup,
} from '../data/leaders';
import { CoverImage } from './CoverImage';

function LeaderPortrait({ leader }: { leader: Leader }) {
  const [missing, setMissing] = useState(() => !leaderHasPhoto(leader.photo));
  if (missing) {
    return (
      <div className="leaderPhoto">
        <span className="leaderMonogram" aria-hidden="true">
          {leaderInitials(leader.name)}
        </span>
      </div>
    );
  }
  return (
    <div className="leaderPhoto">
      <CoverImage
        src={leader.photo}
        alt=""
        objectPosition={leader.objectPosition ?? '50% 20%'}
        objectPositionMobile={leader.objectPositionMobile ?? leader.objectPosition ?? '50% 18%'}
        width={800}
        height={1000}
        onError={() => setMissing(true)}
      />
    </div>
  );
}

export function LeaderCard({ leader, nameTag }: { leader: Leader; nameTag: 'h3' | 'h4' }) {
  const Name = nameTag;
  return (
    <article className="leaderCard" id={leader.slug}>
      <LeaderPortrait leader={leader} />
      <div className="leaderMeta">
        <p className="leaderRole">{leader.role}</p>
        <Name className="leaderName">{leader.name}</Name>
      </div>
    </article>
  );
}

export function LeaderGroups({ heading }: { heading: 'h2' | 'h3' }) {
  const Heading = heading;
  return (
    <div className="leaderDirectory">
      {leaderGroups.map((group) => {
        const rows = leaderRows(group.id);
        if (rows.length === 0) return null;
        return (
          <section
            key={group.id}
            className={`leaderGroup leaderGroup-${group.id}`}
            aria-labelledby={`leaders-${group.id}`}
          >
            <Heading id={`leaders-${group.id}`} className="leaderGroupLabel">
              {group.label}
            </Heading>
            {rows.map((row) => (
              <div
                key={row[0].slug}
                className={rowClass(group.id)}
                data-count={row.length}
              >
                {row.map((leader) => (
                  <LeaderCard
                    key={leader.slug}
                    leader={leader}
                    nameTag={heading === 'h2' ? 'h3' : 'h4'}
                  />
                ))}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

function rowClass(group: LeaderGroup): string {
  return group === 'diaspora' ? 'leaderRow leaderRowDiaspora' : 'leaderRow leaderRowLeadership';
}
