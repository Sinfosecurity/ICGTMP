import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsFacet, newsHasBody, newsNewestFirst, type NewsItem } from '../data/news';
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
  const lgas = useMemo(() => newsFacet(items, 'lga'), [items]);
  const categories = useMemo(() => newsFacet(items, 'category'), [items]);
  const [lga, setLga] = useState('');
  const [category, setCategory] = useState('');
  const visible = items.filter((item) => {
    if (lga && item.lga !== lga) return false;
    if (category && item.category !== category) return false;
    return true;
  });

  return (
    <PageShell kicker="News" title="News and events">
      <p>These are community activity notes. Official dates will be added when reports are issued.</p>
      <form className="newsFilters" onSubmit={(event) => event.preventDefault()}>
        <label>
          LGA
          <select value={lga} onChange={(event) => setLga(event.target.value)}>
            <option value="">All</option>
            {lgas.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </form>
      <div className="newsList">
        {visible.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>
      {visible.length === 0 ? <p>No notes match those filters.</p> : null}
    </PageShell>
  );
}
