/**
 * Old hash routes, from the SPA that used window.location.hash as the router.
 * Unknown hashes return null so in-page targets such as #main are left alone.
 */
const EXACT: Record<string, string> = {
  home: '/',
  about: '/about',
  leadership: '/leadership',
  'our-structure': '/structure',
  structure: '/structure',
  'news-and-events': '/news',
  resources: '/resources',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  sitemap: '/sitemap',
  programs: '/programs',
};

export function pathForLegacyHash(hash: string): string | null {
  let raw = hash.trim();
  if (!raw) return null;
  try {
    raw = decodeURIComponent(raw);
  } catch {
    return null;
  }
  raw = raw.replace(/^#/, '').replace(/^\/+/, '').trim();
  if (!raw) return null;

  const parts = raw.split('/').filter(Boolean);
  const [id, nested] = parts;
  if (!id || parts.length > 2) return null;

  if (id === 'programs' && nested) return `/programs/${nested}`;
  if (nested) return null;
  return EXACT[id] ?? null;
}
