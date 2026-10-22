import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { programPath, programs } from '../data/programs';
import { CoverImage } from './CoverImage';
import { SectorIcon } from './SectorIcon';

export function SectorCards() {
  return (
    <section className="sectorSection" aria-labelledby="sector-heading">
      <h2 id="sector-heading" className="visuallyHidden">
        Who we serve
      </h2>
      <div className="sectorGrid">
        {programs.map((sector) => (
          <article key={sector.id} className="sectorCard">
            <div className="sectorPhoto">
              <CoverImage
                src={sector.image}
                srcSet={sector.srcSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                width={800}
                height={533}
                alt={sector.alt}
                objectPosition={sector.objectPosition}
                objectPositionMobile={sector.objectPositionMobile}
              />
            </div>
            <div className="sectorBadge" aria-hidden="true">
              <SectorIcon name={sector.icon} />
            </div>
            <div className="sectorBody">
              <h3>{sector.title}</h3>
              <p>{sector.cardText}</p>
              <Link to={programPath(sector.id)}>
                Learn More <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
