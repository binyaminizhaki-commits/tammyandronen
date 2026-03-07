import { motion } from "motion/react";
import { Clock, Presentation, Sparkles, Users, Wrench } from "lucide-react";

import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";
import { getAssetByUsage } from "../data/siteImages";

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
  const { isRTL } = useLanguage();
  const residencyHero = getAssetByUsage("residencyHero");

  return (
    <div className="min-h-screen pt-24">
      <UnifiedBackground />
      <Navigation />

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] ${isRTL ? "text-right" : "text-left"}`}
        >
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl">רזידנסי</h1>
            <p className="max-w-3xl text-2xl leading-relaxed text-secondary">{residencyParagraphs[0]}</p>
          </div>

          {residencyHero ? (
            <div className="space-y-4">
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
            </div>
          ) : null}
        </motion.section>

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
            <a
              href={residencyFormUrl || "#"}
              target={residencyFormUrl ? "_blank" : undefined}
              rel={residencyFormUrl ? "noopener noreferrer" : undefined}
              aria-disabled={!residencyFormUrl}
              className={`inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all duration-300 ${
                residencyFormUrl
                  ? "bg-accent text-white shadow-xl hover:scale-[1.02] hover:shadow-2xl"
                  : "cursor-not-allowed bg-stone-300 text-stone-600"
              }`}
            >
              Apply for Residency
            </a>
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
