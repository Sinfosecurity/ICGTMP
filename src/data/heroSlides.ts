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
  backdrop: string;
  objectFit: 'cover' | 'contain';
  objectPosition: string;
  /**
   * Where to anchor the crop on phones. Each slide is aimed at the
   * photographic part of the artwork, away from its densest lettering.
   */
  objectPositionMobile: string;
  /**
   * Phones show the poster's full height, which is where its lettering lives.
   * Zooming past `cover` creates vertical overflow to pan into, so a dense
   * slide can be framed on its photograph alone. 1 leaves the crop as-is.
   */
  mobileZoom?: number;
  /** Which point the zoom holds still; only the vertical part usually matters. */
  mobileOrigin?: string;
  hits?: HeroHit[];
  /**
   * The artwork's own words, transcribed so phones can render real text
   * instead of shrinking a 1024px composition down to an illegible strip.
   * Desktop still shows the artwork exactly as approved.
   */
  kicker?: string;
  title: string;
  subtitle?: string;
  /**
   * Dense campaign flyer artwork. On phones: no dark overlay or caption text.
   * Prefer a dedicated mobileSrc portrait when provided.
   */
  isFlyer?: boolean;
  /** Portrait flyer shown under 768px via <picture>. */
  mobileSrc?: string;
  mobileWidth?: number;
  mobileHeight?: number;
};

export const HERO_INTERVAL_MS = 5500;
/** First slide (Continuity KOH) is the lead flyer — hold it longer. */
export const HERO_FIRST_INTERVAL_MS = 20000;
export const HERO_FADE_MS = 800;

export const heroSlides: HeroSlide[] = [
  {
    id: 'continuity-koh',
    src: images.hero06b,
    alt: imageAlts.hero06b,
    width: 2560,
    height: 1024,
    backdrop: '#003321',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    objectPositionMobile: '50% 50%',
    isFlyer: true,
    mobileSrc: images.heroContinuityMobile,
    mobileWidth: 1080,
    mobileHeight: 1620,
    kicker: 'Continuity 2027 · Vote BAT · Lagos Rising',
    title: 'Vote KOH',
    subtitle: 'Dr. Kadri Obafemi Hamzat for Governor of Lagos State.',
  },
  {
    id: 'people',
    src: images.hero05,
    alt: imageAlts.hero05,
    width: 1024,
    height: 409,
    backdrop: '#06180f',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    objectPositionMobile: '79% 46%',
    kicker: 'People | Opportunity | Progress',
    title: 'A Stronger Lagos Through Its People',
    subtitle:
      'Mobilizing traders, market communities, artisans, entrepreneurs and professionals across Lagos East.',
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
    id: 'brighter',
    src: images.hero00,
    alt: imageAlts.hero00,
    width: 1024,
    height: 409,
    backdrop: '#041018',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    objectPositionMobile: '77% 45%',
    kicker: 'Innovation · Investment · Opportunities',
    title: 'A Brighter Lagos Tomorrow',
    subtitle: 'Modern Infrastructure. Inclusive Growth. Real Opportunities. Stronger Communities.',
    hits: [
      {
        id: 'join',
        label: 'Be Part of the Future',
        action: 'join',
        box: { left: '4.4%', top: '76%', width: '21%', height: '11%' },
      },
    ],
  },
  {
    id: 'thrives',
    src: images.hero01,
    alt: imageAlts.hero01,
    width: 1024,
    height: 409,
    backdrop: '#f4f7f4',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    objectPositionMobile: '2% 45%',
    kicker: 'People • Markets • Businesses • Communities',
    title: 'Lagos Thrives When People Prosper',
    subtitle: 'Supporting Traders. Empowering Markets. Building Stronger Communities.',
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
    id: 'together',
    src: images.hero02,
    alt: imageAlts.hero02,
    width: 1024,
    height: 409,
    backdrop: '#e8f0ea',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    objectPositionMobile: '100% 62%',
    mobileZoom: 2.2,
    mobileOrigin: '50% 78%',
    kicker: 'Together for a',
    title: 'Stronger Lagos',
    subtitle: 'Mobilizing Tradesmen. Empowering Markets. Supporting Professionals.',
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
    backdrop: '#f3d2ae',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    objectPositionMobile: '50% 50%',
    isFlyer: true,
    mobileSrc: images.heroRisingMobile,
    mobileWidth: 1080,
    mobileHeight: 1620,
    kicker: 'Leadership • Service • Development',
    title: 'Lagos Rising',
    subtitle: 'Dr. Kadri Obafemi Hamzat for Governor of Lagos State.',
  },
  {
    id: 'continuity',
    src: images.hero04,
    alt: imageAlts.hero04,
    width: 1024,
    height: 409,
    backdrop: '#e8d7b4',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    objectPositionMobile: '50% 50%',
    isFlyer: true,
    mobileSrc: images.heroContinuityPbatMobile,
    mobileWidth: 1080,
    mobileHeight: 1620,
    kicker: 'A Stronger Nigeria | A Brighter Tomorrow',
    title: 'Continuity 2027',
    subtitle: 'President Bola Ahmed Tinubu for a second term.',
  },
];
