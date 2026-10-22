import { Link } from 'react-router-dom';
import { imageAlts, images } from '../data/images';
import { org } from '../data/site';

type Props = {
  variant?: 'header' | 'footer';
};

export function Brand({ variant = 'header' }: Props) {
  if (variant === 'footer') {
    return (
      <div className="footerMarks">
        <Link className="brand brandFooter" to="/">
          <span className="brandLogoPlate">
            <img src={images.logo} alt={imageAlts.logo} width={180} height={194} />
          </span>
        </Link>
        <img className="fortMark" src={images.fortGroup} alt={imageAlts.fortGroup} width={112} height={112} />
      </div>
    );
  }

  return (
    <Link className="brand" to="/">
      <img className="brandEmblem" src={images.emblem} alt={imageAlts.emblem} width={62} height={62} />
      <span className="brandText">
        <strong>{org.shortName}</strong>
        <small>INDEPENDENT CAMPAIGN GROUP FOR TRADESMEN, MARKETS &amp; PROFESSIONALS</small>
      </span>
    </Link>
  );
}
