import { useLanguage } from '../contexts/LanguageContext';
import { translations } from './translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  return {
    t: translations[language],
    language,
  };
}
