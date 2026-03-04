import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';
import type { SanityImage } from '@/types/sanity';

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImage) {
  return builder.image(source);
}

export function getSanityImageUrl(
  source: SanityImage,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}
) {
  let image = builder.image(source);

  if (options.width) image = image.width(options.width);
  if (options.height) image = image.height(options.height);
  if (options.quality) image = image.quality(options.quality);
  if (options.format) image = image.format(options.format);

  return image.fit('max').url();
}

export function getOptimizedImageUrl(
  source: SanityImage | undefined,
  width: number = 800
): string | undefined {
  if (!source) return undefined;
  return getSanityImageUrl(source, { width, quality: 80, format: 'webp' });
}
