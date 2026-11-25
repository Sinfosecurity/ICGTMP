import { LeadershipOrgChart } from '../components/LeadershipOrgChart';
import { PageShell } from '../components/PageShell';

export function LeadershipPage() {
  return (
    <PageShell kicker="Leadership" title="Our leadership">
      <p className="leaderPageLead">Committed. Experienced. Grassroots focused.</p>
      <section className="innerLeadershipBand" aria-label="Organisation chart">
        <div className="cineLeadershipInner">
          <LeadershipOrgChart idPrefix="page-org" />
        </div>
      </section>
    </PageShell>
  );
}
