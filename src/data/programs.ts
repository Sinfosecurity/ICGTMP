import { imageAlts, images, sectorSrcSet } from './images';

export type ProgramId = 'markets' | 'artisans' | 'professionals' | 'women-youth';

export type ProgramIcon = 'store' | 'wrench' | 'users' | 'heart';

export type Program = {
  id: ProgramId;
  title: string;
  stripLabel: string;
  description: string;
  image: string;
  srcSet: string;
  alt: string;
  icon: ProgramIcon;
  objectPosition: string;
  objectPositionMobile: string;
  aim: string;
  work: string[];
};

export const programs: Program[] = [
  {
    id: 'markets',
    title: 'Markets & Traders',
    stripLabel: 'Markets & Trade',
    description:
      'Connecting market associations, traders and commercial communities across Lagos East.',
    image: images.markets,
    srcSet: sectorSrcSet.markets,
    alt: imageAlts.markets,
    icon: 'store',
    objectPosition: '38% 40%',
    objectPositionMobile: '36% 35%',
    aim: 'Strengthen market associations and trading communities as organised civic partners.',
    work: [
      'Association meetings and market-floor conversations',
      'PVC registration and collection support in market corridors',
      'Welfare, security and trading-condition priorities gathered from traders',
    ],
  },
  {
    id: 'artisans',
    title: 'Artisans & Skilled Workers',
    stripLabel: 'Artisans',
    description:
      'Engaging mechanics, technicians, tailors, builders, craftspeople and other skilled workers.',
    image: images.artisans,
    srcSet: sectorSrcSet.artisans,
    alt: imageAlts.artisans,
    icon: 'wrench',
    objectPosition: '70% 35%',
    objectPositionMobile: '72% 30%',
    aim: 'Organise mechanics, technicians, tailors, builders and other skilled workers.',
    work: [
      'Workshop and cluster visits across Ikorodu and the wider East',
      'Skills, tools and apprenticeship conversations',
      'A clearer channel between artisan groups and Lagos East structure',
    ],
  },
  {
    id: 'professionals',
    title: 'Professionals & SMEs',
    stripLabel: 'Professionals',
    description:
      'Partnering with professionals, entrepreneurs and business owners for stronger communities.',
    image: images.professionals,
    srcSet: sectorSrcSet.professionals,
    alt: imageAlts.professionals,
    icon: 'users',
    objectPosition: '50% 28%',
    objectPositionMobile: '50% 22%',
    aim: 'Connect professionals, entrepreneurs and SME owners to grassroots work.',
    work: [
      'Volunteer time, mentoring and pro-bono skills',
      'Small-business and professional association outreach',
      'Support for data, communications and programme delivery',
    ],
  },
  {
    id: 'women-youth',
    title: 'Women & Youth',
    stripLabel: 'Women & Youth',
    description:
      'Creating more opportunities for women and young people in trade, business and leadership.',
    image: images.womenYouth,
    srcSet: sectorSrcSet.womenYouth,
    alt: imageAlts.womenYouth,
    icon: 'heart',
    objectPosition: '50% 30%',
    objectPositionMobile: '50% 24%',
    aim: 'Open more room for women and young people in trade, business and leadership.',
    work: [
      'Women-led market and trade networks',
      'Youth mobilisation and civic education',
      'Leadership seats for women and youth coordinators — names to be published when appointed',
    ],
  },
];

export function programById(id: string | undefined): Program | undefined {
  if (!id) return undefined;
  return programs.find((program) => program.id === id);
}

export function programPath(id: ProgramId): string {
  return `/programs/${id}`;
}
