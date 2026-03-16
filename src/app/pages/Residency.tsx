import { motion } from "motion/react";
import { Clock, Presentation, Sparkles, Users, Wrench } from "lucide-react";
import { motion as framerMotion } from "framer-motion";

import { Navigation } from "../components/Navigation";
import { PageHeroTitle } from "../components/PageHeroTitle";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";
import { getAssetByUsage } from "../data/siteImages";
import { useTranslation } from "../translations/useTranslation";

const residencyParagraphs = [
  "הרזידנסי של הארכיון הוא הזמנה לעצור רגע ולעבוד.",
  "אנחנו מזמינים כוריאוגרפים ואמני מחול להגיע לסטודיו שלנו בירושלים ולבלות כאן זמן של יצירה, שהייה ופליאה. זמן לחשוב, לנסות, לטעות, לשנות כיוון.",
  "הרזידנסי מתאים ליוצרים שנמצאים באמצע תהליך, בתחילת רעיון, או בשלב שבו צריך פשוט מקום לעבוד בו ברצינות.",
  "הסטודיו עצמו מותאם לעבודה במחול ובאמנויות הבמה. יש בו רצפת מחול, מראות עם וילון, מזגנים, אינטרנט אלחוטי, ומערכת תאורת במה עם קונטרולר ידני או אפשרות לקיואים.",
  "בנוסף יש בסטודיו מקרן וידאו, מיקסר ורמקולים, וידאו ותאורה כחלק מהתהליך.",
  "החלל מאפשר גם פתיחה של העבודה לקהל. אפשר לארגן ישיבה דינאמית של כארבעים עד חמישים צופים לשיתוף עבודה בתהליך או להופעה אינטימית.",
  "במקום יש גם שירותים, לובי ופטיו שמאפשרים רגע לנשום בין חזרה לחזרה.",
  "אנחנו רואים ברזידנסי הזדמנות למפגש בין יוצרים. מפגש בין שפות תנועה שונות, בין רעיונות, ובין דרכים שונות לחשוב דרך הגוף.",
  "ירושלים היא חלק מהחוויה. העיר נכנסת לפעמים אל תוך העבודה, לפעמים נשארת בחוץ, אבל תמיד נמצאת ברקע.",
  "הרזידנסי הוא הזמנה לקחת זמן.",
  "לעבוד.",
  "לחקור.",
  "ולגלות לאן זה מתגלגל.",
];

const residencyIncludes = [
  {
    title: "100 שעות סטודיו",
    icon: Clock,
  },
  {
    title: "ליווי אמנותי של תמי ורונן יצחקי",
    icon: Users,
  },
  {
    title: "שימוש במערכות טכניות",
    icon: Wrench,
  },
  {
    title: "אירועי שיתוף לעבודות בתהליך",
    icon: Presentation,
  },
  {
    title: "הופעה",
    icon: Sparkles,
  },
];

const residencyFormUrl = (import.meta.env.VITE_RESIDENCY_FORM_URL as string | undefined)?.trim();

export function Residency() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const residencyHero = getAssetByUsage("residencyHero");

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <UnifiedBackground />
      <Navigation />

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16">
        <PageHeroTitle title={t.residency.title} subtitle={residencyParagraphs[0]} />

        {residencyHero ? (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mx-auto max-w-5xl space-y-4"
          >
            <div className="overflow-hidden rounded-[2.25rem] border border-black/8 bg-white/75 shadow-2xl shadow-stone-200/25">
              <ImageWithFallback
                src={residencyHero.src}
                alt={residencyHero.altHe}
                className="aspect-[16/10] w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
            <p className={`text-sm text-secondary ${isRTL ? "text-right" : "text-left"}`}>
              {residencyHero.captionHe}
            </p>
          </motion.section>
        ) : null}

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`mx-auto max-w-4xl space-y-4 rounded-[2rem] border border-black/8 bg-white/65 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-xl ${isRTL ? "text-right" : "text-left"}`}
        >
          {residencyParagraphs.slice(1).map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-secondary">
              {paragraph}
            </p>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className={`mx-auto max-w-4xl space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <h2 className="text-4xl md:text-5xl">מה כולל הרזידנסי</h2>
            <p className="text-lg leading-relaxed text-secondary">
              100 שעות סטודיו, ליווי אמנותי של תמי ורונן יצחקי, שימוש במערכות טכניות, אירועי שיתוף לעבודות בתהליך, הופעה.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {residencyIncludes.map((item, index) => (
              <ResidencyFeatureCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-8"
        >
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h2 className="text-4xl md:text-5xl">איך מגישים מועמדות</h2>
            <HandDrawnResidencyButton
              href={residencyFormUrl || "#"}
              disabled={!residencyFormUrl}
              label={t.residency.applyButton}
            />
          </div>
        </motion.section>
      </div>
    </div>
  );
}

interface ResidencyFeatureCardProps {
  item: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  index: number;
}

function ResidencyFeatureCard({ item, index }: ResidencyFeatureCardProps) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      className="rounded-[1.75rem] border border-black/8 bg-white/70 p-6 shadow-lg shadow-stone-200/20 backdrop-blur-xl"
    >
      <div className="space-y-4 text-right">
        <Icon className="h-9 w-9 text-accent" />
        <h3 className="text-lg font-light leading-relaxed text-foreground">{item.title}</h3>
      </div>
    </motion.div>
  );
}

type HandDrawnResidencyButtonProps = {
  href: string;
  disabled: boolean;
  label: string;
};

function HandDrawnResidencyButton({ href, disabled, label }: HandDrawnResidencyButtonProps) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.8, ease: [0.43, 0.13, 0.23, 0.96] },
        opacity: { duration: 0.4 },
      },
    },
  };

  return (
    <div className="relative mx-auto inline-flex w-fit items-center justify-center px-6 py-5">
      <framerMotion.svg
        width="100%"
        height="100%"
        viewBox="0 0 520 170"
        preserveAspectRatio="none"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
        className="pointer-events-none absolute inset-0 h-full w-full text-accent"
        aria-hidden="true"
      >
        <framerMotion.path
          d="M 75 38
             C 25 54, 18 116, 84 134
             C 184 158, 336 156, 430 132
             C 494 116, 504 60, 454 38
             C 376 6, 152 8, 75 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={draw}
          className="opacity-90"
        />
      </framerMotion.svg>

      <a
        href={href}
        target={disabled ? undefined : "_blank"}
        rel={disabled ? undefined : "noopener noreferrer"}
        aria-disabled={disabled}
        className={`relative inline-flex min-h-14 items-center justify-center px-12 py-4 text-lg font-medium transition-all duration-300 ${
          disabled
            ? "cursor-not-allowed text-stone-500"
            : "text-accent hover:scale-[1.02] hover:text-accent/80"
        }`}
      >
        {label}
      </a>
    </div>
  );
}
