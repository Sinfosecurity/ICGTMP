import { Link } from 'react-router-dom';
import { programPath, programs } from '../data/programs';
import { SectorIcon } from './SectorIcon';

export function ProgramsStrip() {
  return (
    <nav className="programStrip" aria-label="Programme shortcuts">
      {programs.map((item) => (
        <Link key={item.id} to={programPath(item.id)}>
          <SectorIcon name={item.icon} />
          <b>{item.stripLabel}</b>
        </Link>
      ))}
    </nav>
  );
}
