import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { useTranslation } from '../translations/useTranslation';

export function LanguageToggle() {
  const { toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-4 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 flex items-center gap-2"
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(17, 17, 17, 0.1)',
      }}
      aria-label={t.language.label}
    >
      <Globe className="w-4 h-4 text-accent" />
      <span className="text-sm font-medium text-primary">
        {t.language.switchTo}
      </span>
    </motion.button>
  );
}
