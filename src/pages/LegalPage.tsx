import { Link } from 'react-router-dom';
import { SITE } from '../config/site';
import { navigation, org } from '../data/site';
import { PageShell } from '../components/PageShell';

export type LegalSlug = 'privacy' | 'terms' | 'sitemap';

type Section = { id: string; heading: string; body: string };

const updated = '25 October 2026';

function privacySections(): Section[] {
  const registered = SITE.bnNumber
    ? `${SITE.registeredName} (BN ${SITE.bnNumber})`
    : SITE.registeredName;
  return [
    {
      id: 'who-we-are',
      heading: 'Who we are',
      body: `${registered} operates ${SITE.name} and is responsible for the personal data collected on this site. Our address is ${org.addressLines.join(', ')}. Email ${SITE.email}.`,
    },
    {
      id: 'what-we-collect',
      heading: 'What we collect',
      body: 'We collect your name, phone number, and email if you give one. We also collect your LGA, LCDA, and ward, your profession or trade, and your market or association. We record your membership category, volunteer or partnership details, and the consent record from the form.',
    },
    {
      id: 'sensitive-data',
      heading: 'Sensitive data',
      body: 'Membership indicates a political affiliation. We collect that only when you tick the consent box on the form.',
    },
    {
      id: 'why-we-use-it',
      heading: 'Why we use it',
      body: 'We use your details to contact you about membership, volunteering, partnership, and campaign activities. We do not sell your details. We do not share them for marketing.',
    },
    {
      id: 'where-it-is-stored',
      heading: 'Where it is stored',
      body: 'Your details are stored in Google Sheets through Google Apps Script. Google acts as a data processor and may store data outside Nigeria. Only authorised ICGMTP coordinators have access.',
    },
    {
      id: 'how-long-we-keep-it',
      heading: 'How long we keep it',
      body: 'We keep your details until the end of the 2027 election cycle, or until you ask us to delete them, whichever is sooner.',
    },
    {
      id: 'your-rights',
      heading: 'Your rights',
      body: `You can ask to see your details, correct them, or delete them. You can withdraw consent. You can complain to the Nigeria Data Protection Commission (NDPC). To ask us, email ${SITE.email} and include your reference number.`,
    },
    {
      id: 'security',
      heading: 'Security',
      body: 'Access to the register is restricted. This site uses HTTPS. We do not collect payment data.',
    },
    {
      id: 'changes',
      heading: 'Changes',
      body: `Last updated: ${updated}.`,
    },
  ];
}

function termsSections(): Section[] {
  return [
    {
      id: 'about-this-site',
      heading: 'About this site',
      body: `This website gives public information about ${SITE.name}, the ${SITE.fullName}.`,
    },
    {
      id: 'independent-campaign-group',
      heading: 'Independent campaign group',
      body: `${SITE.name} is an independent support group. It is not an official organ of the APC or any candidate’s campaign office.`,
    },
    {
      id: 'use-of-content',
      heading: 'Use of content',
      body: 'You may read and share links to this site. You may not copy the name, logo, or pages and present them as your own.',
    },
    {
      id: 'accuracy',
      heading: 'Accuracy',
      body: 'We update the site as new information is published. Check dates on news items before you rely on them.',
    },
    {
      id: 'links',
      heading: 'Links to other sites',
      body: 'This site links to WhatsApp, Google Maps, and news sources. Those sites have their own terms. We are not responsible for their content.',
    },
    {
      id: 'contact',
      heading: 'Contact',
      body: `Questions about these terms: email ${SITE.email}.`,
    },
    {
      id: 'changes',
      heading: 'Changes',
      body: `Last updated: ${updated}.`,
    },
  ];
}

type Props = {
  slug: LegalSlug;
};

export function LegalPage({ slug }: Props) {
  if (slug === 'sitemap') {
    return (
      <PageShell kicker="ICGMTP" title="Site Map">
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

  const page = slug === 'privacy'
    ? { title: 'Privacy Policy', sections: privacySections() }
    : { title: 'Terms of Use', sections: termsSections() };

  return (
    <PageShell kicker="ICGMTP" title={page.title}>
      {page.sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </PageShell>
  );
}
