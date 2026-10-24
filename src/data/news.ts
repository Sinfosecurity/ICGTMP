import { imageAlts, images } from './images';

export type NewsItem = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  alt: string;
  objectPosition: string;
  /** ISO date. Absent until a report is issued. */
  date?: string;
  lga?: string;
  category?: string;
  /** Article body. The detail page renders only when this is present. */
  body?: string;
  gallery?: { src: string; alt: string }[];
};

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const drafts: Omit<NewsItem, 'slug'>[] = [
  {
    title: 'ICGMTP Engages Market Leaders in Epe',
    summary: 'Discussions with market associations on participation and community priorities.',
    image: images.markets,
    alt: imageAlts.markets,
    objectPosition: '38% 40%',
  },
  {
    title: 'Stakeholder Meeting with Artisans in Ikorodu',
    summary: 'Strengthening collaboration with artisan groups across Lagos East.',
    image: images.artisans,
    alt: imageAlts.artisans,
    objectPosition: '70% 35%',
  },
  {
    title: 'ICGMTP Outreach to Professionals',
    summary: 'Building a stronger network of professionals for a greater Lagos.',
    image: images.professionals,
    alt: imageAlts.professionals,
    objectPosition: '50% 28%',
  },
];

export const newsItems: NewsItem[] = drafts.map((item) => ({
  ...item,
  slug: slugFromTitle(item.title),
}));

export function newsHasBody(item: NewsItem): boolean {
  return Boolean(item.body?.trim());
}

/** Dated items first, newest first. Undated items keep their source order. */
export function newsNewestFirst(items: NewsItem[] = newsItems): NewsItem[] {
  return [...items].sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
}

export function newsBySlug(slug: string | undefined): NewsItem | undefined {
  if (!slug) return undefined;
  return newsItems.find((item) => item.slug === slug);
}

/** Detail routes exist only for items that have a body. */
export function newsArticle(slug: string | undefined): NewsItem | undefined {
  const item = newsBySlug(slug);
  if (!item || !newsHasBody(item)) return undefined;
  return item;
}

export function newsFacet(items: NewsItem[], key: 'lga' | 'category'): string[] {
  const values = items.flatMap((item) => {
    const value = item[key]?.trim();
    return value ? [value] : [];
  });
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}
