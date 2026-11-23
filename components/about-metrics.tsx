'use client';
import { useLanguage } from './language';

export function AboutMetrics() {
  const { t } = useLanguage();

  const metrics = [
    {
      num: '03',
      suffix: '',
      titleRu: 'Года практики',
      titleEn: 'Years of Practice',
      descRu: 'Осознанный опыт в брендинге, мультимедиа и цифровых продуктах.',
      descEn: 'Commercial experience across branding, multimedia and digital products.',
      tag: 'EXPERIENCE',
    },
    {
      num: '15',
      suffix: '+',
      titleRu: 'Ивентов и систем',
      titleEn: 'Events & Systems',
      descRu: 'Сценография, экраны и визуальные системы в OMEGA EVENTS.',
      descEn: 'Scenography, stage motion and identity systems at OMEGA EVENTS.',
      tag: 'OMEGA EVENTS',
    },
    {
      num: '30',
      suffix: '+',
      titleRu: 'Студентов ВШЭ',
      titleEn: 'HSE Mentees',
      descRu: 'Первокурсников под моим кураторством в Школе дизайна НИУ ВШЭ.',
      descEn: 'First-year design students mentored at HSE Art & Design School.',
      tag: 'MENTORSHIP',
    },
    {
      num: '100',
      suffix: '%',
      titleRu: 'Точность дедлайнов',
      titleEn: 'On-Time Delivery',
      descRu: 'Ивенты не прощают задержек. Ни одного сорванного запуска.',
      descEn: 'Event dates cannot move. Zero missed deadlines or delayed launches.',
      tag: 'DISCIPLINE',
    },
  ];

  return (
    <section className="about-metrics">
      <div className="about-metrics-head">
        <div className="about-metrics-title-wrap">
          <span className="mono">07 / METRICS</span>
          <h2>{t('Масштаб в цифрах', 'Impact & Scale in Numbers')}</h2>
        </div>
        <span className="mono about-metrics-sub">
          {t('ОПЫТ, ДИСЦИПЛИНА И СОФТ-СКИЛЛЫ', 'TRACK RECORD, DISCIPLINE & SOFT SKILLS')}
        </span>
      </div>

      <div className="about-metrics-grid">
        {metrics.map((item) => (
          <div key={item.num + item.suffix} className="metric-card">
            <div className="metric-card-body">
              <div className="metric-number-wrap">
                <span className="metric-number">{item.num}</span>
                {item.suffix && <span className="metric-suffix">{item.suffix}</span>}
              </div>
              <h3 className="metric-title">{t(item.titleRu, item.titleEn)}</h3>
              <p className="metric-desc">{t(item.descRu, item.descEn)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
