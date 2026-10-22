import { Link, useParams } from 'react-router-dom';
import { lgaSectionId } from '../data/locations';
import {
  programById,
  programMovement,
  whereWeWorkLgas,
  type ProgramInvolvement,
} from '../data/programs';
import { PageShell } from '../components/PageShell';
import { WhatsAppJoinLink } from '../components/WhatsAppJoinLink';
import { useJoin } from '../routes/JoinProvider';
import { NotFoundPage } from './NotFoundPage';

function WhereWeWork() {
  return (
    <>
      <h2>Where we work</h2>
      <p className="whereWeWork">
        {whereWeWorkLgas.map((name, index) => (
          <span key={name}>
            {index > 0 ? ' · ' : null}
            <Link to={`/structure#${lgaSectionId(name)}`}>{name}</Link>
          </span>
        ))}
        {', and their LCDAs.'}
      </p>
    </>
  );
}

function InvolvementLabel({ item }: { item: ProgramInvolvement }) {
  const onJoin = useJoin();
  if (item.action === 'whatsapp') {
    return <WhatsAppJoinLink icon={false} label={item.label} className="programAction" />;
  }
  if (item.action === 'join') {
    return (
      <button type="button" className="programAction" onClick={() => onJoin(item.category)}>
        {item.label}
      </button>
    );
  }
  if (item.action === 'contact') {
    return (
      <Link className="programAction" to="/contact">
        {item.label}
      </Link>
    );
  }
  return (
    <Link className="programAction" to="/programs">
      {item.label}
    </Link>
  );
}

export function ProgramPage() {
  const { sector } = useParams();
  const program = programById(sector);
  const onJoin = useJoin();
  if (!program) return <NotFoundPage />;

  return (
    <PageShell kicker={program.eyebrow} title={program.headline}>
      <p>{program.intro}</p>
      <h2>Why it matters</h2>
      <p>{program.whyItMatters}</p>
      <h2>What we do</h2>
      <ul className="plainList">
        {program.activities.map((activity) => (
          <li key={activity.title}>
            <strong>{activity.title}:</strong> {activity.text}
          </li>
        ))}
      </ul>
      {program.note ? (
        <p>
          <strong>{program.note.heading}:</strong> {program.note.text}
        </p>
      ) : null}
      <h2>What you can expect as a member</h2>
      <ul className="plainList">
        {program.memberExpectations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <WhereWeWork />
      <h2>Get involved</h2>
      <ul className="plainList">
        {program.getInvolved.map((item) => (
          <li key={item.label}>
            <InvolvementLabel item={item} />
            {item.action === 'whatsapp' ? ' ' : ': '}
            {item.text}
          </li>
        ))}
      </ul>
      <p>
        <em>{program.closingLine}</em>
      </p>
      <section className="programMovement" aria-labelledby="movement-heading">
        <h2 id="movement-heading">{programMovement.heading}</h2>
        <p>{programMovement.text}</p>
        <div className="programMovementActions">
          <button type="button" className="goldPill" onClick={() => onJoin()}>
            {programMovement.joinLabel}
          </button>
          <WhatsAppJoinLink icon={false} label={programMovement.whatsappLabel} className="ghostPill" />
          <Link className="movementProgrammes" to="/programs">
            {programMovement.programmesLabel}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
