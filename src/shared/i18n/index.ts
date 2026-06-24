import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '@/shared/i18n/es.json';
import en from '@/shared/i18n/en.json';

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
