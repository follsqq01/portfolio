'use client';
// Ordinary document links support the static Vercel deployment.
/* oxlint-disable next/no-html-link-for-pages */
import { typography } from '../lib/typography';
import { ArrowUpRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { projects } from '../lib/projects';
import { useLanguage } from './language';
import { SoundToggle } from './sound-provider';
import { ProjectCover } from './project-cover';
import { EmailButton } from './email-button';

export function Header({ active = 'home' }: { active?: string }) {
  const { lang, setLang, t } = useLanguage();
  return (
    <header className="header">
      <nav aria-label={t('Основная навигация', 'Main navigation')}>
        <a href="/" aria-current={active === 'home' ? 'page' : undefined}>
          {t('Домой', 'Home')}
        </a>
        <a
          href="/about"
          aria-current={active === 'about' ? 'page' : undefined}
        >
          {t('Обо мне', 'About')}
        </a>
        <a
          href="https://t.me/huhuhuqq"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('Написать', 'Get in touch')}
        </a>
      </nav>
      <p className="nav-note">
        {t('Портфолио', 'Portfolio')}
        <br />
        {t('Руслана Мелкумяна', 'Ruslan Melkumyan')}
      </p>
      <div className="header-actions">
        <div
          className="language-switch"
          role="group"
          aria-label={t('Язык', 'Language')}
        >
          <button
            type="button"
            lang="ru"
            onClick={() => setLang('ru')}
            aria-pressed={lang === 'ru'}
          >
            RU
          </button>
          <span>/</span>
          <button
            type="button"
            lang="en"
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
        </div>
        <SoundToggle />
      </div>
    </header>
  );
}
export function Footer() {
  const { t } = useLanguage();
  return (
    <footer id="contacts">
      <div className="footer-links">
        <a
          href="https://t.me/huhuhuqq"
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram <ArrowUpRight />
        </a>
        <EmailButton />
      </div>
      <span className="mono">
        {t('Руслан Мелкумян', 'Ruslan Melkumyan')} © 2026
      </span>
    </footer>
  );
}
export function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="design-tags">
      {tags.map((tag) => (
        <span key={tag}>{typography(tag)}</span>
      ))}
    </div>
  );
}
export function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
  index?: number;
}) {
  const { lang } = useLanguage();
  const p = lang === 'en' ? project.en : project;
  return (
    <a
      href={`/projects/${project.slug}`}
      className="project-card"
      aria-label={`${p.title} — ${p.subtitle}`}

    >
      <div className="cover">
        <ProjectCover project={project} title={p.title} />
      </div>
      <div className="project-caption">
        <h2>{typography(p.title)}</h2>
        <div>
          <p>{project.year}</p>
          <p>{typography(p.subtitle)}</p>
        </div>
      </div>
      <Tags tags={p.tags} />
    </a>
  );
}
export function Back() {
  const { t } = useLanguage();
  return (
    <a
      className="back-link"
      href="/#projects"
    >
      <ArrowLeft size={14} /> {t('Все проекты', 'All projects')}
    </a>
  );
}
export { ArrowRight, ArrowUpRight };
