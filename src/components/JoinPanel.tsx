import { ArrowRight, HeartHandshake, Store, Users } from 'lucide-react';
import { imageAlts, images } from '../data/images';
import { useJoin } from '../routes/JoinProvider';
import { CoverImage } from './CoverImage';

export function JoinPanel() {
  const onJoin = useJoin();
  return (
    <aside className="joinPanel">
      <CoverImage
        src={images.community}
        srcSet={images.communitySrcSet}
        sizes="(max-width: 1100px) 100vw, 360px"
        width={1200}
        height={800}
        alt={imageAlts.community}
        objectPosition="50% 42%"
        objectPositionMobile="48% 40%"
      />
      <div className="joinShade" />
      <div className="joinHero">
        <h2>
          Be Part of
          <br />
          the Movement
        </h2>
        <p>Join traders, artisans, professionals, women and youth building stronger communities.</p>
        <button type="button" className="goldPill" data-join-trigger onClick={() => onJoin()}>
          Join ICGMTP Today <ArrowRight size={16} />
        </button>
      </div>
      <div className="joinOptions">
        <button type="button" onClick={() => onJoin('Markets & Traders')}>
          <Store size={20} aria-hidden="true" />
          <b>Register</b>
          <small>as a Member</small>
        </button>
        <button type="button" onClick={() => onJoin('Volunteer')}>
          <Users size={20} aria-hidden="true" />
          <b>Volunteer</b>
          <small>Your Skills</small>
        </button>
        <button type="button" onClick={() => onJoin('Partner/Stakeholder')}>
          <HeartHandshake size={20} aria-hidden="true" />
          <b>Partner</b>
          <small>with Us</small>
        </button>
      </div>
    </aside>
  );
}
