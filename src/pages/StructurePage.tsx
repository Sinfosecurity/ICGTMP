import { lgaDirectory, lgaNames, lgaNotes } from '../data/locations';
import { PageShell } from '../components/PageShell';

export function StructurePage() {
  return (
    <PageShell kicker="Our Structure" title="Lagos East LGAs and LCDAs">
      <p>
        ICGTMP is organized across 5 Local Government Areas and 11 LCDAs in Lagos East, with ward
        and community networks at the grassroots.
      </p>
      <div className="structureGrid">
        {lgaNames.map((lga) => (
          <article key={lga}>
            <h2>{lga}</h2>
            <p>{lgaNotes[lga]}</p>
            <ul>
              {lgaDirectory[lga].map((lcda) => (
                <li key={lcda}>{lcda}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
