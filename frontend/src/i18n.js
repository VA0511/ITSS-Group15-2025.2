import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import layoutEN from './locales/en/layout.json';
import ownerEN from './locales/en/owner.json';
import trainerEN from './locales/en/trainer.json';
import memberEN from './locales/en/member.json';
import commonVI from './locales/vi/common.json';
import authVI from './locales/vi/auth.json';
import layoutVI from './locales/vi/layout.json';
import ownerVI from './locales/vi/owner.json';
import trainerVI from './locales/vi/trainer.json';
import memberVI from './locales/vi/member.json';
import commonJA from './locales/ja/common.json';
import authJA from './locales/ja/auth.json';
import layoutJA from './locales/ja/layout.json';
import ownerJA from './locales/ja/owner.json';
import trainerJA from './locales/ja/trainer.json';
import memberJA from './locales/ja/member.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: commonEN, auth: authEN, layout: layoutEN, owner: ownerEN, trainer: trainerEN, member: memberEN },
      vi: { common: commonVI, auth: authVI, layout: layoutVI, owner: ownerVI, trainer: trainerVI, member: memberVI },
      ja: { common: commonJA, auth: authJA, layout: layoutJA, owner: ownerJA, trainer: trainerJA, member: memberJA },
    },
    fallbackLng: 'vi',
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
