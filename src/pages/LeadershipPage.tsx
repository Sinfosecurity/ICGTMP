import { leaders } from '../data/leaders';
import { CoverImage } from '../components/CoverImage';
import { PageShell } from '../components/PageShell';

export function LeadershipPage() {
  return (
    <PageShell kicker="Leadership" title="Our leadership">
      <p>Committed. Experienced. Grassroots focused.</p>
      <div className="leaders">
        {leaders.map((leader) => (
          <article className="leaderCard" key={leader.name}>
            <div className="leaderPhoto">
              <CoverImage
                src={leader.image}
                alt={leader.alt}
                objectPosition={leader.objectPosition}
                objectPositionMobile={leader.objectPositionMobile}
                width={880}
                height={1100}
              />
            </div>
            <div className="leaderMeta">
              <h2>{leader.name}</h2>
              <p>{leader.title}</p>
              {leader.bio ? <p>{leader.bio}</p> : null}
              {leader.lga ? <p>{leader.lga}</p> : null}
            </div>
          </article>
        ))}
      </div>
      <p className="quietNote">
        Women and youth coordinators will be listed here when those appointments are published.
        Full biographies will be published when those materials are supplied.
      </p>
    </PageShell>
  );
}
