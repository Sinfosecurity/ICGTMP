import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { newsItems } from '../../data/news';
import { fadeUpOnce } from '../../lib/fadeUp';
import { CoverImage } from '../CoverImage';
import { JoinCloseSection } from '../JoinCloseSection';
import { useMotion } from '../MotionProvider';

export function SceneNewsClose() {
  const { ready } = useMotion();
  const newsRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready) return;
    const news = newsRef.current;
    const close = closeRef.current;
    const articles = news?.querySelectorAll<HTMLElement>('article');
    const closeInner = close?.querySelector<HTMLElement>('.cineCloseInner');

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (articles) gsap.set(articles, { opacity: 1, y: 0 });
        if (closeInner) gsap.set(closeInner, { opacity: 1, y: 0 });
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (articles?.length) fadeUpOnce(articles, { stagger: 0.08, trigger: news ?? undefined });
        if (closeInner) fadeUpOnce(closeInner, { trigger: close ?? undefined });
      });
      return () => mm.revert();
    });

    return () => ctx.revert();
  }, [ready]);

  return (
    <>
      <section ref={newsRef} id="home-news" className="cineNews" aria-labelledby="cine-news-title">
        <div className="cineNewsInner">
          <div className="cineNewsHead">
            <div>
              <p className="sectionKicker">Updates</p>
              <h2 id="cine-news-title">Latest news &amp; activities</h2>
            </div>
            <Link className="cineNewsAll" to="/news">
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="cineNewsNote">
            These are community activity notes. Official dates will be added when reports are issued.
          </p>
          <div className="cineNewsList">
            {newsItems.map((item) => (
              <article key={item.slug} className="cineReveal">
                <div className="cineNewsThumb">
                  <CoverImage
                    src={item.image}
                    alt={item.alt}
                    objectPosition={item.objectPosition}
                    width={240}
                    height={160}
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  {item.date ? <p className="newsMeta">{item.date}</p> : null}
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JoinCloseSection ref={closeRef} titleId="cine-close-title" />
    </>
  );
}
