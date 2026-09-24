/** Image slot for a "För dig"-section. `alt` is required – never ship an empty one. */
export type SectionImage = {
  src: string;
  alt: string;
};

/**
 * Video slot. Must be muted-safe (no audio needed to understand it). `poster`
 * is a still of the final frame – shown until playback starts, and instead of
 * the video for anyone who prefers reduced motion.
 */
export type SectionVideo = {
  src: string;
  poster: string;
  alt: string;
};
