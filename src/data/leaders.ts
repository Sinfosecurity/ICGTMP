export type LeaderGroup = 'leadership' | 'diaspora';

export type Leader = {
  slug: string;
  name: string;
  role: string;
  group: LeaderGroup;
  order: number;
  photo: string;
  objectPosition?: string;
  objectPositionMobile?: string;
};

const leaderPhotoFiles = import.meta.glob('../../public/leaders/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function leaderHasPhoto(photo: string): boolean {
  const file = photo.slice(photo.lastIndexOf('/') + 1);
  return Object.keys(leaderPhotoFiles).some((path) => path.endsWith(`/${file}`));
}

export function leaderInitials(name: string): string {
  const words = name
    .split(/\s+/)
    .map((word) => word.replace(/\./g, ''))
    .filter((word) => word && !/^(hon|engr|barr)$/i.test(word));
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1][0] : (words[0]?.[1] ?? '');
  return `${first}${last}`.toUpperCase();
}

export const leaderGroups: { id: LeaderGroup; label: string }[] = [
  { id: 'leadership', label: 'Leadership' },
  { id: 'diaspora', label: 'Diaspora' },
];

export const leaders: Leader[] = [
  {
    slug: 'farihuddin-arebi',
    name: 'Hon. Farihuddin Arebi',
    role: 'Convener',
    group: 'leadership',
    order: 1,
    photo: '/leaders/farihuddin-arebi.webp',
    objectPosition: '50% 50%',
    objectPositionMobile: '50% 50%',
  },
  {
    slug: 'paul-sola-ogini',
    name: 'Paul Sola Ogini',
    role: 'Convener',
    group: 'leadership',
    order: 2,
    photo: '/leaders/paul-sola-ogini.webp',
  },
  {
    slug: 'jamiu-arowosegbe',
    name: 'Hon. Jamiu Arowosegbe',
    role: 'Director-General',
    group: 'leadership',
    order: 3,
    photo: '/leaders/jamiu-arowosegbe.webp',
    objectPosition: '50% 18%',
    objectPositionMobile: '50% 16%',
  },
  {
    slug: 'akeem-keshinro',
    name: 'Hon. Akeem Keshinro',
    role: 'Secretary',
    group: 'leadership',
    order: 4,
    photo: '/leaders/akeem-keshinro.webp',
  },
  {
    slug: 'adebayo-shobaloju',
    name: 'Engr. Adebayo Shobaloju',
    role: 'Deputy Director-General, Diaspora',
    group: 'diaspora',
    order: 5,
    photo: '/leaders/adebayo-shobaloju.webp',
  },
  {
    slug: 'saheed-lawal',
    name: 'Hon. Saheed Lawal',
    role: 'Diaspora Coordinator, Canada',
    group: 'diaspora',
    order: 6,
    photo: '/leaders/saheed-lawal.webp',
  },
  {
    slug: 'bola-foriletie',
    name: 'Hon. Barr. Bola Foriletie',
    role: 'Diaspora Coordinator, United Kingdom',
    group: 'diaspora',
    order: 7,
    photo: '/leaders/bola-foriletie.webp',
  },
];

export function leadersInGroup(group: LeaderGroup): Leader[] {
  return leaders.filter((leader) => leader.group === group).sort((a, b) => a.order - b.order);
}
