export interface ArticleSection {
  id: string;
  heading: string;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  introduction: string;
  sections: ArticleSection[];
  conclusion: string;
  language: string;
}

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'د لمانځه اهمیت او فضیلت',
    author: 'شیخ محمد',
    category: 'عبادات',
    image: 'https://picsum.photos/seed/mosque/800/400',
    language: 'ps',
    introduction: 'لمونځ د اسلام دوهم رکن او د دین ستنه ده. په دې مقاله کې به موږ د لمانځه په اهمیت، فضیلت او د هغې په روحاني ګټو خبرې وکړو.',
    sections: [
      { id: 's1', heading: '۱. لمونځ د دین ستنه ده', content: 'رسول الله صلی الله علیه وسلم فرمایلي دي چې لمونځ د دین ستنه ده، چا چې لمونځ قایم کړ هغه دین قایم کړ او چا چې لمونځ پریښود هغه دین ونړاوه.' },
      { id: 's2', heading: '۲. د الله تعالی سره اړیکه', content: 'لمونځ د بنده او د هغه د خالق ترمنځ مستقیمه اړیکه ده. په لمانځه کې بنده د خپل رب سره راز او نیاز کوي.' },
      { id: 's3', heading: '۳. د ګناهونو کفاره', content: 'پنځه وخته لمونځ د ګناهونو داسې پاکوونکی دی لکه یو څوک چې په ورځ کې پنځه ځله په سیند کې غسل وکړي.' },
      { id: 's4', heading: '۴. د زړه سکون', content: 'قرآن کریم فرمایي: "الا بذکر الله تطمئن القلوب". لمونځ د الله تعالی تر ټولو غوره ذکر دی چې زړونو ته سکون بښي.' },
      { id: 's5', heading: '۵. د وخت پابندي', content: 'لمونځ مسلمان ته د وخت د تنظیم او پابندۍ درس ورکوي، ځکه چې هر لمونځ په خپل ټاکلي وخت فرض دی.' },
      { id: 's6', heading: '۶. د ټولنیز یووالي نښه', content: 'په جومات کې په جومات کې لمونځ کول د مسلمانانو ترمنځ مساوات او یووالی رامنځته کوي.' },
      { id: 's7', heading: '۷. له بدو کارونو څخه مخنیوی', content: 'قرآن کریم فرمایي چې لمونځ انسان له فحشاء او ناوړه کارونو څخه منع کوي.' },
      { id: 's8', heading: '۸. د قیامت په ورځ لومړۍ پوښتنه', content: 'د قیامت په ورځ به تر ټولو لومړۍ پوښتنه د لمانځه په اړه کیږي.' },
      { id: 's9', heading: '۹. د بدن روغتیا', content: 'د لمانځه حرکتونه نه یوازې روحاني بلکې جسماني ګټې هم لري چې د بدن په روغتیا کې مرسته کوي.' },
      { id: 's10', heading: '۱۰. د بریا لاره', content: 'هغه کسان چې په خپلو لمونځونو کې عاجزي کوي، هغوی په دنیا او آخرت کې بریالي دي.' },
    ],
    conclusion: 'په پای کې ویلی شو چې لمونځ د یو مسلمان د ژوند تر ټولو مهمه برخه ده. موږ باید هڅه وکړو چې خپل لمونځونه په پوره اخلاص او په خپل وخت ادا کړو.'
  },
  {
    id: '2',
    title: 'Importance of Prayer in Islam',
    author: 'Sheikh Ahmad',
    category: 'Worship',
    image: 'https://picsum.photos/seed/prayer/800/400',
    language: 'en',
    introduction: 'Prayer (Salah) is the second pillar of Islam and the foundation of faith. In this article, we explore its significance and spiritual benefits.',
    sections: [
      { id: 'e1', heading: '1. The Pillar of Religion', content: 'The Prophet (PBUH) said that Salah is the pillar of religion. Whoever establishes it establishes the religion.' },
      { id: 'e2', heading: '2. Direct Connection with Allah', content: 'Salah is a direct link between the servant and the Creator, allowing for personal communication with God.' },
      { id: 'e3', heading: '3. Expiation of Sins', content: 'The five daily prayers wash away sins just as water cleanses the body.' },
      { id: 'e4', heading: '4. Peace of Mind', content: 'Remembrance of Allah through prayer brings tranquility to the heart.' },
      { id: 'e5', heading: '5. Discipline and Punctuality', content: 'Praying at fixed times teaches a Muslim discipline and the value of time.' },
      { id: 'e6', heading: '6. Social Unity', content: 'Congregational prayer fosters equality and brotherhood among believers.' },
      { id: 'e7', heading: '7. Shield Against Evil', content: 'The Quran states that prayer restrains one from shameful and unjust deeds.' },
      { id: 'e8', heading: '8. The First Question on Judgment Day', content: 'The first thing a person will be accounted for on the Day of Resurrection is their prayer.' },
      { id: 'e9', heading: '9. Physical Well-being', content: 'The movements in Salah provide moderate physical exercise and improve posture.' },
      { id: 'e10', heading: '10. Path to Success', content: 'True success in both worlds belongs to those who are humble in their prayers.' },
    ],
    conclusion: 'In conclusion, Salah is the most vital part of a Muslim\'s life. We must strive to perform our prayers with sincerity and on time.'
  }
];
