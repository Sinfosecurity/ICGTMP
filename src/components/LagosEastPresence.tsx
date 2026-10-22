import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, MapPin, Users } from 'lucide-react';
import { eastLgaNames } from '../data/lagosLgas';
import { LagosMap } from './LagosMap';

export function LagosEastPresence() {
  return (
    <section id="home-structure" className="presenceSection">
      <div className="presenceIntro">
        <h2>
          OUR PRESENCE
          <br />
          IN LAGOS EAST
        </h2>
        <p>
          Working across 5 Local Government Areas and associated LCDAs, building strong grassroots
          networks across communities in Lagos East.
        </p>
        <Link className="goldSmall" to="/structure">
          View LGAs &amp; LCDAs <ArrowRight size={15} />
        </Link>
      </div>
      <div className="presenceMap">
        <LagosMap />
      </div>
      <div className="presenceStats">
        <div>
          <MapPin size={20} aria-hidden="true" />
          <p>
            <b>5 LGAs</b>
            <small className="eastLgaList">{eastLgaNames.join(' · ')}</small>
          </p>
        </div>
        <div>
          <Handshake size={20} aria-hidden="true" />
          <p>
            <b>11 LCDAs</b>
            <small>Across Lagos East</small>
          </p>
        </div>
        <div>
          <Users size={20} aria-hidden="true" />
          <p>
            <b>Wards &amp; Communities</b>
            <small>At the grassroots</small>
          </p>
        </div>
        <Link className="greenPill" to="/structure">
          Explore Our Structure <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
