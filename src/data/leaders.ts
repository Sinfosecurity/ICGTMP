import { imageAlts, images } from './images';

export type Leader = {
  name: string;
  title: string;
  image: string;
  alt: string;
  objectPosition: string;
  objectPositionMobile: string;
  bio?: string;
  lga?: string;
};

export const leaders: Leader[] = [
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
