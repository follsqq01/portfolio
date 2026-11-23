'use client';
import { useLanguage } from './language';
import { ArrowUpRight } from 'lucide-react';
import { EmailButton } from './email-button';

export function AboutQuickFacts() {
  const { t } = useLanguage();

  const facts = [
    {
      id: 'availability',
      label: '01 / AVAILABILITY',
      titleRu: 'Формат & Занятость',
      titleEn: 'Format & Availability',
      valueRu: 'Проектная работа · Стажировка · Парттайм',
      valueEn: 'Project-based · Internship · Part-time',
      descRu: 'Москва (офис / гибрид) или удалённо. Готов подключаться к сложным запускам и айдентике, также рассматриваю проектную занятость.',
      descEn: 'Moscow (on-site / hybrid) or remote. Ready to step in for ambitious branding & digital launches, also open to project-based work.',
    },
    {
      id: 'stack',
      label: '02 / TOOLS & STACK',
      titleRu: 'Стек инструментов',
      titleEn: 'Tools & Stack',
      valueRu: 'Figma · Readymag · Tilda · After Effects · Illustrator · Photoshop',
      valueEn: 'Figma · Readymag · Tilda · After Effects · Illustrator · Photoshop',
      descRu: 'Код: HTML · CSS · JavaScript · React. Создаю сайты, анимацию и визуальные системы — от макета до реализации.',
      descEn: 'Code: HTML · CSS · JavaScript · React. I build websites, motion graphics and visual systems, from design to implementation.',
    },
    {
      id: 'languages',
      label: '03 / LANGUAGES',
      titleRu: 'Языки общения',
      titleEn: 'Languages',
      valueRu: 'Русский (Родной) · English (B2 / Upper-Intermediate)',
      valueEn: 'Russian (Native) · English (B2 / Upper-Intermediate)',
      descRu: 'Свободно веду рабочую переписку, читаю документацию и участвую в созвонах без языкового барьера.',
      descEn: 'Fluent written communication, technical reading and active participation in team calls.',
    },
  ];

  return (
    <section className="about-quickfacts">
      <div className="quickfacts-head">
        <div className="quickfacts-title-wrap">
          <span className="mono">02 / QUICK FACTS</span>
          <h2>{t('Сводка для рекрутеров & команд', 'Recruiter Overview & Specs')}</h2>
        </div>
        <div className="quickfacts-status-pill mono">
          <span className="status-live-dot" />
          <span>{t('ОТКРЫТ К ПРЕДЛОЖЕНИЯМ', 'OPEN FOR OFFERS')}</span>
        </div>
      </div>

      <div className="quickfacts-table">
        {facts.map((fact) => (
          <div key={fact.id} className="quickfacts-row">
            <div className="quickfacts-row-label">
              <span className="fact-label-title">{t(fact.titleRu, fact.titleEn)}</span>
            </div>

            <div className="quickfacts-row-content">
              <div className="fact-value-row">
                <p className="fact-value">{t(fact.valueRu, fact.valueEn)}</p>
              </div>
              <p className="fact-desc">{t(fact.descRu, fact.descEn)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quickfacts-footer">
        <div className="quickfacts-actions">
          <a
            href="https://t.me/huhuhuqq"
            target="_blank"
            rel="noopener noreferrer"
            className="quickfacts-btn quickfacts-btn-primary"
          >
            <span>{t('Написать в Telegram', 'Message on Telegram')}</span>
            <ArrowUpRight size={13} />
          </a>
          <EmailButton className="quickfacts-btn" />
        </div>
        <span className="mono quickfacts-note">
          {t('МОСКВА · НИУ ВШЭ / 2026', 'MOSCOW · HSE DESIGN / 2026')}
        </span>
      </div>
    </section>
  );
}
