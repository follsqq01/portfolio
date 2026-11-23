'use client';
import {useEffect} from 'react';
import {Header,Footer,ArrowUpRight} from './portfolio';
import {useLanguage} from './language';
import {AboutQuickFacts} from './about-quickfacts';
import {AboutMoodboard} from './about-moodboard';
import {AboutVideo} from './about-video';
import {ProfilePhoto3D} from './profile-photo-3d';

export default function AboutPage(){
  const {lang,t}=useLanguage();
  useEffect(()=>{document.title=lang==='ru'?'Руслан Мелкумян — дизайнер':'Ruslan Melkumyan — Designer';},[lang]);
  return <div className="site about-site"><Header active="about"/><main>
    <section className="profile about-intro">
      <ProfilePhoto3D src="/media/ruslan.webp" alt={t('Руслан Мелкумян','Ruslan Melkumyan')}/>
      <h1>{t('Руслан Мелкумян','Ruslan Melkumyan')}</h1>
      <p className="profile-role">{t('Многопрофильный дизайнер','Multidisciplinary designer')}</p>
      <p className="profile-location mono">{t('Москва, РФ','Moscow, Russia')}</p>
      <div className="profile-bio">
        <p>{t('Привет! Я Руслан, дизайнер. Мне интересно находить форму для сложных идей и превращать их в понятные визуальные системы.',"Hi! I'm Ruslan, a designer. I like finding a form for complex ideas and turning them into clear visual systems.")}</p>
        <p>{t('Я работаю с брендингом, цифровыми продуктами, веб-дизайном и генеративным контентом. Сейчас я дизайнер в OMEGA EVENTS и студент третьего курса Школы дизайна НИУ ВШЭ.',"I work across branding, digital products, web design and generative content. I'm currently a designer at OMEGA EVENTS and a third-year student at HSE Art and Design School.")}</p>
      </div>
      <div className="about-links"><a className="text-link" href="https://t.me/huhuhuqq" target="_blank" rel="noopener noreferrer">Telegram <ArrowUpRight size={14}/></a><span className="mono">UX/UI · BRANDING · WEB · ILLUSTRATION</span></div>
    </section>
    <AboutQuickFacts/>
    <AboutVideo/>
    <section className="about-narrative">
      <div className="about-narrative-head">
        <span className="mono">04 / STORY</span>
      </div>
      <div className="about-narrative-body">
        <div className="narrative-col">
          <h3 className="narrative-col-title">
            {t('Дизайнер в OMEGA EVENTS', 'Designer at OMEGA EVENTS')}
          </h3>
          <p className="narrative-col-text">
            {t(
              'Работаю дизайнером в OMEGA EVENTS: разрабатываю фирменный стиль для группы компаний и занимаюсь визуальным оформлением ивентов.',
              'I work as a designer at OMEGA EVENTS, developing the corporate identity for the group of companies and creating visual designs for events.'
            )}
          </p>
          <p className="narrative-col-text">
            {t(
              'Также работаю над фуд-кортом «БРИКЕТ МАРКЕТ», который находится в концептуальном универмаге «Цветной».',
              'I also work on BRIKET MARKET, the food court inside Tsvetnoy, a concept department store in Moscow.'
            )}
          </p>
        </div>

        <div className="narrative-col">
          <h3 className="narrative-col-title">
            {t('Школа дизайна ВШЭ & Менторство', 'HSE Design & Mentorship')}
          </h3>
          <p className="narrative-col-text">
            {t(
              'Учусь на третьем курсе Школы дизайна НИУ ВШЭ. Начинал на профиле «Дизайн и программирование», затем перешёл на «Дизайн и продвижение цифрового продукта», где учусь сейчас.',
              'I am a third-year student at HSE Art and Design School. I started in Design and Programming, then moved to Design and Digital Product Promotion, my current track.'
            )}
          </p>
          <p className="narrative-col-text">
            {t(
              'Я наставник крупнейшей образовательной программы — «Дизайн». Собираю команду менторов и вместе с ней помогаю первокурсникам адаптироваться к студенческой жизни.',
              'I am a mentor for Design, the largest degree programme. I bring together a team of mentors, and together we help first-year students settle into university life.'
            )}
          </p>
        </div>

      </div>
    </section>
    <section className="about-facts"><div className="mono">05 / NOTES</div><div className="facts-grid"><p>{t('Люблю визуальные исследования, социальные проекты и работать над ивентами!', 'I love visual research, social impact projects, and working on events!')}</p><p>{t('Призёр промтВыходных от Сбера, обучался на курсах ВТБ по продуктовому дизайну.', 'Award winner at Sber Prompt Weekend, completed VTB product design courses.')}</p><p>{t('Победитель HSE CREATIVE OPEN в номинации «Социально значимый цифровой продукт».', 'Winner of HSE CREATIVE OPEN in the “Socially Significant Digital Product” category.')}</p></div></section>
    <AboutMoodboard/>
  </main><Footer/></div>
}
