import { MapPin } from 'lucide-react';
import { mapsUrl, org } from '../data/content';
import { Brand } from './Brand';
import { WhatsAppJoinLink } from './WhatsAppJoinLink';

export function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerSkyline" aria-hidden="true" />
      <div className="footerGrid">
        <div className="footerBrand">
          <Brand variant="footer" />
          <div className="footerMotto">
            <em>{org.motto}</em>
            <span>{org.banner.toUpperCase()}</span>
          </div>
        </div>
        <div className="footerLinks">
          <h2>Quick Links</h2>
          <a href="#about">About</a>
          <a href="#leadership">Leadership</a>
          <a href="#programs">Programs</a>
          <a href="#news-and-events">News &amp; Events</a>
          <a href="#resources">Resources</a>
          <a href="#structure">LGAs &amp; LCDAs</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footerContact">
          <h2>Contact Us</h2>
          <p>
            <MapPin size={15} aria-hidden="true" />
            <span>
              {org.addressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </span>
          </p>
          <p>
            <a href={`mailto:${org.email}`}>{org.email}</a>
          </p>
          <p>
            <WhatsAppJoinLink />
          </p>
          <p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Open map
            </a>
          </p>
        </div>
      </div>
      <div className="footerBottom">
        <span>© 2026 {org.shortName}. All rights reserved.</span>
        <nav aria-label="Legal">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
          <a href="#sitemap">Site Map</a>
        </nav>
      </div>
    </footer>
  );
}
