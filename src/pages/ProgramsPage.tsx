import { Link } from 'react-router-dom';
import { programPath, programs } from '../data/programs';
import { CoverImage } from '../components/CoverImage';
import { PageShell } from '../components/PageShell';

export function ProgramsPage() {
  return (
    <PageShell kicker="Programs" title="Work across four communities">
      <p>
        ICGTMP organises around the people who keep Lagos East moving. Each programme below is a
        live organising track, not a finished publication.
      </p>
      <div className="programPageList">
        {programs.map((program) => (
          <article key={program.id} className="programPageCard">
            <div className="programPagePhoto">
              <CoverImage
                src={program.image}
                srcSet={program.srcSet}
                sizes="(max-width: 700px) 100vw, 320px"
                width={800}
                height={533}
                alt={program.alt}
                objectPosition={program.objectPosition}
                objectPositionMobile={program.objectPositionMobile}
              />
            </div>
            <div>
              <h2>
                <Link to={programPath(program.id)}>{program.title}</Link>
              </h2>
              <p>{program.description}</p>
              <p>
                <Link to={programPath(program.id)}>Learn More</Link>
              </p>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
