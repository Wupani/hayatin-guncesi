import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dil dosyalarını import et
import tr from '../locales/tr.json';
import en from '../locales/en.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Önce AsyncStorage'dan kaydedilmiş dili kontrol et
      const savedLanguage = await AsyncStorage.getItem('user-language');
      
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      // Kaydedilmiş dil yoksa cihaz dilini algıla
      const deviceLanguage = Localization.locale.split('-')[0]; // 'en-US' -> 'en'
      
      // Desteklenen diller arasında var mı kontrol et
      const supportedLanguages = ['tr', 'en', 'de', 'fr'];
      const language = supportedLanguages.includes(deviceLanguage) 
        ? deviceLanguage 
        : 'en'; // Varsayılan İngilizce
      
      callback(language);
    } catch (error) {
      console.log('Language detection error:', error);
      callback('en'); // Fallback
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.log('Language cache error:', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n; 