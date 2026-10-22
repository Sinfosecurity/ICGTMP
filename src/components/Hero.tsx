import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HERO_FADE_MS, HERO_INTERVAL_MS, heroSlides, type HeroHit } from '../data/heroSlides';
import { useJoin } from '../routes/JoinProvider';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Hero() {
  const onJoin = useJoin();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [resumeToken, setResumeToken] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const skipClick = useRef(false);

  const goTo = useCallback((next: number) => {
    const count = heroSlides.length;
    setIndex(((next % count) + count) % count);
    setResumeToken((token) => token + 1);
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(media.matches);
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', onMotion);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMotion);
    };
  }, []);

  useEffect(() => {
    if (hidden || reducedMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [hidden, reducedMotion, resumeToken]);

  const onHit = (hit: HeroHit) => {
    if (hit.action === 'join') {
      onJoin();
      return;
    }
    if (hit.action === 'hash' && hit.href) {
      navigate(hit.href);
      return;
    }
    if (hit.action === 'external' && hit.href) {
      window.open(hit.href, '_blank', 'noopener,noreferrer');
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch') return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || event.pointerType !== 'touch') return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    skipClick.current = true;
    goTo(index + (dx < 0 ? 1 : -1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1);
    }
  };

  return (
    <section
      id="home"
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured campaign artwork"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="heroCarousel" style={{ '--hero-fade': `${HERO_FADE_MS}ms` } as CSSProperties}>
        {heroSlides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          return (
            <figure
              key={slide.id}
              className={isActive ? `heroSlide heroSlide--${slide.id} isActive` : `heroSlide heroSlide--${slide.id}`}
              data-hero-slide={slide.id}
              aria-hidden={!isActive}
              style={
                {
                  background: slide.backdrop,
                  '--hero-fit': slide.objectFit,
                  '--photo-pos': slide.objectPosition,
                  '--photo-pos-mobile': slide.objectPositionMobile,
                  '--hero-zoom': slide.mobileZoom ?? 1,
                  '--hero-origin': slide.mobileOrigin ?? '50% 50%',
                } as CSSProperties
              }
            >
              <img
                className="heroImage"
                src={slide.src}
                alt={isActive ? slide.alt : ''}
                width={slide.width}
                height={slide.height}
                sizes="100vw"
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={slideIndex === 0 ? 'high' : 'low'}
                decoding={slideIndex === 0 ? 'sync' : 'async'}
              />
              {/*
                Phones get real text and real buttons over the photograph; the
                artwork's own lettering is unreadable at 390px. CSS shows one or
                the other, so neither is duplicated in the accessibility tree.
                The copy is aria-hidden because the image alt already carries it.
              */}
              <div className="heroContent">
                <div className="heroCopy" aria-hidden="true">
                  {slide.kicker ? <p className="heroKicker">{slide.kicker}</p> : null}
                  <p className="heroTitle">{slide.title}</p>
                  {slide.subtitle ? <p className="heroSub">{slide.subtitle}</p> : null}
                </div>
                {slide.hits?.length ? (
                  <div className="heroActions">
                    {slide.hits.map((hit, hitIndex) =>
                      hit.action === 'hash' && hit.href ? (
                        <Link
                          key={hit.id}
                          className={hitIndex === 0 ? 'goldPill' : 'ghostPill'}
                          to={hit.href}
                          tabIndex={isActive ? undefined : -1}
                          onClick={(event) => {
                            // A swipe that began on the button is not a tap.
                            if (skipClick.current) {
                              event.preventDefault();
                              skipClick.current = false;
                            }
                          }}
                        >
                          {hit.label}
                        </Link>
                      ) : (
                        <button
                          key={hit.id}
                          type="button"
                          className={hitIndex === 0 ? 'goldPill' : 'ghostPill'}
                          data-join-trigger={hit.id === 'join' ? true : undefined}
                          tabIndex={isActive ? undefined : -1}
                          onClick={() => {
                            if (skipClick.current) {
                              skipClick.current = false;
                              return;
                            }
                            onHit(hit);
                          }}
                        >
                          {hit.label}
                        </button>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
              {isActive && slide.hits ? (
                <div className="heroHits">
                  {slide.hits.map((hit) =>
                    hit.action === 'hash' && hit.href ? (
                      <Link
                        key={hit.id}
                        className="heroHit"
                        style={hit.box}
                        to={hit.href}
                        aria-label={hit.label}
                        data-join-trigger={hit.id === 'join' ? true : undefined}
                        onClick={(event) => {
                          if (skipClick.current) {
                            event.preventDefault();
                            skipClick.current = false;
                          }
                        }}
                      >
                        {hit.label}
                      </Link>
                    ) : (
                      <button
                        key={hit.id}
                        type="button"
                        className="heroHit"
                        style={hit.box}
                        aria-label={hit.label}
                        data-join-trigger={hit.id === 'join' ? true : undefined}
                        onClick={() => {
                          if (skipClick.current) {
                            skipClick.current = false;
                            return;
                          }
                          onHit(hit);
                        }}
                      >
                        {hit.label}
                      </button>
                    ),
                  )}
                </div>
              ) : null}
            </figure>
          );
        })}

        <button
          type="button"
          className="heroNav heroNavPrev"
          aria-label="Previous slide"
          onClick={() => goTo(index - 1)}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="heroNav heroNavNext"
          aria-label="Next slide"
          onClick={() => goTo(index + 1)}
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>

        <div className="heroDots" role="tablist" aria-label="Hero slides">
          {heroSlides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-label={`Show slide ${slideIndex + 1}: ${slide.alt}`}
              aria-selected={slideIndex === index}
              className={slideIndex === index ? 'isActive' : undefined}
              onClick={() => goTo(slideIndex)}
            />
          ))}
        </div>
      </div>
      <p className="visuallyHidden" aria-live="polite">
        Slide {index + 1} of {heroSlides.length}
      </p>
    </section>
  );
}
