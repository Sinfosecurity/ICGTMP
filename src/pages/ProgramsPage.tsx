import { sectors, programDetails } from '../data/content';
import { PageShell } from '../components/PageShell';
import { CoverImage } from '../components/CoverImage';

export function ProgramsPage() {
  return (
    <PageShell kicker="Programs" title="Work across four communities">
      <p>
        ICGTMP organises around the people who keep Lagos East moving. Each programme below is a
        live organising track, not a finished publication.
      </p>
      <div className="programPageList">
        {sectors.map((sector) => {
          const detail = programDetails[sector.id];
          return (
            <article key={sector.id} id={sector.id} className="programPageCard">
              <div className="programPagePhoto">
                <CoverImage
                  src={sector.image}
                  srcSet={sector.srcSet}
                  sizes="(max-width: 700px) 100vw, 320px"
                  width={800}
                  height={533}
                  alt={sector.alt}
                  objectPosition={sector.objectPosition}
                  objectPositionMobile={sector.objectPositionMobile}
                />
              </div>
              <div>
                <h2>{sector.title}</h2>
                <p>{detail.aim}</p>
                <ul className="plainList">
                  {detail.work.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
