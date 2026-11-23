export interface Project {
  slug: string; title: string; subtitle: string; tags: string[]; cover: string;
  year: string; paragraphs: string[]; images: string[]; sizes: Record<string, number[]>;
  en: { title: string; subtitle: string; tags: string[]; paragraphs: string[] };
  color: string;
  hidden?: boolean;
  role?: { ru: string; en: string };
  outcomes?: { value: string; ru: string; en: string }[];
  sections?: { ru: { title: string; text: string }; en: { title: string; text: string } }[];
}
export const allProjects: Project[] = [
  {
    "slug": "young-kink",
    "title": "YOUNG KINK",
    "subtitle": "Ювелирный магазин",
    "tags": [
      "E-commerce",
      "Айдентика"
    ],
    "cover": "project-img-1.webp",
    "year": "2025",
    "paragraphs": [
      "YOUNG KINK — это бренд молодежных украшений для тех, кто ценит стиль и современную подачу. Бренд создает минималистичные аксессуары из серебра, но с духом свободы, панка и самовыражения, адаптированные под широкую аудиторию."
    ],
    "images": [
      "project-img-1.webp",
      "bag_YoungKink.webp",
      "scarf_YoungKink.webp",
      "card_YoungKink.webp",
      "box_YoungKink.webp",
      "ipad_YoungKink.webp",
      "shoppage_YoungKink.webp",
      "videoPreview.mp4",
      "posts_YoungKink.mp4",
      "motion-badje.mp4"
    ],
    "sizes": {
      "project-img-1.webp": [
        2879,
        1904
      ],
      "bag_YoungKink.webp": [
        2861,
        2147
      ],
      "scarf_YoungKink.webp": [
        967,
        718
      ],
      "card_YoungKink.webp": [
        1218,
        1027
      ],
      "box_YoungKink.webp": [
        2124,
        1594
      ],
      "ipad_YoungKink.webp": [
        2861,
        2147
      ],
      "shoppage_YoungKink.webp": [
        2861,
        2147
      ]
    },
    "en": {
      "title": "YOUNG KINK",
      "subtitle": "Jewelry store",
      "tags": [
        "E-commerce",
        "Identity"
      ],
      "paragraphs": [
        "YOUNG KINK is a brand of youth jewelry for those who value style and modern presentation. The brand creates minimalist accessories from silver, but with the spirit of freedom, punk and self-expression, adapted to a wide audience."
      ]
    },
    "color": "#000000"
  },
  {
    "slug": "koreshki",
    "title": "@КОРЕШКИ",
    "subtitle": "Аудиосказки от бабушек и дедушек",
    "tags": [
      "Айдентика",
      "Продукт",
      "Мерч"
    ],
    "cover": "koreshki/8.webp",
    "year": "2026",
    "paragraphs": [
      "Сервис аудиосказок, в основе которого — живые голоса и личности пожилых рассказчиков. Проект помогает обратить внимание на старшее поколение и его жизненный опыт через сказки, истории и личные воспоминания. Айдентика построена на системе кругов, напоминающей мозаичную вышивку: отдельные элементы складываются в цельный образ или характерные паттерны — так же, как истории разных людей формируют общую память.",
      "Для проекта разработано мобильное приложение, где можно познакомиться с рассказчиками, послушать аудиосказки, прочитать добрые истории и хорошие новости со всей страны. Проект продолжает развиваться вместе с X5 Group, «Московским долголетием» и проектом Софьи Эрнст, расширяя сообщество и форматы взаимодействия со старшим поколением."
    ],
    "images": [
      "koreshki/0623.mp4",
      "koreshki/2.webp",
      "koreshki/2-1.webp",
      "koreshki/3.webp",
      "koreshki/4.webp",
      "koreshki/5.webp",
      "koreshki/6.webp",
      "koreshki/0623(1).mp4",
      "koreshki/8.webp",
      "koreshki/9.webp",
      "koreshki/10.webp",
      "koreshki/11.webp",
      "koreshki/12.webp"
    ],
    "sizes": {
      "koreshki/0623.mp4": [
        2178,
        1080
      ],
      "koreshki/2.webp": [
        1920,
        1080
      ],
      "koreshki/2-1.webp": [
        1922,
        1080
      ],
      "koreshki/3.webp": [
        1922,
        1080
      ],
      "koreshki/4.webp": [
        1922,
        1080
      ],
      "koreshki/5.webp": [
        1922,
        1081
      ],
      "koreshki/6.webp": [
        1922,
        1080
      ],
      "koreshki/0623(1).mp4": [
        2038,
        1080
      ],
      "koreshki/8.webp": [
        1922,
        1080
      ],
      "koreshki/9.webp": [
        1922,
        1080
      ],
      "koreshki/10.webp": [
        1922,
        1080
      ],
      "koreshki/11.webp": [
        1922,
        1080
      ],
      "koreshki/12.webp": [
        1922,
        1080
      ]
    },
    "en": {
      "title": "@KORESHKI",
      "subtitle": "Audio fairy tales from grandparents",
      "tags": [
        "Identity",
        "Product Design",
        "Merch"
      ],
      "paragraphs": [
        "An audio storytelling service built around the real voices and personalities of older storytellers. The project draws attention to the older generation and their life experiences through fairy tales, personal stories, and memories. The visual identity is based on a system of circles inspired by mosaic embroidery: individual elements come together to form complete images and distinctive patterns, just as different people’s stories come together to shape a shared memory.",
        "The project includes a mobile app where users can meet the storytellers, listen to audio tales, and discover heartwarming stories and positive news from across the country. The project continues to grow in collaboration with X5 Group, Moscow Longevity, and Sofia Ernst’s project, expanding its community and creating new ways to engage with the older generation."
      ]
    },
    "color": "#FFFEFD"
  },
  {
    slug: 'vershki-i-koreshki',
    title: 'ВЕРШКИ И КОРЕШКИ',
    subtitle: 'Фестиваль поколений',
    tags: ['Дизайн события', 'Организация'],
    cover: 'festival-koreshki/festival-poster.webp',
    year: '2026',
    color: '#FFFEFD',
    role: { ru: 'Дизайнер и соорганизатор', en: 'Designer & co-organizer' },
    paragraphs: [
      'Фестиваль, который объединил бабушек, дедушек и зумеров через творчество, разговоры и музыку. Вместе с Елизаветой Раковой и Аминой Азизовой я превратил социальный проект «Корешки» в городское событие: 21 августа в «Сфере X5» в Парке Горького мы собрали более 600 гостей.',
      'Я отвечал за дизайн фестиваля и всех информационных носителей, участвовал в разработке концепции и программы, подготовке и проведении события. Совместил работу дизайнера с ролью соорганизатора и ивент-менеджера — от первых анонсов до реализации программы на площадке.'
    ],
    images: [
      'https://kinescope.io/embed/2hVFgx26GDrrzsZVy78szZ',
      'festival-koreshki/festival-poster.webp',
      'festival-koreshki/stage.webp',
      'festival-koreshki/festival-guests.webp',
      'festival-koreshki/festival-loop.mp4',
      'festival-koreshki/story-tent.webp',
      'festival-koreshki/workshop-crowd.webp',
      'festival-koreshki/chess-station.webp',
      'festival-koreshki/event-packaging.webp',
      'festival-koreshki/panel-guests.webp',
      'festival-koreshki/craft-workshop.webp',
      'festival-koreshki/panel-stage.webp',
    ],
    sizes: {
      'festival-koreshki/festival-poster.webp': [1440, 960],
      'festival-koreshki/stage.webp': [1440, 1080],
      'festival-koreshki/festival-guests.webp': [1440, 960],
      'festival-koreshki/story-tent.webp': [1440, 1080],
      'festival-koreshki/workshop-crowd.webp': [1440, 960],
      'festival-koreshki/chess-station.webp': [1440, 960],
      'festival-koreshki/event-packaging.webp': [1440, 1080],
      'festival-koreshki/panel-guests.webp': [1440, 960],
      'festival-koreshki/craft-workshop.webp': [960, 1440],
      'festival-koreshki/panel-stage.webp': [1440, 1080],
      'festival-koreshki/festival-loop.mp4': [1280, 720],
    },
    outcomes: [
      { value: '600+', ru: 'гостей фестиваля', en: 'festival visitors' },
      { value: '11', ru: 'часов программы', en: 'hours of programming' },
      { value: '11', ru: 'записанных аудиосказок', en: 'audio stories recorded' },
      { value: '80+', ru: 'открыток создали участники', en: 'cards made by visitors' }
    ],
    sections: [
      {
        ru: { title: 'Дизайн фестиваля', text: 'Разработал визуальное оформление и дизайн всех информационных носителей фестиваля. Объединил анонсы, промоматериалы и коммуникацию на площадке в единую систему, которая помогала знакомить гостей с проектом и его программой.' },
        en: { title: 'Festival design', text: 'Designed the festival’s visual communication and all informational materials. Brought announcements, promotional assets and on-site communication together into a consistent system that introduced visitors to the project and its programme.' }
      },
      {
        ru: { title: 'Организация и программа', text: 'Вместе с командой разработал и реализовал 11-часовую программу: от марафона вязания и записи семейных сказок до обсуждения мемов и грэндма-рейва. Фестиваль прошёл при участии Школы дизайна НИУ ВШЭ, «Сферы X5», «Московского долголетия» и «Яндекс Алисы». К программе присоединились три блогера старшего поколения.' },
        en: { title: 'Organization & programme', text: 'Co-developed and delivered an 11-hour programme, from a knitting marathon and family storytelling sessions to discussions of memes and a grandma rave. The festival involved the HSE Art and Design School, Sphere X5, Moscow Longevity and Yandex Alice, alongside three older-generation bloggers.' }
      },
      {
        ru: { title: 'Фестиваль в репортаже НТВ', text: 'НТВ снял репортаж о фестивале: съёмочная группа побывала на площадке и рассказала об участниках и идее объединения поколений. Студенческий проект получил освещение на федеральном телеканале. О событии также написали «Москвич Mag», «ВЕДы» и «Горбилет».' },
        en: { title: 'Featured on NTV', text: 'NTV filmed a report at the festival, covering its visitors and the idea of bringing generations together. The student-led project received national television coverage, with additional features in Moskvich Mag, VEDy and Gorbilet.' }
      }
    ],
    en: {
      title: 'VERSHKI I KORESHKI',
      subtitle: 'An intergenerational festival',
      tags: ['Event Design', 'Event Management'],
      paragraphs: [
        'A festival bringing grandparents and Gen Z together through creativity, conversation and music. Together with Elizaveta Rakova and Amina Azizova, I turned the Koreshki social project into a city event: on August 21, we welcomed over 600 visitors to Sphere X5 in Gorky Park.',
        'I was responsible for the festival’s design and all informational materials, and contributed to its concept, programme, preparation and delivery. My role combined design, co-organization and event management, from the first announcements to delivering the programme on site.'
      ]
    }
  },
  {
    "slug": "weare",
    "title": "WeAre",
    "subtitle": "Архив историй",
    "tags": [
      "3D & Веб",
      "Исследование"
    ],
    "cover": "weare_preview.webp",
    "year": "2026",
    "paragraphs": [
      "Я разрабатывал цифровой архив, посвящённый пяти стадиям принятия горя, исследуя, как по-разному люди проживают отрицание, гнев, торг, депрессию и принятие. Принято считать, что принятие — это финальная точка процесса, однако в реальном опыте эти состояния редко существуют последовательно: они пересекаются, возвращаются и для каждого складываются в собственный путь.",
      "В ходе исследования я собрал 32 анонимные истории людей, которых объединяли переживание горя и желание рассказать о нём честно, открыто и без осуждения. Эти истории стали основой проекта WeAre — интерактивного пространства для визуализации и рефлексии эмоционального опыта.",
      "Вместо классического архива я создал иммерсивную 3D-среду, в которой интервью существуют как части единого пространства памяти. Пользователь может перемещаться между историями, находить схожие переживания и видеть, насколько по-разному люди проходят через одни и те же эмоциональные состояния. Для меня было важно не объяснять человеку, как «правильно» переживать горе, а создать пространство, в котором разные способы его проживания могут существовать рядом."
    ],
    "images": [
      "WeAre/preview_video.webp",
      "WeAre/1.webp",
      "WeAre/2.webp",
      "WeAre/3.mp4",
      "WeAre/4.mp4",
      "WeAre/5.mp4",
      "WeAre/6.webp",
      "WeAre/Frame.webp",
      "WeAre/ef9ee2b458e349568880649529486bc11800x671.webp"
    ],
    "sizes": {
      "WeAre/preview_video.webp": [
        1916,
        1080
      ],
      "WeAre/1.webp": [
        1920,
        1080
      ],
      "WeAre/2.webp": [
        1800,
        1188
      ],
      "WeAre/6.webp": [
        1322,
        720
      ],
      "WeAre/Frame.webp": [
        1920,
        1080
      ],
      "WeAre/ef9ee2b458e349568880649529486bc11800x671.webp": [
        1800,
        671
      ]
    },
    "en": {
      "title": "WeAre",
      "subtitle": "An archive of stories",
      "tags": [
        "3D & Web",
        "Research"
      ],
      "paragraphs": [
        "I developed a digital archive exploring the five stages of grief, focusing on how differently people experience denial, anger, bargaining, depression, and acceptance. Acceptance is often perceived as the final point of the process, yet real experiences are rarely that linear: emotional states overlap, return, and form a different path for each person.",
        "As part of the research, I collected 32 anonymous personal stories from people united by grief and the need to speak about it honestly, openly, and without judgement. These stories became the foundation of WeAre — an interactive space for visualising and reflecting on emotional experience.",
        "Rather than creating a conventional archive, I designed an immersive 3D environment where interviews exist as parts of a shared space of memory. Visitors can move between stories, discover similar experiences, and see how differently people navigate the same emotional states. The project does not attempt to define a “right” way to experience grief, but creates a space where different experiences can coexist."
      ]
    },
    "color": "#e1e6e9"
  },
  {
    "slug": "biological-museum",
    "title": "Биологический музей",
    "subtitle": "Конкурс и брендинг",
    "tags": [
      "Мерч",
      "Айдентика",
      "Геймификация"
    ],
    "cover": "chex_preview.webp",
    "year": "2026",
    "paragraphs": [
      "Нашей задачей в рамках Дизайн-цеха — крупнейшего креатона для дизайнеров — было разработать мерч для Государственного биологического музея им. К. А. Тимирязева и Биокластера, который стал бы продолжением музейного опыта, а не просто сувениром.",
      "Мы исследовали пользовательский опыт в музеях, механики геймификации и визуальную ностальгию. Так появилась концепция «По пути исследователя»: посетитель становится исследователем-скаутом, изучает экспозиции, проходит собственный маршрут и собирает достижения.",
      "Эта идея легла в основу визуальной системы, вдохновлённой скаутскими значками, картами и наборами исследователя."
    ],
    "images": [
      "cheh/0708.mp4",
      "cheh/4.webp",
      "cheh/05.webp",
      "cheh/07.webp",
      "cheh/09.webp",
      "cheh/10.webp",
      "cheh/11.webp",
      "cheh/12.webp",
      "cheh/13.webp",
      "cheh/14.webp",
      "cheh/15.webp",
      "cheh/16.webp",
      "cheh/20.webp",
      "cheh/21.webp",
      "cheh/22.webp"
    ],
    "sizes": {
      "cheh/4.webp": [
        1942,
        1080
      ],
      "cheh/05.webp": [
        1920,
        1080
      ],
      "cheh/07.webp": [
        1920,
        1080
      ],
      "cheh/09.webp": [
        1920,
        1080
      ],
      "cheh/10.webp": [
        1920,
        1080
      ],
      "cheh/11.webp": [
        1920,
        1080
      ],
      "cheh/12.webp": [
        1920,
        1080
      ],
      "cheh/13.webp": [
        1920,
        1080
      ],
      "cheh/14.webp": [
        1920,
        1080
      ],
      "cheh/15.webp": [
        1920,
        1080
      ],
      "cheh/16.webp": [
        1920,
        1080
      ],
      "cheh/20.webp": [
        1920,
        1080
      ],
      "cheh/21.webp": [
        1920,
        1080
      ],
      "cheh/22.webp": [
        1920,
        1080
      ]
    },
    "en": {
      "title": "Biological Museum",
      "subtitle": "Competition & branding",
      "tags": [
        "Merch",
        "Identity",
        "Gamification"
      ],
      "paragraphs": [
        "As part of Design Tseh, a major creative marathon for designers, our task was to develop merchandise for the Timiryazev State Biological Museum and Biocluster that would extend the museum experience rather than function as a simple souvenir.",
        "We researched museum user experience, gamification mechanics, and visual nostalgia. This led to the concept “The Researcher’s Journey”: the visitor becomes an explorer-scout, discovering exhibitions, following a personal route, and collecting achievements.",
        "The idea shaped a visual system inspired by scout badges, maps, and explorer kits."
      ]
    },
    "color": "#e4ead9"
  },
  {
    "slug": "witchs-hat",
    "hidden": true,
    "title": "Шляпа ведьмы",
    "subtitle": "Благотворительный проект",
    "tags": [
      "Брендинг",
      "Иллюстрация"
    ],
    "cover": "project-img-3.webp",
    "year": "2025",
    "paragraphs": [
      "Игривый, волшебный благотворительный проект, созданный для того, чтобы напомнить нам о чудесах и доброте, которые мы все носим внутри — и превратить этот свет в поддержку для детей с аутизмом. Мягкие пастельные тона, причудливые формы и дружелюбные существа приглашают каждого снова поверить в волшебство, где дизайн становится мягким проявлением заботы.",
      "В первой части рассказывается о ценностях студии, которые вдохновляют на творчество и помогают взглянуть на мир по-новому. Вторая часть предлагает путеводитель по замку, открывая его комнаты, уютное кафе и мастерскую, где каждый день происходят маленькие чудеса."
    ],
    "images": [
      "Frame_122.webp",
      "2_wh.webp",
      "3_wh.webp",
      "4_wh_1.webp",
      "4_wh_2.webp",
      "5_wh.webp",
      "7_wh.webp",
      "8_wh.webp",
      "10_wh.webp",
      "bookmoc.webp",
      "wh_book1.webp",
      "wh_book6.webp",
      "wh_book7.webp",
      "wh_book12.webp",
      "wh_book13.webp",
      "wh_book15.webp"
    ],
    "sizes": {
      "Frame_122.webp": [
        1928,
        1186
      ],
      "2_wh.webp": [
        2335,
        1414
      ],
      "3_wh.webp": [
        2336,
        1414
      ],
      "4_wh_1.webp": [
        1128,
        1413
      ],
      "4_wh_2.webp": [
        1128,
        1413
      ],
      "5_wh.webp": [
        2336,
        1413
      ],
      "7_wh.webp": [
        2335,
        1413
      ],
      "8_wh.webp": [
        2335,
        1414
      ],
      "10_wh.webp": [
        2335,
        1413
      ],
      "bookmoc.webp": [
        1502,
        999
      ],
      "wh_book1.webp": [
        1345,
        1009
      ],
      "wh_book6.webp": [
        1379,
        980
      ],
      "wh_book7.webp": [
        1379,
        980
      ],
      "wh_book12.webp": [
        1379,
        980
      ],
      "wh_book13.webp": [
        1380,
        979
      ],
      "wh_book15.webp": [
        1380,
        979
      ]
    },
    "en": {
      "title": "Witch’s Hat",
      "subtitle": "Charity project",
      "tags": [
        "Branding",
        "Illustration"
      ],
      "paragraphs": [
        "A playful, magical charity project created to remind us of the wonder and kindness we all carry inside — and to turn that light into support for children on the autism spectrum. Soft pastels, whimsical shapes, and friendly creatures invite everyone to believe in magic again — where design becomes a gentle act of care.",
        "The first part features the studio's values, which inspire creativity and help you see the world in a new way. The second part offers a guide to the castle, revealing its rooms, cozy café, and workshop, where small miracles happen every day."
      ]
    },
    "color": "#eee1e8"
  },
  {
    slug: 'penta-q', title: 'PENTA-Q', subtitle: 'Модификатор инженерных пластиков',
    tags: ['Айдентика', '3D & Моушн'], cover: 'PENTA_/frame-89.webp', year: '2026', color: '#dedede',
    paragraphs: [
      'Нашей задачей в рамках конкурса «Фабрика Дизайна» было с нуля разработать нейминг и фирменный стиль для молодой технологической компании, создав современную визуальную систему с генеративной графикой.',
      'Мы провели глубокий анализ рынка, конкурентной среды и особенностей продукта. В основу концепции легло строение квазикристаллов — структур с симметрией пятого порядка и упорядоченностью без периодического повторения.',
      'Этот принцип мы перенесли в айдентику через динамическую систему частиц и линий, превратив научную особенность продукта в ключевой визуальный язык бренда.'
    ],
    images: [
      'PENTA_/frame-89.webp',
      'PENTA_/banner-01.mp4',
      'PENTA_/slide-01.webp',
      'PENTA_/frame-87.webp',
      'PENTA_/slide-02.webp',
      'PENTA_/banner-02.mp4',
      'PENTA_/frame-88.webp',
      'PENTA_/frame-90.webp'
    ],
    sizes: {
      'PENTA_/frame-89.webp': [1920, 1080],
      'PENTA_/slide-01.webp': [1920, 1080],
      'PENTA_/frame-87.webp': [1920, 1080],
      'PENTA_/slide-02.webp': [1920, 1080],
      'PENTA_/frame-88.webp': [1920, 1080],
      'PENTA_/frame-90.webp': [1920, 1080]
    },
    en: {
      title: 'PENTA-Q', subtitle: 'Modifier for engineering plastics', tags: ['Identity', '3D & Motion'],
      paragraphs: [
        'As part of the Fabrika Dizayna competition, our task was to develop the naming and visual identity for a young technology company from the ground up, creating a contemporary design system driven by generative graphics.',
        'We conducted in-depth research into the market, competitive landscape, and the product itself. The concept was based on the structure of quasicrystals — defined by five-fold symmetry and order without periodic repetition.',
        'We translated this principle into a dynamic system of particles and lines, turning a scientific property of the material into the brand’s core visual language.'
      ]
    }
  },
  {
    slug: 'yarko',
    title: 'ЯРКО',
    subtitle: 'Мерч для анимационной студии',
    tags: ['Мерч', 'Айдентика'],
    cover: 'yarko_preview.webp',
    year: '2026',
    color: '#ffffff',
    paragraphs: [
      'Нашей задачей было разработать B2C- и B2B-мерч для сотрудников и партнёров анимационной студии ЯРКО, опираясь на существующий визуальный стиль компании. В основу концепции легла метафора кубиков: по отдельности это простые элементы, но, соединяясь, они складываются в единый мир — так же, как работа разных людей и команд объединяется в большие анимационные проекты.',
      'На этой идее мы построили модульную визуальную систему, сохранив узнаваемость бренда и сделав мерч более живым, вариативным и эмоциональным.'
    ],
    images: [
      'https://kinescope.io/embed/q18nKoTP52wyoYdQPJA973',
      'YARKO/2.webp',
      'YARKO/3.webp',
      'YARKO/4.webp',
      'https://kinescope.io/embed/cH4yp9vhygdpimWycK9Chu',
      'YARKO/6.webp',
      'YARKO/7.webp',
      'YARKO/8.webp',
      'YARKO/9.webp',
      'YARKO/10.webp',
      'YARKO/11.webp',
      'YARKO/12.webp',
      'YARKO/13.webp'
    ],
    sizes: {
      'YARKO/2.webp': [1920, 1080],
      'YARKO/3.webp': [1920, 1080],
      'YARKO/4.webp': [1920, 1080],
      'YARKO/6.webp': [1920, 1080],
      'YARKO/7.webp': [1920, 1080],
      'YARKO/8.webp': [1920, 1080],
      'YARKO/9.webp': [1920, 1080],
      'YARKO/10.webp': [1920, 1080],
      'YARKO/11.webp': [1920, 1080],
      'YARKO/12.webp': [1920, 1080],
      'YARKO/13.webp': [1920, 1080]
    },
    en: {
      title: 'YARKO',
      subtitle: 'Merchandise for animation studio',
      tags: ['Merch', 'Identity'],
      paragraphs: [
        'Our task was to develop B2C and B2B merchandise for the employees and partners of YARKO animation studio, building on the company’s existing visual identity. The concept was based on the metaphor of building blocks: individually, they are simple elements, but together they form a complete world — just as the work of different people and teams comes together to create animated projects.',
        'This idea became the foundation of a modular visual system that preserves the brand’s identity while making the merchandise more dynamic, flexible, and expressive.'
      ]
    }
  }
];

const projectOrder = [
  'young-kink',
  'yarko',
  'penta-q',
  'biological-museum',
  'koreshki',
  'vershki-i-koreshki',
  'weare',
];

export const projects: Project[] = allProjects
  .filter((project) => !project.hidden)
  .sort(
    (first, second) =>
      projectOrder.indexOf(first.slug) - projectOrder.indexOf(second.slug),
  );
