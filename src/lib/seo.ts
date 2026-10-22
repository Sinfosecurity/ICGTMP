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
    return { title: `${article.title} | ICGTMP`, description: article.summary };
  }

  return notFoundMeta;
}

export function applyDocumentMeta(meta: PageMeta) {
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
}
