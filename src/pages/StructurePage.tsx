import { lgaDirectory, lgaNames, lgaNotes, lgaSectionId } from '../data/locations';
import { PageShell } from '../components/PageShell';

export function StructurePage() {
  return (
    <PageShell kicker="Our Structure" title="Lagos East LGAs and LCDAs">
      <p>
        ICGMTP is organized across 5 Local Government Areas and 11 LCDAs in Lagos East, with ward
        and community networks at the grassroots.
      </p>
      <div className="lgaRegister">
        <div className="lgaRegisterHead">
          <p>Local Government Area</p>
          <p>LCDA</p>
        </div>
        {lgaNames.map((lga) => (
          <article key={lga} id={lgaSectionId(lga)} className="lgaRow">
            <div className="lgaIdentity">
              <h2>{lga}</h2>
              <p>{lgaNotes[lga]}</p>
            </div>
            <ul className="lgaLcdas">
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
