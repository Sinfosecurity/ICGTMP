import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { newsArticle } from '../data/news';
import { PageShell } from '../components/PageShell';
import { NotFoundPage } from './NotFoundPage';

export function NewsArticlePage() {
  const { slug } = useParams();
  const article = newsArticle(slug);
  const [copied, setCopied] = useState(false);

  if (!article) return <NotFoundPage />;

  const paragraphs = article.body?.split(/\n\n+/).filter(Boolean) ?? [];
  const pageUrl = typeof window === 'undefined' ? `/news/${article.slug}` : window.location.href;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${article.title} ${pageUrl}`)}`;

  return (
    <PageShell kicker="News" title={article.title}>
      {article.date ? <p className="newsMeta">{article.date}</p> : null}
      {article.lga ? <p className="newsMeta">{article.lga}</p> : null}
      {article.category ? <p className="newsMeta">{article.category}</p> : null}
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {article.gallery?.length ? (
        <div className="newsGallery">
          {article.gallery.map((image) => (
            <img key={image.src} src={image.src} alt={image.alt} width={800} height={533} />
          ))}
        </div>
      ) : null}
      <p className="shareRow">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">
          Share on WhatsApp
        </a>
        <button
          type="button"
          className="greenPill"
          onClick={() => {
            void navigator.clipboard?.writeText(pageUrl).then(() => {
              setCopied(true);
            });
          }}
        >
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </p>
      <p>
        <Link to="/news">All news</Link>
      </p>
    </PageShell>
  );
}
