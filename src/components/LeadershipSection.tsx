import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LeaderGroups } from './LeaderRoster';

export function LeadershipSection() {
  return (
    <section id="home-leadership" className="leadersPanel" aria-labelledby="home-leadership-title">
      <div className="leaderSectionHead">
        <div>
          <h2 id="home-leadership-title">OUR LEADERSHIP</h2>
          <p>Committed. Experienced. Grassroots focused.</p>
        </div>
        <Link className="goldOutline" to="/leadership">
          Meet the full team <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <LeaderGroups heading="h3" />
    </section>
  );
}
