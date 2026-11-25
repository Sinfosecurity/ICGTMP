import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { newsHasBody, newsNewestFirst, type NewsItem } from '../data/news';
import { CoverImage } from '../components/CoverImage';
import { PageShell } from '../components/PageShell';

function NewsCard({ item }: { item: NewsItem }) {
  const linked = newsHasBody(item);
  const title = linked ? <Link to={`/news/${item.slug}`}>{item.title}</Link> : item.title;
  return (
    <article className="newsListCard">
      <div className="newsThumb">
        <CoverImage
          src={item.image}
          alt={item.alt}
          objectPosition={item.objectPosition}
          width={240}
          height={160}
        />
      </div>
      <div>
        <h2>{title}</h2>
        {item.date ? <p className="newsMeta">{item.date}</p> : null}
        {item.lga ? <p className="newsMeta">{item.lga}</p> : null}
        {item.category ? <p className="newsMeta">{item.category}</p> : null}
        <p>{item.summary}</p>
      </div>
    </article>
  );
}

export function NewsPage() {
  const items = useMemo(() => newsNewestFirst(), []);

  return (
    <PageShell kicker="News" title="News and events">
      <p>These are community activity notes. Official dates will be added when reports are issued.</p>
      <div className="newsList">
        {items.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>
      {items.length === 0 ? <p>No community activity notes yet.</p> : null}
    </PageShell>
  );
}
