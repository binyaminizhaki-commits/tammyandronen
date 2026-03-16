import { motion } from "motion/react";
import {
  Armchair,
  CircleOff,
  DoorOpen,
  LampFloor,
  LayoutPanelTop,
  Projector,
  Trees,
  Volume2,
} from "lucide-react";

import { Navigation } from "../components/Navigation";
import { PageHeroTitle } from "../components/PageHeroTitle";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { ResponsiveImageGrid } from "../components/media/ResponsiveImageGrid";
import { useLanguage } from "../contexts/LanguageContext";
import { getAssetsBySection } from "../data/siteImages";
import { useTranslation } from "../translations/useTranslation";

const studioParagraphs = [
  "הגענו למקום הזה כמעט במקרה.",
  "מבנה הספרייה הלאומית הישנה בגבעת רם. חדרים שידעו הרבה מחשבה, מחקר ושקט.",
  "הסטודיו שלנו נמצא בחלל שבו פעל פעם המכון לפליאוגרפיה, מקום שחקר כתבי יד עתיקים. חוקרים ישבו כאן ופענחו סימנים בני מאות שנים. אנחנו נכנסנו עם גוף וכוריאוגרפיה.",
  "קראנו למקום \"הארכיון\".",
  "לא כי אנחנו אוספים מסמכים, אלא כמחווה למה שהיה כאן קודם. מקום של חקירה, של זמן, של עבודה מחוץ ללחץ של הרגע.",
  "אנחנו, תמי ורונן יצחקי, הקמנו כאן סטודיו ליצירה במחול. מקום לעבוד בו, לחשוב בו, לטעות בו, ולהתחיל שוב.",
  "זה סטודיו לתהליכים. להופעות, למחקר תנועתי, לחזרות, להתחלות חדשות ולמפגש בין אמנים.",
  "במהלך השנה אנחנו גם מזמינים יוצרים אחרים להגיע לרזידנסי. הם באים לעבוד כאן תקופה, לפתח רעיונות, לנסות דברים חדשים, לשתף עבודה בתהליך ולפעמים גם להופיע.",
  "הארכיון הוא פשוט מקום לעבוד בו.",
  "מקום שבו תנועה פוגשת מחשבה.",
  "ומקום שבו ההיסטוריה של המבנה פוגשת יצירה עכשווית.",
];

const studioFeatures = [
  { title: "רצפת מחול", icon: LayoutPanelTop },
  { title: "מראות ווילון", icon: CircleOff },
  { title: "מערכת תאורה", icon: LampFloor },
  { title: "מקרן", icon: Projector },
  { title: "סאונד", icon: Volume2 },
  { title: "מקומות ישיבה", icon: Armchair },
  { title: "פטיו", icon: Trees },
  { title: "לובי", icon: DoorOpen },
];

export function Studio() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const galleryLabels = {
    openGallery: t.gallery.openGallery,
    images: t.gallery.images,
    previousImage: t.gallery.previousImage,
    nextImage: t.gallery.nextImage,
  };
  const studioGalleryAssets = getAssetsBySection("studio", "studioArchive");

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <UnifiedBackground />
      <Navigation />

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16">
        <PageHeroTitle title="הארכיון - בית למחול" subtitle={studioParagraphs[0]} />

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`mx-auto max-w-4xl space-y-4 rounded-[2rem] border border-black/8 bg-white/65 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-xl ${isRTL ? "text-right" : "text-left"}`}
        >
          {studioParagraphs.slice(1).map((paragraph) => (
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
          className="space-y-8"
        >
          <h2 className="text-center text-4xl md:text-5xl">תמונות של הסטודיו</h2>
          <ResponsiveImageGrid
            assets={studioGalleryAssets}
            dialogTitle="תמונות של הסטודיו"
            labels={galleryLabels}
            emphasizeFirst
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <h2 className="text-center text-4xl md:text-5xl">מידע על החלל</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {studioFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} title={feature.title} icon={feature.icon} index={index} />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}

function FeatureCard({ title, icon: Icon, index }: FeatureCardProps) {
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
        <h3 className="text-xl font-light text-foreground">{title}</h3>
      </div>
    </motion.div>
  );
}
