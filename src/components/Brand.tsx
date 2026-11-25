import { Link } from 'react-router-dom';
import { SITE } from '../config/site';
import { imageAlts, images } from '../data/images';
import { org } from '../data/site';

type Props = {
  variant?: 'header' | 'footer';
};

export function Brand({ variant = 'header' }: Props) {
  if (variant === 'footer') {
    return (
      <div className="footerMarks" role="group" aria-label="Partner organisations">
        <Link className="markPlate" to="/" aria-label={org.shortName}>
          <img src={images.logo} alt={imageAlts.logo} width={120} height={120} loading="lazy" />
        </Link>
        <a
          className="markPlate markPlateFort"
          href={SITE.parentOrg.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Powered by ${SITE.parentOrg.name}`}
        >
          <img
            src={images.fortGroup}
            alt={imageAlts.fortGroup}
            width={120}
            height={120}
            loading="lazy"
          />
        </a>
        <span className="markPlate markPlateLida" aria-label={SITE.diasporaOrg.name}>
          <img
            src={images.lagosiansInDiaspora}
            alt={imageAlts.lagosiansInDiaspora}
            width={120}
            height={120}
            loading="lazy"
          />
        </span>
      </div>
    );
  }

  return (
    <Link className="brand brandCompact" to="/" title={org.fullName}>
      <img className="brandEmblem" src={images.logo} alt="" width={56} height={60} />
      <span className="brandTextStack">
        <strong className="brandName">{org.shortName}</strong>
      </span>
    </Link>
  );
}
