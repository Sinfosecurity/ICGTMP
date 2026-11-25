import { org } from './site';
import { imageAlts, images } from './images';

export type HeroHitAction = 'join' | 'hash' | 'external';

export type HeroHitBox = {
  left: string;
  top: string;
  width: string;
  height: string;
};

export type HeroHit = {
  id: 'join' | 'about' | 'whatsapp';
  label: string;
  action: HeroHitAction;
  href?: string;
  box: HeroHitBox;
};

export type HeroSlide = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  mobileSrc?: string;
  mobileWidth?: number;
  mobileHeight?: number;
  /**
   * When true, desktop (≥701px) renders a blurred cover backdrop behind the
   * contained foreground so mismatched ratios never show empty letterbox bars.
   * Prefer replacing the asset at 2.5:1 instead of relying on this long-term.
   */
  letterboxFill?: boolean;
  /** Clickable hotspot overlays on the desktop artwork. */
  hits?: HeroHit[];
  /** Clickable hotspot overlays for the mobile portrait artwork only. */
  mobileHits?: HeroHit[];
};

export const HERO_INTERVAL_MS = 6000;
export const HERO_FADE_MS = 800;

/**
 * Campaign banners — landscape artwork with text baked in.
 * Desktop stage / target banner ratio: **2.5:1 (2500×1000)**.
 * Slide 1 is the Continuity lead (hero-06b). “A Brighter Lagos Tomorrow”
 * (hero-00) sits after thrives and has a dedicated mobile portrait.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'continuity-koh',
    src: images.hero06b,
    alt: imageAlts.hero06b,
    width: 2560,
    height: 1024,
    mobileSrc: images.heroContinuityMobile,
    mobileWidth: 1080,
    mobileHeight: 1620,
  },
  {
    id: 'people',
    src: images.hero05,
    alt: imageAlts.hero05,
    width: 1024,
    height: 409,
    mobileSrc: images.heroPeopleMobile,
    mobileWidth: 682,
    mobileHeight: 1024,
    hits: [
      { id: 'join', label: 'Join ICGMTP', action: 'join', box: { left: '4.4%', top: '71.2%', width: '13.6%', height: '11%' } },
      { id: 'about', label: 'Learn More', action: 'hash', href: '/about', box: { left: '18.6%', top: '71.2%', width: '12.4%', height: '11%' } },
      {
        id: 'whatsapp',
        label: 'Join WhatsApp group',
        action: 'external',
        href: org.whatsappGroup,
        box: { left: '31.6%', top: '71.2%', width: '18.8%', height: '11%' },
      },
    ],
  },
  {
    id: 'thrives',
    src: images.hero01,
    alt: imageAlts.hero01,
    width: 1024,
    height: 409,
    mobileSrc: images.heroThrivesMobile,
    mobileWidth: 682,
    mobileHeight: 1024,
    hits: [
      {
        id: 'join',
        label: 'Join the Movement',
        action: 'join',
        box: { left: '45.6%', top: '79.2%', width: '16.8%', height: '10%' },
      },
    ],
  },
  {
    id: 'brighter',
    src: images.hero00,
    alt: imageAlts.hero00,
    width: 1024,
    height: 409,
    mobileSrc: images.heroBrighterMobile,
    mobileWidth: 1024,
    mobileHeight: 1536,
    hits: [
      {
        id: 'join',
        label: 'Be Part of the Future',
        action: 'join',
        box: { left: '4.4%', top: '76%', width: '21%', height: '11%' },
      },
    ],
    mobileHits: [
      {
        id: 'join',
        label: 'Be Part of the Future',
        action: 'join',
        box: { left: '22%', top: '58.5%', width: '56%', height: '6.3%' },
      },
    ],
  },
  {
    id: 'together',
    src: images.hero02,
    alt: imageAlts.hero02,
    width: 1024,
    height: 409,
    mobileSrc: images.heroTogetherMobile,
    mobileWidth: 682,
    mobileHeight: 1024,
    hits: [
      {
        id: 'join',
        label: 'Join the Movement',
        action: 'join',
        box: { left: '15.6%', top: '75.6%', width: '17%', height: '9.4%' },
      },
      {
        id: 'about',
        label: 'Learn More',
        action: 'hash',
        href: '/about',
        box: { left: '33.2%', top: '75.6%', width: '14%', height: '9.4%' },
      },
    ],
  },
  {
    id: 'rising',
    src: images.hero03,
    alt: imageAlts.hero03,
    width: 1024,
    height: 409,
    mobileSrc: images.heroRisingMobile,
    mobileWidth: 682,
    mobileHeight: 1024,
  },
  {
    id: 'continuity-pbat',
    src: images.hero04,
    alt: imageAlts.hero04,
    width: 1024,
    height: 409,
    mobileSrc: images.heroContinuityPbatMobile,
    mobileWidth: 682,
    mobileHeight: 1024,
  },
];
