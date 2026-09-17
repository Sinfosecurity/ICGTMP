import { org } from '../data/content';
import { PageShell } from '../components/PageShell';

export function ResourcesPage() {
  return (
    <PageShell kicker="Resources" title="How to get involved">
      <p>
        Official downloads and media notes will be added here when they are released. Until then,
        these are the public ways to work with ICGTMP.
      </p>
      <div className="resourceGrid">
        <article>
          <h2>Join as a member</h2>
          <p>
            Register your interest by LGA, LCDA, trade and membership category. Submissions go to
            info@icgtmp.org.
          </p>
          <p>
            <a href="#contact">Open the contact page</a> or use Join ICGTMP in the header.
          </p>
        </article>
        <article>
          <h2>Lagos East structure</h2>
          <p>5 LGAs and 11 LCDAs. Use this directory when filling the membership form.</p>
          <p>
            <a href="#structure">View LGAs and LCDAs</a>
          </p>
        </article>
        <article>
          <h2>Programmes</h2>
          <p>Markets, artisans, professionals, and women and youth each have a live organising track.</p>
          <p>
            <a href="#programs">Read the programme notes</a>
          </p>
        </article>
        <article>
          <h2>Contact</h2>
          <p>
            1 Akeusola Street, Ita&apos;le Market, Epe Waterfront. Email info@icgtmp.org, or{' '}
            <a href={org.whatsappGroup} target="_blank" rel="noopener noreferrer">
              join the WhatsApp group
            </a>
            .
          </p>
          <p>
            <a href="#contact">Contact ICGTMP</a>
          </p>
        </article>
      </div>
    </PageShell>
  );
}
