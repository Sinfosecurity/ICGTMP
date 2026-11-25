import { MapPin, Mail, Phone } from 'lucide-react';
import { mapsUrl, org } from '../data/site';
import { PageShell } from '../components/PageShell';
import { WhatsAppJoinLink } from '../components/WhatsAppJoinLink';

export function ContactPage() {
  return (
    <PageShell kicker="Contact" title="Write to ICGMTP">
      <div className="contactLayout">
        <div className="contactCard">
          <p>
            The working address is at Ita&apos;le Market, Epe Waterfront. Write by email, or join
            the public WhatsApp group.
          </p>
          <p>
            <MapPin size={16} aria-hidden="true" /> {org.addressLines.join(', ')}
          </p>
          <p className="contactPhones">
            <Phone size={16} aria-hidden="true" />
            {org.phones.map((phone) => (
              <a key={phone.tel} href={`tel:${phone.tel}`}>
                {phone.display}
              </a>
            ))}
          </p>
          <p>
            <Mail size={16} aria-hidden="true" /> <a href={`mailto:${org.email}`}>{org.email}</a>
          </p>
          <p>
            <WhatsAppJoinLink />
          </p>
          <p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </p>
          <p className="quietNote">Office visits are by arrangement through email.</p>
        </div>
      </div>
    </PageShell>
  );
}
