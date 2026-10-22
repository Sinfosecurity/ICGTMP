import { Link } from 'react-router-dom';
import { navigation, org } from '../data/site';
import { PageShell } from '../components/PageShell';

export type LegalSlug = 'privacy' | 'terms' | 'sitemap';

const copy: Record<Exclude<LegalSlug, 'sitemap'>, { title: string; body: string[] }> = {
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
};

type Props = {
  slug: LegalSlug;
};

export function LegalPage({ slug }: Props) {
  if (slug === 'sitemap') {
    return (
      <PageShell kicker="ICGTMP" title="Site Map">
        <ul className="plainList">
          {navigation.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </PageShell>
    );
  }

  const page = copy[slug];
  return (
    <PageShell kicker="ICGTMP" title={page.title}>
      {page.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </PageShell>
  );
}
