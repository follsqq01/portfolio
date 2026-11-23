'use client';
import { typography } from '../lib/typography';
import { useEffect } from 'react';
import { Header, Footer, Back, ArrowRight, Tags } from './portfolio';
import { useLanguage } from './language';
import { projects } from '../lib/projects';
import { ProjectGallery } from './project-gallery';
import './project-gallery.css';
export default function CasePage({ index }: { index: number }) {
  const { lang, t } = useLanguage();
  const project = projects[index];
  const p = lang === 'en' ? project.en : project;
  const next = projects[(index + 1) % projects.length];
  useEffect(() => {
    document.title = `${p.title} — ${lang === 'ru' ? 'Руслан Мелкумян' : 'Ruslan Melkumyan'}`;
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = project.color;
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, [project.color, p.title, lang]);
  return (
    <div
      className={`case-surface${project.slug === 'young-kink' ? ' case-dark' : ''}`}
      style={{ backgroundColor: project.color }}
    >
      <div className="site detail-site">
        <Header active="work" />
        <main className="case-layout">
          <aside className="case-info">
            <Back />
            <h1>{typography(p.title)}</h1>
            <p className="case-subtitle">{typography(p.subtitle)}</p>
            <dl>
              <div>
                <dt>{t('Год', 'Year')}</dt>
                <dd>{project.year}</dd>
              </div>
              {project.role && (
                <div>
                  <dt>{t('Роль', 'Role')}</dt>
                  <dd>{project.role[lang]}</dd>
                </div>
              )}
              <div>
                <dt>{t('Направление', 'Discipline')}</dt>
                <dd>
                  <Tags tags={p.tags} />
                </dd>
              </div>
            </dl>
            <div className="case-description">
              {p.paragraphs.map((text, i) => (
                <p key={i}>{typography(text)}</p>
              ))}
            </div>
            {(project.slug === 'koreshki' || project.slug === 'vershki-i-koreshki') && (
              <a
                className="text-link"
                href="https://t.me/koreshkiq"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('Канал проекта', 'Project channel')} <ArrowRight size={14} />
              </a>
            )}
            {project.slug === 'weare' && (
              <a
                className="text-link"
                href="https://3d-gallerry.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('Открыть архив', 'Open archive')} <ArrowRight size={14} />
              </a>
            )}
            {(project.slug === 'koreshki' || project.slug === 'vershki-i-koreshki') && (
              <p className="credits">
                {t('Команда проекта:', 'Project team:')}
                <br />
                @aminochkasuperpuper @lisabact
              </p>
            )}
            {project.slug === 'biological-museum' && (
              <p className="credits">
                {t('Команда проекта:', 'Project team:')}
                <br />
                @sonchessssboo @wxllfwlr
                <br />
                @havzy @dansiaizlo
              </p>
            )}
            {project.slug === 'penta-q' && (
              <p className="credits">
                {t('Команда проекта:', 'Project team:')}
                <br />
                @lisabact @aminochkasuperpuper
                <br />
                @wxllfwlr @lidagenk @mminifrogg
              </p>
            )}
          </aside>
          <div className="case-gallery">
            {project.outcomes && (
              <dl className="case-outcomes" aria-label={t('Результаты фестиваля', 'Festival outcomes')}>
                {project.outcomes.map((outcome) => (
                  <div key={outcome.ru}>
                    <dt>{outcome[lang]}</dt>
                    <dd>{outcome.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <ProjectGallery key={project.slug} project={project} />
            {project.sections?.map((section) => (
              <section className="case-story" key={section.ru.title}>
                <h2>{typography(section[lang].title)}</h2>
                <p>{typography(section[lang].text)}</p>
              </section>
            ))}
            <a className="next-case" href={`/projects/${next.slug}`}>
              <span className="mono">
                {t('Следующий кейс', 'Next project')}
              </span>
              <span>
                {typography(lang === 'en' ? next.en.title : next.title)}
                <ArrowRight size={18} />
              </span>
            </a>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
