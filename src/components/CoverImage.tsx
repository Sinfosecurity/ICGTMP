import type { CSSProperties } from 'react';

type Props = {
  src: string;
  alt: string;
  objectPosition: string;
  objectPositionMobile?: string;
  className?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onError?: () => void;
};

export function CoverImage({
  src,
  alt,
  objectPosition,
  objectPositionMobile,
  className,
  srcSet,
  sizes,
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  onError,
}: Props) {
  const style = {
    '--photo-pos': objectPosition,
    '--photo-pos-mobile': objectPositionMobile ?? objectPosition,
  } as CSSProperties;

  return (
    <img
      className={['coverImage', className].filter(Boolean).join(' ')}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      style={style}
      onError={onError}
    />
  );
}
