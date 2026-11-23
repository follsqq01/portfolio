import { OptimizedImage } from './optimized-image';
import type { Project } from '../lib/projects';
import './project-gallery.css';
export function ProjectCover({
  project,
  title,
}: {
  project: Project;
  title: string;
}) {
  const src = project.cover ? `/media/${project.cover}` : '';
  return src ? (
    <OptimizedImage sizes="(max-width: 360px) calc(100vw - 40px), (max-width: 650px) calc((100vw - 52px) / 2), 400px" src={src} alt={title} loading="lazy" />
  ) : (
    <div className="project-text-cover">{title}</div>
  );
}
