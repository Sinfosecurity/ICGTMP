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
    .filter((word) => word && !/^(hon|engr|barr|mr|alhaji)$/i.test(word));
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
    slug: 'jamiu-arowosegbe',
    name: 'Hon. Jamiu Arowosegbe',
    role: 'Director-General',
    group: 'leadership',
    order: 2,
    photo: '/leaders/jamiu-arowosegbe.webp',
    objectPosition: '50% 18%',
    objectPositionMobile: '50% 16%',
  },
  {
    slug: 'mujaid-adeyemi',
    name: 'Alhaji Mujaid Mercury Adeyemi',
    role: 'Conveyor',
    group: 'leadership',
    order: 3,
    photo: '/leaders/mujaid-adeyemi.webp',
  },
  {
    slug: 'paul-sola-oginni',
    name: 'Mr. Paul Sola Oginni',
    role: 'Conveyor',
    group: 'leadership',
    order: 4,
    photo: '/leaders/paul-sola-oginni.webp',
    objectPosition: '50% 50%',
    objectPositionMobile: '50% 50%',
  },
  {
    slug: 'abiodun-keshinro',
    name: 'Hon. Abiodun Keshinro',
    role: 'Secretary',
    group: 'leadership',
    order: 5,
    photo: '/leaders/abiodun-keshinro.webp',
  },
  {
    slug: 'adebayo-shobaloju',
    name: 'Engr. Adebayo Shobaloju',
    role: 'Deputy Director-General, Diaspora',
    group: 'diaspora',
    order: 6,
    photo: '/leaders/adebayo-shobaloju.webp',
  },
  {
    slug: 'saheed-lawal',
    name: 'Hon. Saheed Lawal',
    role: 'Diaspora Coordinator, Canada',
    group: 'diaspora',
    order: 8,
    photo: '/leaders/saheed-lawal.webp',
    objectPosition: '50% 42%',
    objectPositionMobile: '50% 40%',
  },
  {
    slug: 'bidemi-balogun',
    name: 'Hon. Barr. Bidemi Balogun',
    role: 'Diaspora Coordinator, Europe',
    group: 'diaspora',
    order: 7,
    photo: '/leaders/bidemi-balogun.webp',
  },
];

export function leadersInGroup(group: LeaderGroup): Leader[] {
  return leaders.filter((leader) => leader.group === group).sort((a, b) => a.order - b.order);
}
