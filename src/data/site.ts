export const org = {
  shortName: 'ICGMTP',
  fullName: 'Independent Campaign Group for Tradesmen, Markets & Professionals',
  motto: 'Strength. Stability. Support.',
  banner: 'For a Greater Lagos and a Renewed Nigeria',
  affiliation: 'In support of APC Lagos stakeholders & leadership',
  email: 'info@icgtmp.org',
  phones: [
    { display: '0703 652 1422', tel: '+2347036521422' },
    { display: '0802 757 1429', tel: '+2348027571429' },
  ],
  whatsappGroup: 'https://chat.whatsapp.com/EujQVqVv4N6HcsTkYbtm8V',
  addressLines: [
    '5 Akeusola Street',
    "Ita'le Market",
    'Epe Waterfront',
    'Lagos State, Nigeria',
  ],
};

export const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=5%20Akeusola%20Street%20Ita'le%20Market%20Epe%20Waterfront%20Lagos";

export const membershipCategories = [
  'Markets & Traders',
  'Artisans & Skilled Workers',
  'Professionals & SMEs',
  'Women & Youth',
  'Volunteer',
  'Partner/Stakeholder',
] as const;

export type MembershipCategory = (typeof membershipCategories)[number];

export type NavItem = {
  label: string;
  to: string;
  title: string;
  description: string;
  header?: boolean;
  footer?: boolean;
  legal?: boolean;
};

const homeDescription =
  'Independent Campaign Group for Tradesmen, Markets & Professionals — connecting grassroots communities, markets, artisans, entrepreneurs and professionals across Lagos East.';

/** Header, footer, and the site map all read this list. */
export const navigation: NavItem[] = [
  {
    label: 'Home',
    to: '/',
    title: 'ICGMTP | Strength. Stability. Support.',
    description: homeDescription,
    header: true,
  },
  {
    label: 'About',
    to: '/about',
    title: 'About | ICGMTP',
    description: 'Who ICGMTP is and who the group serves across Lagos East.',
    header: true,
    footer: true,
  },
  {
    label: 'Leadership',
    to: '/leadership',
    title: 'Leadership | ICGMTP',
    description: 'Convener, Director-General, Deputy Directors-General, Secretary, and diaspora coordinators of ICGMTP.',
    header: true,
    footer: true,
  },
  {
    label: 'Our Structure',
    to: '/structure',
    title: 'Our Structure | ICGMTP',
    description: 'Lagos East LGAs and LCDAs where ICGMTP organizes at the grassroots.',
    header: true,
    footer: true,
  },
  {
    label: 'Programs',
    to: '/programs',
    title: 'Programs | ICGMTP',
    description: 'Markets, artisans, professionals, and women and youth programmes across Lagos East.',
    header: true,
    footer: true,
  },
  {
    label: 'News & Events',
    to: '/news',
    title: 'News & Events | ICGMTP',
    description: 'Community activity notes from ICGMTP. Official dates will be added when reports are issued.',
    header: true,
    footer: true,
  },
  {
    label: 'Resources',
    to: '/resources',
    title: 'Resources | ICGMTP',
    description: 'How to join ICGMTP, find the Lagos East structure, and contact the group.',
    header: true,
    footer: true,
  },
  {
    label: 'Contact',
    to: '/contact',
    title: 'Contact | ICGMTP',
    description:
      'Write to ICGMTP at Ita’le Market, Epe Waterfront, email info@icgtmp.org, or join the WhatsApp group.',
    header: true,
    footer: true,
  },
  {
    label: 'Privacy Policy',
    to: '/privacy',
    title: 'Privacy Policy | ICGMTP',
    description: 'How ICGMTP handles membership and contact form submissions.',
    legal: true,
  },
  {
    label: 'Terms of Use',
    to: '/terms',
    title: 'Terms of Use | ICGMTP',
    description: 'Terms for using the ICGMTP public website.',
    legal: true,
  },
  {
    label: 'Site Map',
    to: '/sitemap',
    title: 'Site Map | ICGMTP',
    description: 'All public pages on the ICGMTP website.',
    legal: true,
  },
];

export const notFoundMeta = {
  title: 'Page not found | ICGMTP',
  description: 'That address is not a page on the ICGMTP website.',
};
