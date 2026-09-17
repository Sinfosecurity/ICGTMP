import { imageAlts, images } from '../data/images';
import { org } from '../data/content';

type Props = {
  variant?: 'header' | 'footer';
};

export function Brand({ variant = 'header' }: Props) {
  if (variant === 'footer') {
    return (
      <a className="brand brandFooter" href="#home">
        <span className="brandLogoPlate">
          <img src={images.logo} alt={imageAlts.logo} width={148} height={154} />
        </span>
      </a>
    );
  }

  return (
    <a className="brand" href="#home">
      <img className="brandEmblem" src={images.emblem} alt={imageAlts.emblem} width={62} height={62} />
      <span className="brandText">
        <strong>{org.shortName}</strong>
        <small>INDEPENDENT CAMPAIGN GROUP FOR TRADESMEN, MARKETS &amp; PROFESSIONALS</small>
      </span>
    </a>
  );
}
