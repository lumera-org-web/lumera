/**
 * Cloudinary asset URL and transformation helper.
 * Generates responsive, optimized Cloudinary URLs without heavy client runtime.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'vyrukryf';

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'limit';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  gravity?: 'auto' | 'face' | 'center';
}

/**
 * Builds a transformed Cloudinary URL.
 * Handles both public_id and raw URLs.
 */
export function getCloudinaryUrl(
  source: string | null | undefined,
  options: CloudinaryOptions = {}
): string {
  if (!source) return '';

  // If already a full URL
  if (source.startsWith('http://') || source.startsWith('https://')) {
    // If it's already a Cloudinary URL, we can inject transformations
    if (source.includes('res.cloudinary.com')) {
      const parts = source.split('/upload/');
      if (parts.length === 2) {
        const transforms: string[] = ['f_auto', 'q_auto'];
        if (options.width) transforms.push(`w_${options.width}`);
        if (options.height) transforms.push(`h_${options.height}`);
        if (options.crop) transforms.push(`c_${options.crop}`);
        if (options.gravity) transforms.push(`g_${options.gravity}`);
        return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
      }
    }
    return source;
  }

  // Treat as Cloudinary public_id
  const transforms: string[] = ['f_auto', 'q_auto'];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);

  const transformString = transforms.length > 0 ? `${transforms.join(',')}/` : '';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}${source}`;
}
