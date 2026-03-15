import { motion } from "motion/react";
import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../translations/useTranslation";

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export function LanguageToggle({ className, compact = false }: LanguageToggleProps) {
  const { toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex shrink-0 items-center border border-white/55 bg-white/42 text-sm font-medium text-primary shadow-sm backdrop-blur-xl transition-colors duration-200 hover:bg-white/58 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        compact ? "h-10 w-10 justify-center px-0 py-0" : "gap-2 px-3 py-2",
        className,
      )}
      aria-label={t.language.label}
    >
      <Globe className="h-4 w-4 text-accent" />
      {compact ? <span className="sr-only">{t.language.switchTo}</span> : <span>{t.language.switchTo}</span>}
    </motion.button>
  );
}
