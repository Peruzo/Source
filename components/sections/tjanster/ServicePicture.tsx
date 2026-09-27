import type { CSSProperties } from 'react';
import type { ServiceImage } from './types';

type ServicePictureProps = {
  image: ServiceImage;
  /** `sizes` for the landscape files. */
  sizes: string;
  /** `sizes` for the portrait files (below md). */
  portraitSizes?: string;
  /** Above-the-fold: load eagerly with high priority. */
  priority?: boolean;
  className?: string;
};

const srcSet = (base: string, widths: number[]) =>
  widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');

/**
 * Art-directed photo for the service pages: a 4:5 portrait crop below `md`,
 * the landscape frame from `md` up, each with its own srcset and focus point.
 *
 * A plain <picture> instead of next/image: with `images.unoptimized` next/image
 * renders a single `src` and no srcset, so every visitor would get the largest
 * file. The <img> fills its parent (absolute inset-0), so the parent sets the
 * size and position.
 */
export function ServicePicture({
  image,
  sizes,
  portraitSizes = '100vw',
  priority = false,
  className = '',
}: ServicePictureProps) {
  const largest = image.widths[image.widths.length - 1];
  const style = {
    '--focus': image.focus ?? '50% 50%',
    '--focus-portrait': image.portraitFocus ?? image.focus ?? '50% 50%',
  } as CSSProperties;

  return (
    <picture>
      {image.portraitWidths?.length ? (
        <source
          media="(max-width: 767px)"
          srcSet={srcSet(`${image.base}-portrait`, image.portraitWidths)}
          sizes={portraitSizes}
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${image.base}-${largest}.webp`}
        srcSet={srcSet(image.base, image.widths)}
        sizes={sizes}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={style}
        className={`absolute inset-0 h-full w-full object-cover object-[var(--focus-portrait)] md:object-[var(--focus)] ${className}`}
      />
    </picture>
  );
}
