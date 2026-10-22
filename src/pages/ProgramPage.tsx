import { Link, useParams } from 'react-router-dom';
import { programById } from '../data/programs';
import { CoverImage } from '../components/CoverImage';
import { PageShell } from '../components/PageShell';
import { NotFoundPage } from './NotFoundPage';

export function ProgramPage() {
  const { sector } = useParams();
  const program = programById(sector);
  if (!program) return <NotFoundPage />;

  return (
    <PageShell kicker="Programs" title={program.title}>
      <div className="programPageCard">
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
          <p>{program.aim}</p>
          <ul className="plainList">
            {program.work.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <p>
        <Link to="/programs">All programmes</Link>
      </p>
    </PageShell>
  );
}
