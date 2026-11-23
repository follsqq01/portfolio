'use client';
import { OptimizedImage } from './optimized-image';
import { useLanguage } from './language';
import { ArrowUpRight } from 'lucide-react';

export function AboutNow() {
  const { lang, t } = useLanguage();

  const cards = [
    {
      category: '01 / SOUND',
      title: 'Olivia Rodrigo',
      subtitle: 'stupid song (GUTS, 2024)',
      description: t(
        'Текущий любимый трек на репите. Заряжает энергией во время быстрой сборки прототипов и сеток.',
        'Current favorite track on repeat. Keeps the energy high during fast prototyping and grid layouts.'
      ),
      image: '/media/music/olivia-rodrigo.svg',
      link: 'https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG',
      linkLabel: 'Spotify',
    },
    {
      category: '02 / READ',
      title: t('Йозеф Мюллер-Брокманн', 'Josef Müller-Brockmann'),
      subtitle: t('Модульные системы в графическом дизайне', 'Grid Systems in Graphic Design'),
      description: t(
        'Фундамент швейцарской типографики. Возвращаюсь к нему, когда нужно навести дисциплину в хаосе.',
        'The foundation of Swiss typography. Returning to it whenever order is needed in chaos.'
      ),
      image: '/media/now/book-grid.svg',
      link: 'https://en.wikipedia.org/wiki/Josef_M%C3%BCller-Brockmann',
      linkLabel: t('О книге', 'About book'),
    },
    {
      category: '03 / VISUAL',
      title: 'Bureau Borsche',
      subtitle: t('Мюнхен, Германия', 'Munich, Germany'),
      description: t(
        'Студия месяца. Восхищает их дерзость: как они ломают правила академической верстки, сохраняя премиальность.',
        'Studio of the month. Love their boldness: breaking academic layout rules while preserving premium feel.'
      ),
      image: '/media/now/bureau-borsche.svg',
      link: 'https://bureauborsche.com',
      linkLabel: 'bureauborsche.com',
    },
    {
      category: '04 / TOOL OF THE MONTH',
      title: 'TouchDesigner & ComfyUI',
      subtitle: t('Нодовые визуальные системы', 'Node-based visual systems'),
      description: t(
        'Исследую генеративные пайплайны и реалтайм-анимацию для интеграции в ивенты OMEGA EVENTS.',
        'Exploring generative node pipelines and realtime motion for integration into OMEGA EVENTS.'
      ),
      image: '/media/now/touchdesigner.svg',
      link: 'https://derivative.ca',
      linkLabel: 'TouchDesigner',
    },
  ];

  return (
    <section className="about-now">
      <div className="about-now-head">
        <div className="about-now-title-wrap">
          <span className="mono">06 / NOW</span>
          <h2>{t('На репите & Культурный код', 'On Repeat & Influences')}</h2>
        </div>
        <p className="mono about-now-subtitle">
          {t('ТО, ЧТО ПИТАЕТ МОЮ ПРАКТИКУ ПРЯМО СЕЙЧАС', 'WHAT FUELS MY PRACTICE RIGHT NOW')}
        </p>
      </div>

      <div className="about-now-grid">
        {cards.map((card) => (
          <article key={card.category} className="now-card">
            <div className="now-card-media">
              <OptimizedImage sizes="240px" src={card.image} alt={card.title} loading="lazy" />
              <span className="now-card-tag mono">{card.category}</span>
            </div>

            <div className="now-card-content">
              <div className="now-card-header">
                <h3 className="now-card-title">{card.title}</h3>
                <span className="now-card-sub mono">{card.subtitle}</span>
              </div>
              <p className="now-card-desc">{card.description}</p>
              {card.link && (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="now-card-link mono"
                >
                  <span>{card.linkLabel}</span>
                  <ArrowUpRight size={11} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
