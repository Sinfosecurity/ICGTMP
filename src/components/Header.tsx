import { Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { navItems, org } from '../data/content';
import type { RouteState } from '../lib/routing';
import { focusables, lockPageScroll, trapTab } from '../lib/scrollLock';
import { Brand } from './Brand';

type Props = {
  route: RouteState;
  onJoin: () => void;
};

export function Header({ route, onJoin }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpen.current) {
        wasOpen.current = false;
        window.requestAnimationFrame(() => menuBtnRef.current?.focus());
      }
      return;
    }

    wasOpen.current = true;
    const unlock = lockPageScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
      if (headerRef.current) trapTab(event, headerRef.current);
    };
    window.addEventListener('keydown', onKey);
    const frame = window.requestAnimationFrame(() => {
      focusables(navRef.current ?? document.body)[0]?.focus();
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      window.cancelAnimationFrame(frame);
      unlock();
    };
  }, [menuOpen]);

  const isActive = (id: string) => {
    if (id === 'home') return route.view === 'home' && (route.section === 'home' || route.section === '');
    if (id === 'about') return route.view === 'about';
    if (id === 'resources') return route.view === 'resources';
    if (id === 'programs') return route.view === 'programs';
    if (id === 'contact') return route.view === 'contact';
    if (id === 'our-structure') {
      return route.view === 'structure' || (route.view === 'home' && route.section === 'our-structure');
    }
    return route.view === 'home' && route.section === id;
  };

  return (
    <header ref={headerRef} className="siteHeader">
      <div className="headerTop">
        <Brand />
        <p className="motto">{org.motto}</p>
        <button
          ref={menuBtnRef}
          className="mobileMenu"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav ref={navRef} id={menuId} className={menuOpen ? 'mainNav open' : 'mainNav'} aria-label="Primary">
        {navItems.map((item) => (
          <a key={item.id} className={isActive(item.id) ? 'active' : undefined} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
        <button type="button" className="goldCta" data-join-trigger onClick={onJoin}>
          Join ICGTMP
        </button>
      </nav>
    </header>
  );
}
