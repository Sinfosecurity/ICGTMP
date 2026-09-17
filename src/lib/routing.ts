export type View =
  | 'home'
  | 'about'
  | 'resources'
  | 'structure'
  | 'legal'
  | 'programs'
  | 'contact'
  | 'notfound';
export type LegalSlug = 'privacy' | 'terms' | 'sitemap';

export type RouteState = {
  view: View;
  section: string;
  legal?: LegalSlug;
};

const LEGAL: LegalSlug[] = ['privacy', 'terms', 'sitemap'];
const HOME_SECTIONS = new Set(['home', 'leadership', 'our-structure', 'news-and-events']);
const PROGRAM_SECTIONS = new Set(['markets', 'artisans', 'professionals', 'women-youth']);

export function parseHash(hash: string): RouteState {
  const raw = decodeURIComponent(hash.replace(/^#/, '')).trim() || 'home';
  const [id, nested] = raw.split('/');

  if (id === 'about') return { view: 'about', section: 'about' };
  if (id === 'resources') return { view: 'resources', section: 'resources' };
  if (id === 'structure' || id === 'lgas-lcdas') {
    return { view: 'structure', section: 'our-structure' };
  }
  if (id === 'programs') {
    if (nested && !PROGRAM_SECTIONS.has(nested)) {
      return { view: 'notfound', section: raw };
    }
    return { view: 'programs', section: nested || 'programs' };
  }
  if (id === 'contact') return { view: 'contact', section: 'contact' };
  if (LEGAL.includes(id as LegalSlug)) {
    return { view: 'legal', section: id, legal: id as LegalSlug };
  }
  if (HOME_SECTIONS.has(id) && !nested) {
    return { view: 'home', section: id };
  }

  return { view: 'notfound', section: raw };
}

export function currentHash(): string {
  return window.location.hash || '#home';
}
