import { motion } from "motion/react";
import { useState } from "react";

import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { GalleryGroupCard } from "../components/media/GalleryGroupCard";
import { ResponsiveImageGrid } from "../components/media/ResponsiveImageGrid";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getAssetByUsage,
  getAssetsBySection,
  getGroupsBySection,
  type ImageGroup,
  type SiteImageAsset,
} from "../data/siteImages";
import { useTranslation } from "../translations/useTranslation";

const duoParagraphs = [
  "אנחנו תמי ורונן יצחקי, זוג בחיים ועל הבמה, הורים לשלושה, יוצרים יחד מאז 2007.",
  "זוכי פרס רוזנבלום לאמנויות הבמה לאמנים מצטיינים 2024.",
  "בין השנים 1998-2021 הקמנו וניהלנו אמנותית את מרכז בין שמיים לארץ. בנוסף ניהלנו אמנותית בפסטיבל בין שמיים לארץ, סדרת תרבות מנדל, עונת התרבות פיל-ביית, סוזן דלל, בית מזיא ופרויקטים נוספים.",
  "לאורך השנים יצרנו עבודות לבמה, לחללים לא שגרתיים, לאתרים היסטוריים ולפרויקטים בין תחומיים. חלק מהעבודות נולדו מתוך תהליך מחקרי ארוך, ואחרות מתוך תגובה מהירה למציאות שסביבנו. את העבודות העלנו בפסטיבלים רבים ובאולמות ברחבי הארץ, וגם בהולנד, גרמניה, ספרד, פולין, אנגליה, ארה\"ב, מקסיקו וסינגפור.",
  "במקביל ליצירה אנחנו גם עוסקים בהוראה, ליווי אמנותי ופיתוח עסקי עם אמנים צעירים ובוגרים. רונן מכהן כראש התכניות לתואר ראשון במחול באקדמיה למוסיקה ולמחול בירושלים, חבר סגל בכיר, תמי מרצה במכללת ספיר במחלקה לתרבות יצירה והפקה.",
  "הסטודיו שלנו, הארכיון - בית למחול, הוא חלק מהעשייה הזאת. הוא מאפשר לנו להמשיך לחקור, ליצור ולהופיע, וגם לפתוח את התהליך לאמנים אחרים ולדיאלוגים בינתחומיים.",
  "זו הדרך שלנו לשאול שאלות על עצמנו ועל העולם, ולחפש אפשרויות חדשות למפגשים בין אנשים, גופים ורעיונות.",
];

const tammyParagraphs = [
  "אמא לשלושה, יוצרת מחול ומנהלת אמנותית.",
  "זוכת פרס רוזנבלום לאמנויות הבימה, אמנים מצטיינים לשנת 2024",
  "זוכת פרס נבון לשימור ולטיפוח תרבויות ישראל מטעם משרד התרבות לשנת 2019",
  "מאז 2001 פועלת ככוריאוגראפית עצמאית ועבודותיה הועלו בפסטיבלים רבים ברחבי הארץ ובעולם. במקביל, מביימת ומעצבת תנועה להצגות תיאטרון בשיתופי פעולה שונים, ומלווה יוצרים בתהליכי עבודה במסגרות שונות.",
  "מייסדת שותפה של עמותת בין שמיים לארץ, ושל הארכיון – בית למחול, ניהלה אמנותית את פסטיבל בין שמיים לארץ, צומת לב (עונת התרבות), חלון לרוח (עונת התרבות), להקת ארכה, סדרת המחול בבית מזיא ופרויקטים נוספים.",
  "מרצה במכללת ספיר במחלקה לתרבות יצירה והפקה, ובמסלול הוראת מחול באיילות בשיתוף האקדמיה למוסיקה ולמחול בירושלים. בעבר ריכזה תכניות לימודים של תיאטרון הקרון, כיהנה כמרכזת תחום מחול בסל תרבות ארצי, וכבוחנת ראשית בבגרויות למחול.",
  "בוגרת BfA באקדמיה לאמנות \"ריטפלד\" באמסטרדם, זוכת מלגה מלאה מטעם JMW. בוגרת תואר שני M.Dance בהצטיינות באקדמיה למוסיקה ולמחול בירושלים. לימודים נוספים בתכנית הבינתחומית לאמנויות באוניברסיטת ת\"א, ובביה\"ס לתיאטרון חזותי.",
  "בעבודותיה, היא מרבה לעסוק בחיבורים ובמערכות היחסים שבין טקסט לתנועה ולגעת בתכנים של זהות מתוך פריזמה אישית וביוגראפית, תרבות לוקאלית וגלובלית, עתיקה ועכשווית, ומצרפת צירופים חדשים של עולמות תוכן שונים ומנוגדים. בחיפוש אחר אינטגרציה בה הגוף מהווה נקודת מוצא וצומת של עולמות ושל זהויות.",
];

const ronenParagraphs = [
  "רונן יצחקי הוא כוריאוגרף, מורה ואוצר, המשמש כראש התכניות לתואר ראשון במחול בפקולטה למחול של האקדמיה למוסיקה ולמחול בירושלים. זוכה פרס רוזנבלום לאמנויות הבמה לשנת 2024.",
  "שימש כאוצר של סדרת \"סדרתרבות\" – סדרה של כ-40 אירועי תרבות שהתקיימו ברחבי ירושלים, בתמיכת קרן ג'ק, ג'וזף ומורטון מנדל ובניהולה של הקרן לירושלים. אצר את סדרת המחול בבית מזיא לתיאטרון, חבר הוועדה האמנותית של פרויקט רזידנסי במרכז סוזן דלל. חבר בחבר נאמנים של פרס נבון, פרס איינשטיין.",
  "למד תיאטרון מחול אצל רות זיו איל. סיים תואר ראשון בחוג לתנועה באקדמיה למוסיקה ולמחול בירושלים. מחזיק בתואר שני בקומפוזיציה מהאוניברסיטה העברית בשיתוף עם האקדמיה למוסיקה ולמחול בירושלים. בוגר מחזור ב' של מכון מנדל בתוכנית למנהיגות בתרבות יהודית.",
  "מנהל אמנותי של מרכז \"בין שמיים לארץ\" בין השנים 1998 ועד ל-2021. חבר בעמותת הכוריאוגרפים. חבר סגל בכיר באקדמיה למוסיקה ולמחול בירושלים החל מ-2022 ועד להיום.",
  "מלמד קומפוזיציה, תנועה ורב תרבותיות בפקולטה למחול באקדמיה למוסיקה ולמחול בירושלים, לימד בבית הספר למחול במכללת סמינר הקיבוצים בתל אביב, בחוג לתיאטרון באוניברסיטה העברית בירושלים, וב-Tanz Fabrik בברלין.",
  "רונן עוסק בפרקטיקה ובמחקר של הסיפור הבלתי מילולי הנובע מתנועת הגוף. הוא מתמקד בשאלות העולות מתוך החומר התנועתי, תוך שילוב הפורמליסטי והנאטיבי. חוקר שאלות של תרבות בין מרכז ושוליים בחברה הישראלית.",
];

const repertoireOrder = ["sfatayim", "yam-rahat", "meta-tammy"] as const;

const repertoireTitles: Record<(typeof repertoireOrder)[number], string> = {
  sfatayim: "שפתיים",
  "yam-rahat": "ים-רהט",
  "meta-tammy": "מטא-תמי",
};

const workMetadata = ["4 סטילס", "וידאו", "טקסט בקרוב"];
const workSectionNote = "לכל עבודה 4 סטילס, וידאו וטקסט. טקסט נכתוב בקרוב.";

export function TammyRonen() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const galleryLabels = {
    openGallery: t.gallery.openGallery,
    images: t.gallery.images,
    previousImage: t.gallery.previousImage,
    nextImage: t.gallery.nextImage,
  };

  const tammyProfile = getAssetByUsage("tammyProfile");
  const ronenProfile = getAssetByUsage("ronenProfile");
  const aboutGalleryAssets = getAssetsBySection("tammyRonen", "about").filter(
    (asset) => asset.usage !== "tammyProfile" && asset.usage !== "ronenProfile",
  );
  const repertoireGroups = repertoireOrder
    .map((slug) => getGroupsBySection("tammyRonen", "repertoire").find((group) => group.slug === slug))
    .filter((group): group is ImageGroup => Boolean(group))
    .map((group) => limitGalleryGroup(group));
  const previousWorksGroups = getGroupsBySection("tammyRonen", "previousWorks").map((group) =>
    limitGalleryGroup(group),
  );

  return (
    <div className="min-h-screen pt-24">
      <UnifiedBackground />
      <Navigation />

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`space-y-8 ${isRTL ? "text-right" : "text-left"}`}
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl">תמי ורונן יצחקי</h1>
            <p className="max-w-4xl text-xl leading-relaxed text-secondary">
              אנחנו תמי ורונן יצחקי, זוג בחיים ועל הבמה, הורים לשלושה, יוצרים יחד מאז 2007.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-16 md:grid-cols-2"
        >
          <ProfileCard
            asset={tammyProfile}
            name="תמי יצחקי"
            role="אמא לשלושה, יוצרת מחול ומנהלת אמנותית."
            index={0}
          />
          <ProfileCard
            asset={ronenProfile}
            name="רונן יצחקי"
            role="כוריאוגרף, מורה ואוצר."
            index={1}
          />
        </motion.section>

        <TextSection title="אודות" paragraphs={duoParagraphs} isRTL={isRTL} />

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className={`flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className="text-4xl md:text-5xl">תמונות</h2>
            <span className="rounded-full border border-accent/20 bg-white/80 px-3 py-1 text-sm text-secondary">
              {aboutGalleryAssets.length} {t.gallery.images}
            </span>
          </div>
          <ResponsiveImageGrid
            assets={aboutGalleryAssets}
            dialogTitle="תמי ורונן יצחקי"
            labels={galleryLabels}
            emphasizeFirst
          />
        </motion.section>

        <div className="grid gap-12 lg:grid-cols-2">
          <TextSection title="תמי יצחקי" paragraphs={tammyParagraphs} isRTL={isRTL} />
          <TextSection title="רונן יצחקי" paragraphs={ronenParagraphs} isRTL={isRTL} />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div className={`mx-auto max-w-4xl space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <h2 className="text-4xl md:text-5xl">רפרטואר</h2>
            <p className="text-lg leading-relaxed text-secondary">{workSectionNote}</p>
          </div>

          <Tabs defaultValue="repertoire" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="h-auto rounded-full bg-white/75 p-1.5 backdrop-blur-xl">
                <TabsTrigger className="rounded-full px-5 py-2.5" value="repertoire">
                  רפרטואר
                </TabsTrigger>
                <TabsTrigger className="rounded-full px-5 py-2.5" value="previousWorks">
                  עבודות קודמות
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="repertoire" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {repertoireGroups.map((group) => (
                  <GalleryGroupCard
                    key={group.id}
                    group={group}
                    labels={galleryLabels}
                    title={repertoireTitles[group.slug as keyof typeof repertoireTitles] ?? group.titleHe}
                    metadata={workMetadata}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="previousWorks" className="space-y-6">
              <div className={`mx-auto max-w-4xl ${isRTL ? "text-right" : "text-left"}`}>
                <p className="text-lg leading-relaxed text-secondary">
                  יש פירוט בתיקיות. לכל עבודה 4 סטילס, וידאו וטקסט. טקסט נכתוב בקרוב.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {previousWorksGroups.map((group) => (
                  <GalleryGroupCard key={group.id} group={group} labels={galleryLabels} metadata={workMetadata} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.section>
      </div>
    </div>
  );
}

interface TextSectionProps {
  title: string;
  paragraphs: string[];
  isRTL: boolean;
}

function TextSection({ title, paragraphs, isRTL }: TextSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`space-y-6 rounded-[2rem] border border-black/8 bg-white/65 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-xl ${isRTL ? "text-right" : "text-left"}`}
    >
      <h2 className="text-4xl md:text-5xl">{title}</h2>
      <div className="space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-relaxed text-secondary">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}

interface ProfileCardProps {
  asset: SiteImageAsset | null;
  name: string;
  role: string;
  index: number;
}

function ProfileCard({ asset, name, role, index }: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          borderColor: isHovered ? "rgba(200, 169, 106, 0.4)" : "rgba(17, 17, 17, 0.08)",
          boxShadow: isHovered
            ? "0 20px 60px rgba(200, 169, 106, 0.2)"
            : "0 8px 30px rgba(0, 0, 0, 0.05)",
        }}
        whileHover={{ y: -10 }}
      >
        <div className="relative aspect-[3/4] bg-gradient-to-br from-accent/20 to-secondary/10">
          {asset ? (
            <ImageWithFallback
              src={asset.src}
              alt={asset.altHe}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-lg text-secondary/30">
              {name}
            </div>
          )}
        </div>

        <div className="space-y-2 p-6 text-center">
          <h3 className="text-2xl font-light">{name}</h3>
          <p className="text-secondary">{role}</p>
          {asset ? <p className="text-sm text-secondary/80">{asset.captionHe}</p> : null}
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "radial-gradient(circle at center, rgba(200, 169, 106, 0.1) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function limitGalleryGroup(group: ImageGroup, maxAssets = 4): ImageGroup {
  const assets = group.assets.slice(0, maxAssets);
  const featuredAsset = assets.find((asset) => asset.id === group.featuredAsset.id) ?? assets[0];

  return {
    ...group,
    assets,
    imageCount: assets.length,
    featuredAsset,
  };
}
