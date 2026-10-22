import { MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mapsUrl, navigation, org } from '../data/site';
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
          {navigation
            .filter((item) => item.footer)
            .map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
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
          <p className="footerPhones">
            <Phone size={15} aria-hidden="true" />
            <span>
              {org.phones.map((phone) => (
                <a key={phone.tel} href={`tel:${phone.tel}`}>
                  {phone.display}
                </a>
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
          {navigation
            .filter((item) => item.legal)
            .map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
        </nav>
      </div>
    </footer>
  );
}
