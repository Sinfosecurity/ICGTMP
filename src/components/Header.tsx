import { Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navigation } from '../data/site';
import { focusables, lockPageScroll, trapTab } from '../lib/scrollLock';
import { useJoin } from '../routes/JoinProvider';
import { Brand } from './Brand';
import { WhatsAppJoinLink } from './WhatsAppJoinLink';

export function Header() {
  const onJoin = useJoin();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

  const links = navigation.filter((item) => item.header && item.to !== '/');

  return (
    <header ref={headerRef} className="siteHeader siteHeaderSolid isSolid">
      <div className="headerTop">
        <Brand />
        <button
          ref={menuBtnRef}
          className="mobileMenu"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav
          ref={navRef}
          id={menuId}
          className={menuOpen ? 'mainNav open' : 'mainNav'}
          aria-label="Primary"
        >
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
          <WhatsAppJoinLink
            iconOnly
            className="headerWhatsApp headerWhatsApp--desktop"
            aria-label="Join our WhatsApp group"
          />
          <button type="button" className="goldCta" data-join-trigger onClick={() => onJoin()}>
            Join ICGMTP
          </button>
          <WhatsAppJoinLink className="headerWhatsApp headerWhatsApp--mobile" />
        </nav>
      </div>
    </header>
  );
}
