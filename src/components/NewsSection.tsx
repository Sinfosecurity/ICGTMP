import { newsItems } from '../data/content';
import { CoverImage } from './CoverImage';

export function NewsSection() {
  return (
    <section id="news-and-events" className="newsPanel">
      <div className="panelTitle">
        <h2>LATEST NEWS &amp; ACTIVITIES</h2>
      </div>
      <p className="newsNote">
        These are community activity notes. Official dates will be added when reports are issued.
      </p>
      {newsItems.map((item) => (
        <article key={item.title}>
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
            <h3>{item.title}</h3>
            <p className="newsMeta">{item.dateLabel}</p>
            <p>{item.summary}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
