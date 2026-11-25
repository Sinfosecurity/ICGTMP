import { leadershipTiers } from '../data/leadershipTiers';
import { programs } from '../data/programs';
import { org } from '../data/site';
import { PageShell } from '../components/PageShell';

const TIER_SECTIONS: { label: string; key: keyof ReturnType<typeof leadershipTiers> }[] = [
  { label: 'Conveners', key: 'conveners' },
  { label: 'Director-General', key: 'directorGeneral' },
  { label: 'Deputy Directors-General', key: 'ddgs' },
  { label: 'Secretary', key: 'secretary' },
  { label: 'Lagosians in Diaspora', key: 'diaspora' },
];

export function AboutPage() {
  const tiers = leadershipTiers();

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
        {programs.map((sector) => (
          <li key={sector.id}>
            <strong>{sector.title}.</strong> {sector.description}
          </li>
        ))}
      </ul>
      <h2>Leadership</h2>
      <div className="aboutLeadershipTiers">
        {TIER_SECTIONS.map(({ label, key }) => {
          const group = tiers[key];
          if (group.length === 0) return null;
          return (
            <section key={key} className="aboutTierGroup" aria-labelledby={`about-tier-${key}`}>
              <h3 id={`about-tier-${key}`} className="aboutTierLabel">
                {label}
              </h3>
              <ul className="plainList">
                {group.map((leader) => (
                  <li key={leader.slug}>
                    <strong>{leader.name}</strong> — {leader.role}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
