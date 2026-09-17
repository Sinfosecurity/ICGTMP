import { navItems, org } from '../data/content';
import type { LegalSlug } from '../lib/routing';
import { PageShell } from '../components/PageShell';

type Props = {
  slug: LegalSlug;
};

const copy: Record<LegalSlug, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      `Membership and contact forms on this site send your details to ${org.email}. Submissions are emailed through FormSubmit (formsubmit.co), a third-party form processor in the United States. A copy is also stored in a Google Sheet held in ICGTMP’s Google Workspace account. Google acts as a processor for that stored copy.`,
      'Fields typically include name, phone, email, LGA, LCDA, ward, trade or profession, and a short message. We use those details only to follow up on membership, volunteering or partnership interest. We do not sell this information.',
      'The first FormSubmit email may require a one-time inbox confirmation. After that, messages arrive by email and a matching row is kept in the Sheet.',
      'A fuller policy will be published if the group later expands how this information is used.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    body: [
      `The ${org.shortName} website is provided for public information about the Independent Campaign Group for Tradesmen, Markets & Professionals.`,
      'Content on this site may be updated as official materials are supplied. Do not treat unpublished programme details as final policy.',
    ],
  },
  sitemap: {
    title: 'Site Map',
    body: [],
  },
};

export function LegalPage({ slug }: Props) {
  const page = copy[slug];
  return (
    <PageShell kicker="ICGTMP" title={page.title}>
      {page.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {slug === 'sitemap' && (
        <ul className="plainList">
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
          <li>
            <a href="#structure">LGAs &amp; LCDAs</a>
          </li>
          <li>
            <a href="#privacy">Privacy Policy</a>
          </li>
          <li>
            <a href="#terms">Terms of Use</a>
          </li>
        </ul>
      )}
    </PageShell>
  );
}
