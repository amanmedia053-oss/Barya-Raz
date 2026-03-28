import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ps: {
    translation: {
      welcome: "نور الامارات ته ښه راغلاست",
      language_select: "ژبه غوره کړئ",
      get_started: "پیل کړئ",
      home: "کور",
      bookmarks: "نښې",
      settings: "تنظیمات",
      about: "په اړه",
      dark_mode: "توره بڼه",
      theme_color: "د رنګ موضوع",
      font_style: "د لیک بڼه",
      reset_default: "بېرته اصلي حالت ته",
      search_placeholder: "په مقاله کې وپلټئ...",
      featured: "غوره برخې",
      read_more: "نور ولولئ",
      share: "شریکول",
      saved: "په نښو کې خوندي شو",
      removed: "له نښو څخه لرې شو",
      no_bookmarks: "تراوسه نښې نشته",
      onboarding_1_title: "اسلامي حکمت",
      onboarding_1_desc: "د اسلامي امارت د بریا په اړه منظمو مقالو ته لاسرسی ومومئ.",
      onboarding_2_title: "د څو ژبو ملاتړ",
      onboarding_2_desc: "په پښتو کې ولولئ.",
      onboarding_3_title: "غوره تجربه",
      onboarding_3_desc: "خپله مطالعه د موضوعاتو، فونټونو او حرکتونو سره تنظیم کړئ.",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ps',
    fallbackLng: 'ps',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
