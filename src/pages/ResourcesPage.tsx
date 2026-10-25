import { Link } from 'react-router-dom';
import { org } from '../data/site';
import { PageShell } from '../components/PageShell';

export function ResourcesPage() {
  return (
    <PageShell kicker="Resources" title="How to get involved">
      <p>
        Official downloads and media notes will be added here when they are released. Until then,
        these are the public ways to work with ICGMTP.
      </p>
      <div className="resourceGrid">
        <article>
          <h2>Join as a member</h2>
          <p>
            Register your interest by LGA, LCDA, trade and membership category. Submissions go to
            {org.email}.
          </p>
          <p>
            <Link to="/contact">Open the contact page</Link> or use Join ICGMTP in the header.
          </p>
        </article>
        <article>
          <h2>Lagos East structure</h2>
          <p>5 LGAs and 11 LCDAs. Use this directory when filling the membership form.</p>
          <p>
            <Link to="/structure">View LGAs and LCDAs</Link>
          </p>
        </article>
        <article>
          <h2>Programmes</h2>
          <p>Markets, artisans, professionals, and women and youth each have a live organising track.</p>
          <p>
            <Link to="/programs">Read the programme notes</Link>
          </p>
        </article>
        <article>
          <h2>Contact</h2>
          <p>
            {org.addressLines.slice(0, 3).join(', ')}. Email {org.email}, or{' '}
            <a href={org.whatsappGroup} target="_blank" rel="noopener noreferrer">
              join the WhatsApp group
            </a>
            .
          </p>
          <p>
            <Link to="/contact">Contact ICGMTP</Link>
          </p>
        </article>
      </div>
    </PageShell>
  );
}
