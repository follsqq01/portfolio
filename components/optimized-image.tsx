import type { ImgHTMLAttributes } from 'react';
import mediaManifest from '../lib/media-manifest.json';

type Media = { width: number; height: number; variants: { src: string; width: number }[]; poster?: string };
export const optimizedMedia = mediaManifest as Record<string, Media>;

export function OptimizedImage({ src, sizes = '(max-width: 650px) calc(100vw - 40px), (max-width: 950px) 55vw, 800px', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const media = typeof src === 'string' ? optimizedMedia[src] : undefined;
  return <img decoding="async" {...props} src={media?.variants.at(-1)?.src ?? src}
    width={props.width ?? media?.width} height={props.height ?? media?.height}
    srcSet={media?.variants.map(v => `${v.src} ${v.width}w`).join(', ')} sizes={media ? sizes : undefined} />;
}
