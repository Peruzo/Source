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
  /** Widths of the 4:5 portrait crop used below `md`. Omit to use the landscape files everywhere. */
  portraitWidths?: number[];
  /** CSS object-position for the landscape files, e.g. `62% 45%`. */
  focus?: string;
  /** CSS object-position for the portrait files. */
  portraitFocus?: string;
};

export type ServiceCta = { label: string; href: string };

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
