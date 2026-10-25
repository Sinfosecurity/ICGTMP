import { SITE } from '../config/site';
import { newsArticle } from '../data/news';
import { programById } from '../data/programs';
import { navigation, notFoundMeta, type NavItem } from '../data/site';

export type PageMeta = Pick<NavItem, 'title' | 'description'>;

export function metaForPath(pathname: string): PageMeta {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  const nav = navigation.find((item) => item.to === path);
  if (nav) return { title: nav.title, description: nav.description };

  const programMatch = /^\/programs\/([^/]+)$/.exec(path);
  if (programMatch) {
    const program = programById(decodeURIComponent(programMatch[1]));
    if (!program) return notFoundMeta;
    return { title: program.seoTitle, description: program.seoDescription };
  }

  const newsMatch = /^\/news\/([^/]+)$/.exec(path);
  if (newsMatch) {
    const article = newsArticle(decodeURIComponent(newsMatch[1]));
    if (!article) return notFoundMeta;
    return { title: `${article.title} | ICGMTP`, description: article.summary };
  }

  return notFoundMeta;
}

export function canonicalForPath(pathname: string): string {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  return path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertMeta(selector: string, attr: string, key: string, content: string) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applyDocumentMeta(meta: PageMeta, pathname: string) {
  document.title = meta.title;
  const canonical = canonicalForPath(pathname);
  const image = `${SITE.url}/resources/og-image.webp`;
  upsertLink('canonical', canonical);
  upsertMeta('meta[name="description"]', 'name', 'description', meta.description);
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
  upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
}
