import type { ComponentType, ReactNode } from 'react';

/**
 * A photo produced by scripts/tjanster-bilder.mjs. The files are named
 * `${base}-${width}.webp` (and `${base}-portrait-${width}.webp` when
 * `portraitWidths` is set), so the widths here must match what the script
 * wrote – next.config has `images.unoptimized`, nothing is resized on request.
 */
export type ServiceImage = {
  /** Path without width and extension, e.g. `/tjanster/inventarier/inventarier-hero`. */
  base: string;
  /** Required. Describe what the photo shows, not what the section says. */
  alt: string;
  /** Widths of the landscape (or fixed-crop) files, ascending. */
  widths: number[];
  /** Widths of the portrait crop used below `md` (4:5 unless the image script says otherwise). Omit to use the landscape files everywhere. */
  portraitWidths?: number[];
  /** CSS object-position for the landscape files, e.g. `62% 45%`. */
  focus?: string;
  /** CSS object-position for the portrait files. */
  portraitFocus?: string;
};

export type ServiceCta = { label: string; href: string };

/**
 * A point, in percent: x from the left, y from the top – of the photo box by
 * default, or of the photo itself with ServiceFullBleedCard.anchorTo 'image'.
 */
export type CardAnchor = { x: number; y: number };

/**
 * A small live UI card floating over a ServiceFullBleed photo, anchored to what
 * the photo shows (hands, a device, a work surface) – not to the section.
 * Keep it to one figure, one button and at most one row.
 */
export type ServiceFullBleedCard = {
  /** The card itself: real React, never an image of UI. */
  content: ReactNode;
  /** Accessible name for the card, e.g. "Exempel: en betald betalningslänk". */
  label: string;
  /** Centre of the card from `md` up, in percent of the photo box (the whole section from `lg`), or of the photo with anchorTo 'image'. */
  anchor: CardAnchor;
  /** Centre of the card on the portrait crop below `md`. Defaults to `anchor`. */
  anchorPortrait?: CardAnchor;
  /**
   * What the anchor is measured against. 'section' (default): the photo box, with
   * the card outside the parallax layer. 'image': the photo itself – the card is
   * placed in a box cropped exactly like the photo's object-fit: cover, drifts
   * with the parallax, and stays on the motif at every window proportion.
   */
  anchorTo?: 'section' | 'image';
};

export type FeatureItem = {
  /** A Heroicons outline icon (or any component taking className). */
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

/**
 * One step of StickySteps. `visual` is rendered over the photo; `active` turns
 * true when the visitor reaches the step (always true in the static layout),
 * so a widget can animate its change exactly once, on arrival.
 */
export type ServiceStep = {
  title: string;
  body: string;
  visual: (state: { active: boolean }) => ReactNode;
};
