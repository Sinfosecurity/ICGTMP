import { readFileSync, writeFileSync } from 'node:fs';
import { SITE } from '../src/config/site.ts';

const staticPaths = [
  '/',
  '/about',
  '/leadership',
  '/structure',
  '/programs',
  '/news',
  '/resources',
  '/contact',
  '/privacy',
  '/terms',
  '/sitemap',
];

function quoted(source: string, key: string): string[] {
  return [...source.matchAll(new RegExp(`${key}: '([^']+)'`, 'g'))].map((match) => match[1]);
}

function newsSlugs(): string[] {
  const candidates = ['src/content/news.ts', 'src/data/news.ts'];
  for (const file of candidates) {
    try {
      const source = readFileSync(file, 'utf8');
      if (!source.includes('body:')) continue;
      const slugs = quoted(source, 'slug');
      if (slugs.length) return slugs;
      return quoted(source, 'title').map((title) =>
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
      );
    } catch {
      // Try the next content file.
    }
  }
  return [];
}

const programIds = quoted(readFileSync('src/data/programs.ts', 'utf8'), 'id');
const paths = [
  ...staticPaths,
  ...programIds.map((id) => `/programs/${id}`),
  ...newsSlugs().map((slug) => `/news/${slug}`),
];

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((path) => `  <url><loc>${path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`}</loc></url>`)
  .join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', body);
console.log(`Wrote ${paths.length} URLs to public/sitemap.xml`);
