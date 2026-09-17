import type { RouteState } from './routing';

const baseTitle = 'ICGTMP | Strength. Stability. Support.';
const baseDescription =
  'Independent Campaign Group for Tradesmen, Markets & Professionals — connecting grassroots communities, markets, artisans, entrepreneurs and professionals across Lagos East.';

const pages: Record<string, { title: string; description: string }> = {
  home: { title: baseTitle, description: baseDescription },
  about: {
    title: 'About | ICGTMP',
    description: 'Who ICGTMP is and who the group serves across Lagos East.',
  },
  programs: {
    title: 'Programs | ICGTMP',
    description: 'Markets, artisans, professionals, and women and youth programmes across Lagos East.',
  },
  resources: {
    title: 'Resources | ICGTMP',
    description: 'How to join ICGTMP, find the Lagos East structure, and contact the group.',
  },
  structure: {
    title: 'Our Structure | ICGTMP',
    description: 'Lagos East LGAs and LCDAs where ICGTMP organizes at the grassroots.',
  },
  contact: {
    title: 'Contact | ICGTMP',
    description:
      'Write to ICGTMP at Ita’le Market, Epe Waterfront, email info@icgtmp.org, or join the WhatsApp group.',
  },
  privacy: {
    title: 'Privacy Policy | ICGTMP',
    description: 'How ICGTMP handles membership and contact form submissions.',
  },
  terms: {
    title: 'Terms of Use | ICGTMP',
    description: 'Terms for using the ICGTMP public website.',
  },
  sitemap: {
    title: 'Site Map | ICGTMP',
    description: 'All public pages on the ICGTMP website.',
  },
  notfound: {
    title: 'Page not found | ICGTMP',
    description: 'That address is not a page on the ICGTMP website.',
  },
};

export function metaForRoute(route: RouteState) {
  if (route.view === 'legal' && route.legal) return pages[route.legal] ?? pages.home;
  return pages[route.view] ?? pages.home;
}

export function applyDocumentMeta(route: RouteState) {
  const meta = metaForRoute(route);
  document.title = meta.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', meta.description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.title);
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', meta.description);
}
