'use client';
import { useEffect } from 'react';
import { Header, Footer, ProjectCard } from './portfolio';
import { useLanguage } from './language';
import { projects } from '../lib/projects';
import { ProfilePhoto3D } from './profile-photo-3d';

export default function HomePage() {
  const { lang, t } = useLanguage();

  useEffect(() => {
    document.title = lang === 'ru' ? 'Руслан Мелкумян — дизайнер' : 'Ruslan Melkumyan — Designer';
  }, [lang]);

  return (
    <div className="site">
      <Header active="home" />
      <main>
        <section className="profile">
          <ProfilePhoto3D src="/media/ruslan.webp" alt={t('Руслан Мелкумян', 'Ruslan Melkumyan')} />
          <h1>{t('Руслан Мелкумян', 'Ruslan Melkumyan')}</h1>
          <p className="profile-role">{t('Многопрофильный дизайнер', 'Multidisciplinary designer')}</p>
          <p className="profile-location mono">{t('Москва, РФ', 'Moscow, Russia')}</p>
          <div className="profile-bio">
            <p>{t('Привет! Я Руслан, дизайнер, и я очень рад видеть вас здесь.', "Hi! I'm Ruslan, a designer. I'm very glad to see you here.")}</p>
            <p>{t('Я дизайнер в OMEGA EVENTS и студент третьего курса Школы дизайна НИУ ВШЭ, где изучаю дизайн и продвижение цифрового продукта.', "I'm a designer at OMEGA EVENTS and a third-year student at HSE Art and Design School, where I study Design and Digital Product Promotion.")}</p>
          </div>
          <div className="profile-skills mono">{t('UX/UI, брендинг, веб-дизайн, иллюстрация', 'UX/UI, branding, web design, illustration')}</div>
        </section>
        <section className="featured" id="projects">
          <div className="section-heading">
            <h2>{t('Проекты', 'Projects')} <span className="mono">{String(projects.length).padStart(2, '0')}</span></h2>
          </div>
          <div className="project-grid">
            {projects.map(p => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
