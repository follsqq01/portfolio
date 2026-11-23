'use client';
import { LazyVideo } from './lazy-video';
import { useEffect } from 'react';
import { Header, Footer, ProjectCard } from './portfolio';
import { useLanguage } from './language';
import { projects } from '../lib/projects';
export default function ProjectsHome() {
  const { lang, t } = useLanguage();
  useEffect(() => {
    document.title =
      lang === 'ru'
        ? 'Проекты — Руслан Мелкумян'
        : 'Projects — Ruslan Melkumyan';
  }, [lang]);
  return (
    <div className="site projects-site">
      <Header active="projects" />
      <main>
        <section className="projects-hero">
          <div>
            <span className="mono">RUSLAN MELKUMYAN / 2026</span>
            <h1>{t('Избранные проекты', 'Selected projects')}</h1>
            <p>
              {t(
                'Брендинг, цифровые продукты и визуальные истории.',
                'Branding, digital products and visual stories.',
              )}
            </p>
          </div>
          <div className="hero-video-window">
            <LazyVideo
              src="/media/preview-wallap.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label={t('Видео-превью проектов', 'Project preview video')}
            />
            <span className="mono">PLAY / LOOP</span>
          </div>
        </section>
        <section className="featured" id="projects">
          <div className="section-heading">
            <h2>
              {t('Все проекты', 'All projects')}{' '}
              <span className="mono">
                {String(projects.length).padStart(2, '0')}
              </span>
            </h2>
          </div>
          <div className="project-grid">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
