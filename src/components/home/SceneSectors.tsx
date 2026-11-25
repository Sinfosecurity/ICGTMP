import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { programPath, programs } from '../../data/programs';
import { fadeUpOnce } from '../../lib/fadeUp';
import { CoverImage } from '../CoverImage';
import { useMotion } from '../MotionProvider';

function oneLine(text: string) {
  const sentence = text.split(/(?<=\.)\s/)[0] ?? text;
  return sentence.length > 110 ? `${sentence.slice(0, 107).trim()}…` : sentence;
}

export function SceneSectors() {
  const { ready } = useMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const root = rootRef.current;
    const cards = root.querySelectorAll<HTMLElement>('.cineSectorCard');

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(cards, { opacity: 1, y: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        fadeUpOnce(cards, { stagger: 0.1, trigger: root.querySelector('.cineSectorGrid') ?? root });
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={rootRef}
      id="who-we-serve"
      className="cineSectors"
      aria-labelledby="cine-sectors-title"
    >
      <div className="cineSectorsInner">
        <div className="cineSectorsHead">
          <p className="sectionKicker">Programmes</p>
          <h2 id="cine-sectors-title">Who we serve</h2>
        </div>
        <div className="cineSectorGrid">
          {programs.map((sector) => (
            <article key={sector.id} className="cineSectorCard cineReveal">
              <div className="cineSectorCardPhoto">
                <CoverImage
                  src={sector.image}
                  srcSet={sector.srcSet}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  width={800}
                  height={1000}
                  alt={sector.alt}
                  objectPosition={sector.objectPosition}
                  objectPositionMobile={sector.objectPositionMobile}
                  loading="lazy"
                />
              </div>
              <h3>{sector.title}</h3>
              <p>{oneLine(sector.cardText)}</p>
              <Link to={programPath(sector.id)}>
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
