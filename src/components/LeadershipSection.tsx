import { ArrowRight } from 'lucide-react';
import { leaders } from '../data/content';
import { CoverImage } from './CoverImage';

export function LeadershipSection() {
  return (
    <section id="leadership" className="leadersPanel">
      <h2>OUR LEADERSHIP</h2>
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
              <h3>{leader.name}</h3>
              <small>{leader.title}</small>
            </div>
          </article>
        ))}
      </div>
      <p className="leadershipNote">
        Women and youth coordinators will be listed here when those appointments are published.
      </p>
      <a className="goldOutline" href="#leadership">
        Meet the Leadership Team <ArrowRight size={15} />
      </a>
    </section>
  );
}
