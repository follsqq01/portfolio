'use client';

import { LazyEmbed } from './lazy-embed';
import { LazyVideo } from './lazy-video';
import { OptimizedImage } from './optimized-image';
import { useLanguage } from './language';
import { initialGallery } from '../lib/project-gallery';
import type { Project } from '../lib/projects';

export function ProjectGallery({ project }: { project: Project }) {
  const { lang, t } = useLanguage();
  const title = lang === 'ru' ? project.title : project.en.title;
  const items = initialGallery(project).items;

  return (
    <>
      {items.map((item, index) => (
        <figure key={item.id}>
          {item.type === 'embed' ? (
            <LazyEmbed
              loading="lazy"
              src={item.src}
              title={`${title} — ${t('видео', 'video')} ${index + 1}`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
              allowFullScreen
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                display: 'block',
                border: 0,
              }}
            />
          ) : item.type === 'video' ? (
            <LazyVideo
              src={item.src}
              autoPlay
              loop
              muted
              playsInline
              aria-label={`${title} — ${t('видео', 'video')} ${index + 1}`}
            />
          ) : (
            <OptimizedImage
              src={item.src}
              width={item.width}
              height={item.height}
              alt={`${title} — ${t('изображение', 'image')} ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          )}
        </figure>
      ))}
    </>
  );
}
