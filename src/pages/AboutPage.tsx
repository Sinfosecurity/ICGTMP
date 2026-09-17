import { leaders, org, sectors } from '../data/content';
import { PageShell } from '../components/PageShell';

export function AboutPage() {
  return (
    <PageShell kicker="About" title="Who we are">
      <p>
        {org.shortName} is the {org.fullName}. The group exists to mobilize traders, market
        communities, artisans, entrepreneurs and professionals across Lagos East for a greater Lagos
        and a renewed Nigeria.
      </p>
      <p>
        Our motto is <em>{org.motto}</em> The work is organized around the people who keep Lagos
        moving: markets, skilled workers, professionals, women and youth.
      </p>
      <h2>Who we serve</h2>
      <ul className="plainList">
        {sectors.map((sector) => (
          <li key={sector.id}>
            <strong>{sector.title}.</strong> {sector.description}
          </li>
        ))}
      </ul>
      <h2>Leadership</h2>
      <ul className="plainList">
        {leaders.map((leader) => (
          <li key={leader.name}>
            <strong>{leader.name}</strong> — {leader.title}
          </li>
        ))}
      </ul>
      <p className="quietNote">
        Full biographies, and the women and youth coordinators, will be published when those
        materials are supplied.
      </p>
    </PageShell>
  );
}
