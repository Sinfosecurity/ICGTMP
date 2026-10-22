import { LeaderGroups } from '../components/LeaderRoster';
import { PageShell } from '../components/PageShell';

export function LeadershipPage() {
  return (
    <PageShell kicker="Leadership" title="Our leadership">
      <p>Committed. Experienced. Grassroots focused.</p>
      <LeaderGroups heading="h2" />
      <p className="quietNote">Full biographies will be published when those materials are supplied.</p>
    </PageShell>
  );
}
