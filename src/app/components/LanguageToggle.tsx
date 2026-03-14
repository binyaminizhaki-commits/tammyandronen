import { motion } from "motion/react";
import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../translations/useTranslation";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center gap-2 border border-white/55 bg-white/42 px-3 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-xl transition-colors duration-200 hover:bg-white/58 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
      aria-label={t.language.label}
    >
      <Globe className="h-4 w-4 text-accent" />
      <span>{t.language.switchTo}</span>
    </motion.button>
  );
}
