import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './Assets/app/Language/en.json';
import translationID from './Assets/app/Language/id.json';
import { store } from './Config/Store';

const resources = {
   en: {
      translation: translationEN
   },
   id: {
      translation: translationID
   }
};

const language = store.getState().language;

i18n
   .use(initReactI18next) // passes i18n down to react-i18next
   .init({
      compatibilityJSON: 'v3',
      resources,
      lng: `${language ? language : 'id'}`,
      fallbackLng: ['id', 'en'],
      interpolation: {
         escapeValue: false // react already safes from xss
      }
   });

export default i18n;