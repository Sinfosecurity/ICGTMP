import { org } from './content';
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
  objectPositionMobile: string;
  hits?: HeroHit[];
};

export const HERO_INTERVAL_MS = 5500;
export const HERO_FADE_MS = 800;

export const heroSlides: HeroSlide[] = [
  {
    id: 'people',
    src: images.hero05,
    alt: imageAlts.hero05,
    width: 1024,
    height: 409,
    backdrop: '#06180f',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    objectPositionMobile: '50% 50%',
    hits: [
      { id: 'join', label: 'Join ICGTMP', action: 'join', box: { left: '4.4%', top: '71.2%', width: '13.6%', height: '11%' } },
      { id: 'about', label: 'Learn More', action: 'hash', href: '#about', box: { left: '18.6%', top: '71.2%', width: '12.4%', height: '11%' } },
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
    objectPositionMobile: '50% 50%',
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
    objectPositionMobile: '38% 50%',
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
    objectPositionMobile: '50% 50%',
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
        href: '#about',
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
    objectPositionMobile: '58% 50%',
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
    objectPositionMobile: '54% 50%',
  },
];
