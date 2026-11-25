import { Fragment } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { mapsEmbedUrl, mapsUrl, org } from '../data/site';
import { PageShell } from '../components/PageShell';
import { WhatsAppJoinLink } from '../components/WhatsAppJoinLink';

export function ContactPage() {
  return (
    <PageShell kicker="Contact" title="Write to ICGMTP">
      <div className="contactLayout">
        <div className="contactCard">
          <p className="contactIntro">
            The working address is at Ita&apos;le Market, Epe Waterfront. Write by email, or join
            the public WhatsApp group.
          </p>
          <p className="contactRow">
            <MapPin size={16} aria-hidden="true" />
            <span>{org.addressLines.join(', ')}</span>
          </p>
          <p className="contactRow contactPhones">
            <Phone size={16} aria-hidden="true" />
            <span>
              {org.phones.map((phone, index) => (
                <Fragment key={phone.tel}>
                  {index > 0 ? <span aria-hidden="true"> · </span> : null}
                  <a href={`tel:${phone.tel}`}>{phone.display}</a>
                </Fragment>
              ))}
            </span>
          </p>
          <p className="contactRow">
            <Mail size={16} aria-hidden="true" />
            <a href={`mailto:${org.email}`}>{org.email}</a>
          </p>
          <p className="quietNote">Office visits are by arrangement through email.</p>
        </div>

        <div className="contactMapPanel">
          <iframe
            className="contactMap"
            title="ICGMTP office location — 5 Akeusola Street, Ita'le Market, Epe Waterfront"
            src={mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="contactMapActions">
            <WhatsAppJoinLink className="cineIntroWhatsApp" />
            <a
              className="innerTextLink"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
