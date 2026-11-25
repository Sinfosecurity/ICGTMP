import { LeaderGroups } from '../components/LeaderRoster';
import { PageShell } from '../components/PageShell';

export function LeadershipPage() {
  return (
    <PageShell kicker="Leadership" title="Our leadership">
      <p className="leaderPageLead">Committed. Experienced. Grassroots focused.</p>
      <LeaderGroups heading="h2" />
    </PageShell>
  );
}
