import { programStrip } from '../data/content';
import { SectorIcon } from './SectorIcon';

export function ProgramsStrip() {
  return (
    <nav className="programStrip" aria-label="Programme shortcuts">
      {programStrip.map((item) => (
        <a key={item.label} href={item.href}>
          <SectorIcon name={item.icon} />
          <b>{item.label}</b>
        </a>
      ))}
    </nav>
  );
}
