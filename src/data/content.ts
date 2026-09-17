import { images, imageAlts, sectorSrcSet } from './images';

export const org = {
  shortName: 'ICGTMP',
  fullName: 'Independent Campaign Group for Tradesmen, Markets & Professionals',
  motto: 'Strength. Stability. Support.',
  banner: 'For a Greater Lagos and a Renewed Nigeria',
  affiliation: 'In support of APC Lagos stakeholders & leadership',
  email: 'info@icgtmp.org',
  whatsappGroup: 'https://chat.whatsapp.com/EujQVqVv4N6HcsTkYbtm8V',
  addressLines: [
    '1 Akeusola Street',
    "Ita'le Market",
    'Epe Waterfront',
    'Lagos State, Nigeria',
  ],
};

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'our-structure', label: 'Our Structure' },
  { id: 'programs', label: 'Programs' },
  { id: 'news-and-events', label: 'News & Events' },
  { id: 'resources', label: 'Resources' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectorId = 'markets' | 'artisans' | 'professionals' | 'women-youth';

export const sectors: {
  id: SectorId;
  title: string;
  description: string;
  image: string;
  srcSet: string;
  alt: string;
  icon: 'store' | 'wrench' | 'users' | 'heart';
  objectPosition: string;
  objectPositionMobile: string;
  href: string;
}[] = [
  {
    id: 'markets',
    title: 'Markets & Traders',
    description:
      'Connecting market associations, traders and commercial communities across Lagos East.',
    image: images.markets,
    srcSet: sectorSrcSet.markets,
    alt: imageAlts.markets,
    icon: 'store',
    objectPosition: '38% 40%',
    objectPositionMobile: '36% 35%',
    href: '#programs/markets',
  },
  {
    id: 'artisans',
    title: 'Artisans & Skilled Workers',
    description:
      'Engaging mechanics, technicians, tailors, builders, craftspeople and other skilled workers.',
    image: images.artisans,
    srcSet: sectorSrcSet.artisans,
    alt: imageAlts.artisans,
    icon: 'wrench',
    objectPosition: '70% 35%',
    objectPositionMobile: '72% 30%',
    href: '#programs/artisans',
  },
  {
    id: 'professionals',
    title: 'Professionals & SMEs',
    description:
      'Partnering with professionals, entrepreneurs and business owners for stronger communities.',
    image: images.professionals,
    srcSet: sectorSrcSet.professionals,
    alt: imageAlts.professionals,
    icon: 'users',
    objectPosition: '50% 28%',
    objectPositionMobile: '50% 22%',
    href: '#programs/professionals',
  },
  {
    id: 'women-youth',
    title: 'Women & Youth',
    description:
      'Creating more opportunities for women and young people in trade, business and leadership.',
    image: images.womenYouth,
    srcSet: sectorSrcSet.womenYouth,
    alt: imageAlts.womenYouth,
    icon: 'heart',
    objectPosition: '50% 30%',
    objectPositionMobile: '50% 24%',
    href: '#programs/women-youth',
  },
];

export const impactGoals = [
  {
    id: 'reach',
    icon: 'users' as const,
    value: '2.6M',
    title: 'Mobilisation target',
    detail: 'Stated reach goal across Lagos East — not an independently verified count',
  },
  {
    id: 'pvc',
    icon: 'id' as const,
    value: '',
    title: 'PVC Engagement',
    detail: 'Registration, collection and voter education',
  },
  {
    id: 'communities',
    icon: 'chart' as const,
    value: '',
    title: 'Stronger Communities',
    detail: 'Jobs, skills, welfare and economic opportunities',
  },
  {
    id: 'network',
    icon: 'shield' as const,
    value: '',
    title: 'Credible Grassroots Network',
    detail: 'Well-structured and data-driven',
  },
  {
    id: 'inclusive',
    icon: 'network' as const,
    value: '',
    title: 'Inclusive Participation',
    detail: 'Across all 5 LGAs in Lagos East',
  },
];

export const leaders = [
  {
    name: 'Hon. Farihuddin Arebi',
    title: 'Convener',
    image: images.leaderArebi,
    alt: imageAlts.leaderArebi,
    objectPosition: '50% 50%',
    objectPositionMobile: '50% 50%',
  },
  {
    name: 'Hon. Jamiu Arowosegbe',
    title: 'Director-General',
    image: images.leaderArowosegbe,
    alt: imageAlts.leaderArowosegbe,
    objectPosition: '50% 18%',
    objectPositionMobile: '50% 16%',
  },
];

export const newsItems = [
  {
    title: 'ICGTMP Engages Market Leaders in Epe',
    summary: 'Discussions with market associations on participation and community priorities.',
    image: images.markets,
    alt: imageAlts.markets,
    dateLabel: 'Activity note',
    objectPosition: '38% 40%',
  },
  {
    title: 'Stakeholder Meeting with Artisans in Ikorodu',
    summary: 'Strengthening collaboration with artisan groups across Lagos East.',
    image: images.artisans,
    alt: imageAlts.artisans,
    dateLabel: 'Activity note',
    objectPosition: '70% 35%',
  },
  {
    title: 'ICGTMP Outreach to Professionals',
    summary: 'Building a stronger network of professionals for a greater Lagos.',
    image: images.professionals,
    alt: imageAlts.professionals,
    dateLabel: 'Activity note',
    objectPosition: '50% 28%',
  },
];

export const membershipCategories = [
  'Markets & Traders',
  'Artisans & Skilled Workers',
  'Professionals & SMEs',
  'Women & Youth',
  'Volunteer',
  'Partner/Stakeholder',
] as const;

export type MembershipCategory = (typeof membershipCategories)[number];

export const programStrip = [
  { label: 'Markets & Trade', icon: 'store' as const, href: '#programs/markets' },
  { label: 'Artisans', icon: 'wrench' as const, href: '#programs/artisans' },
  { label: 'Professionals', icon: 'users' as const, href: '#programs/professionals' },
  { label: 'Women & Youth', icon: 'heart' as const, href: '#programs/women-youth' },
];

export const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=1%20Akeusola%20Street%20Ita'le%20Market%20Epe%20Waterfront%20Lagos";

export const programDetails: Record<
  SectorId,
  { aim: string; work: string[] }
> = {
  markets: {
    aim: 'Strengthen market associations and trading communities as organised civic partners.',
    work: [
      'Association meetings and market-floor conversations',
      'PVC registration and collection support in market corridors',
      'Welfare, security and trading-condition priorities gathered from traders',
    ],
  },
  artisans: {
    aim: 'Organise mechanics, technicians, tailors, builders and other skilled workers.',
    work: [
      'Workshop and cluster visits across Ikorodu and the wider East',
      'Skills, tools and apprenticeship conversations',
      'A clearer channel between artisan groups and Lagos East structure',
    ],
  },
  professionals: {
    aim: 'Connect professionals, entrepreneurs and SME owners to grassroots work.',
    work: [
      'Volunteer time, mentoring and pro-bono skills',
      'Small-business and professional association outreach',
      'Support for data, communications and programme delivery',
    ],
  },
  'women-youth': {
    aim: 'Open more room for women and young people in trade, business and leadership.',
    work: [
      'Women-led market and trade networks',
      'Youth mobilisation and civic education',
      'Leadership seats for women and youth coordinators — names to be published when appointed',
    ],
  },
};
