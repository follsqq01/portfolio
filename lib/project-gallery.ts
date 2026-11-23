import type { Project } from './projects';

export interface GalleryItem {
  id: string;
  src: string;
  type: 'image' | 'video' | 'embed';
  width?: number;
  height?: number;
}
export interface GalleryData {
  items: GalleryItem[];
  revision: number;
}
export function initialGallery(project: Project): GalleryData {
  return {
    revision: 0,
    items: project.images.map((src, index) => {
      const isEmbed = src.includes('kinescope.io') || src.startsWith('http://') || src.startsWith('https://');
      const isVideo = src.endsWith('.mp4');
      return {
        id: `original-${index}`,
        src: isEmbed ? src : `/media/${src}`,
        type: isEmbed ? 'embed' : isVideo ? 'video' : 'image',
        width: project.sizes[src]?.[0] ?? (isEmbed ? 1920 : undefined),
        height: project.sizes[src]?.[1] ?? (isEmbed ? 1080 : undefined),
      };
    }),
  };
}
