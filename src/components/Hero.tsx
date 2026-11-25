import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HERO_FADE_MS, HERO_INTERVAL_MS, heroSlides, type HeroHit } from '../data/heroSlides';
import { useJoin } from '../routes/JoinProvider';

const MOBILE_HERO_MQ = '(max-width: 700px)';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileHeroViewport() {
  return window.matchMedia(MOBILE_HERO_MQ).matches;
}

export function Hero() {
  const onJoin = useJoin();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [mobileHero, setMobileHero] = useState(isMobileHeroViewport);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const skipClick = useRef(false);

  const slides = useMemo(
    () => (mobileHero ? heroSlides.filter((slide) => Boolean(slide.mobileSrc)) : heroSlides),
    [mobileHero],
  );

  const playing = !userPaused && !hoverPaused && !focusPaused && !hidden && !reducedMotion;
  const wasPlaying = useRef(playing);

  const goTo = useCallback(
    (next: number) => {
      const count = slides.length;
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
      setProgressKey((key) => key + 1);
    },
    [slides.length],
  );

  useEffect(() => {
    if (index >= slides.length) {
      setIndex(0);
      setProgressKey((key) => key + 1);
    }
  }, [index, slides.length]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const heroMedia = window.matchMedia(MOBILE_HERO_MQ);
    const onMotion = () => setReducedMotion(motionMedia.matches);
    const onHeroViewport = () => setMobileHero(heroMedia.matches);
    document.addEventListener('visibilitychange', onVisibility);
    motionMedia.addEventListener('change', onMotion);
    heroMedia.addEventListener('change', onHeroViewport);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      motionMedia.removeEventListener('change', onMotion);
      heroMedia.removeEventListener('change', onHeroViewport);
    };
  }, []);

  useEffect(() => {
    if (playing && !wasPlaying.current) {
      setProgressKey((key) => key + 1);
    }
    wasPlaying.current = playing;
  }, [playing]);

  useEffect(() => {
    if (!playing || slides.length === 0) return;
    const timer = window.setTimeout(() => {
      goTo(index + 1);
    }, HERO_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, goTo, slides.length]);

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
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
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
      className="hero bannerHero"
      aria-roledescription="carousel"
      aria-label="Campaign banners"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusPaused(false);
        }
      }}
      style={
        {
          '--hero-fade': `${HERO_FADE_MS}ms`,
          '--hero-interval': `${HERO_INTERVAL_MS}ms`,
        } as CSSProperties
      }
    >
      <div className="heroCarousel">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          const img = (
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
          );
          const slideClass = [
            'heroSlide',
            isActive ? 'isActive' : '',
            slide.mobileSrc ? 'heroSlide--mobileArt' : '',
            slide.letterboxFill ? 'heroSlide--letterboxFill' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <figure key={slide.id} className={slideClass} aria-hidden={!isActive}>
              {slide.letterboxFill ? (
                <img
                  className="heroImageBlur"
                  src={slide.src}
                  alt=""
                  aria-hidden="true"
                  width={slide.width}
                  height={slide.height}
                  sizes="100vw"
                  loading={slideIndex === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ) : null}
              {slide.mobileSrc ? (
                <picture>
                  <source media="(max-width: 700px)" srcSet={slide.mobileSrc} />
                  {img}
                </picture>
              ) : (
                img
              )}
              {isActive && slide.hits && !mobileHero ? (
                <div className="heroHits">
                  {slide.hits.map((hit) => {
                    const skipSwipeClick = (event: { preventDefault: () => void }) => {
                      if (skipClick.current) {
                        event.preventDefault();
                        skipClick.current = false;
                      }
                    };
                    if (hit.action === 'hash' && hit.href) {
                      return (
                        <Link
                          key={hit.id}
                          className="heroHit"
                          style={hit.box}
                          to={hit.href}
                          aria-label={hit.label}
                          data-join-trigger={hit.id === 'join' ? true : undefined}
                          onClick={skipSwipeClick}
                        >
                          {hit.label}
                        </Link>
                      );
                    }
                    if (hit.action === 'external' && hit.href) {
                      return (
                        <a
                          key={hit.id}
                          className="heroHit"
                          style={hit.box}
                          href={hit.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={hit.label}
                          onClick={skipSwipeClick}
                        >
                          {hit.label}
                        </a>
                      );
                    }
                    return (
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
                    );
                  })}
                </div>
              ) : null}
            </figure>
          );
        })}

        <button
          type="button"
          className="heroNav heroNavPrev"
          aria-label="Previous banner"
          onClick={() => goTo(index - 1)}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="heroNav heroNavNext"
          aria-label="Next banner"
          onClick={() => goTo(index + 1)}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="heroChrome">
        <div className="heroProgress" role="tablist" aria-label="Banner slides">
          {slides.map((slide, slideIndex) => {
            const isActive = slideIndex === index;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-label={`Show banner ${slideIndex + 1}: ${slide.alt}`}
                aria-selected={isActive}
                className={[
                  'heroProgressTrack',
                  isActive ? 'isActive' : '',
                  isActive && !playing ? 'isPaused' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => goTo(slideIndex)}
              >
                {isActive ? (
                  <span
                    key={progressKey}
                    className="heroProgressFill"
                    style={{
                      animationDuration: `${HERO_INTERVAL_MS}ms`,
                      animationPlayState: playing ? 'running' : 'paused',
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="heroPause"
          aria-controls="home"
          aria-pressed={userPaused || reducedMotion}
          aria-label={userPaused || reducedMotion ? 'Play banner slideshow' : 'Pause banner slideshow'}
          onClick={() => setUserPaused((value) => !value)}
          disabled={reducedMotion}
        >
          {userPaused || reducedMotion ? (
            <Play size={14} aria-hidden="true" />
          ) : (
            <Pause size={14} aria-hidden="true" />
          )}
        </button>
      </div>

      <p className="visuallyHidden" aria-live="polite">
        Banner {slides.length === 0 ? 0 : index + 1} of {slides.length}
      </p>
    </section>
  );
}
