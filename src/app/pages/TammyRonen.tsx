import { motion } from "motion/react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GalleryGroupCard } from "../components/media/GalleryGroupCard";
import { ResponsiveImageGrid } from "../components/media/ResponsiveImageGrid";
import { Navigation } from "../components/Navigation";
import { PageHeroTitle } from "../components/PageHeroTitle";
import { UnifiedBackground } from "../components/UnifiedBackground";
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

const workSectionNote = "לכל עבודה 4 סטילס, וידאו וטקסט. טקסט נכתוב בקרוב.";

export function TammyRonen() {
  const { t, language } = useTranslation();
  const { isRTL } = useLanguage();
  const galleryLabels = {
    openGallery: t.gallery.openGallery,
    images: t.gallery.images,
    previousImage: t.gallery.previousImage,
    nextImage: t.gallery.nextImage,
  };

  const tammyProfile = getAssetByUsage("tammyProfile");
  const ronenProfile = getAssetByUsage("ronenProfile");
  const duoPortrait = getAssetsBySection("tammyRonen", "about").find((asset) =>
    asset.captionHe.includes("פנים בפנים"),
  );
  const aboutGalleryAssets = getAssetsBySection("tammyRonen", "about").filter(
    (asset) =>
      asset.usage !== "tammyProfile" &&
      asset.usage !== "ronenProfile" &&
      asset.id !== duoPortrait?.id,
  );
  const repertoireGroups = repertoireOrder
    .map((slug) => getGroupsBySection("tammyRonen", "repertoire").find((group) => group.slug === slug))
    .filter((group): group is ImageGroup => Boolean(group))
    .map((group) => limitGalleryGroup(group));
  const previousWorksGroups = getGroupsBySection("tammyRonen", "previousWorks").map((group) =>
    limitGalleryGroup(group),
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <UnifiedBackground />
      <Navigation />

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16">
        <PageHeroTitle
          title={language === "en" ? "Tammy & Ronen Izhaki" : "תמי ורונן יצחקי"}
          subtitle={t.tammyRonen.subtitle}
        />

        <BiographySplitSection asset={duoPortrait ?? null} title="תמי ורונן יצחקי" paragraphs={duoParagraphs} />
        <BiographySplitSection asset={tammyProfile} title="תמי יצחקי" paragraphs={tammyParagraphs} />
        <BiographySplitSection asset={ronenProfile} title="רונן יצחקי" paragraphs={ronenParagraphs} />

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className={`flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className="text-4xl md:text-5xl">תמונות</h2>
            <span className="text-sm text-secondary">
              {aboutGalleryAssets.length} {t.gallery.images}
            </span>
          </div>
          <ResponsiveImageGrid
            assets={aboutGalleryAssets}
            dialogTitle="תמי ורונן יצחקי"
            labels={galleryLabels}
            emphasizeFirst
            lightboxShowDescription={false}
            lightboxShowThumbnailCaptions={false}
          />
        </motion.section>

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
              <TabsList className="h-auto border-b border-black/10 bg-transparent p-0">
                <TabsTrigger
                  className="rounded-none border-b-2 border-transparent px-5 py-3 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  value="repertoire"
                >
                  רפרטואר
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-none border-b-2 border-transparent px-5 py-3 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  value="previousWorks"
                >
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
                  <GalleryGroupCard key={group.id} group={group} labels={galleryLabels} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.section>
      </div>
    </div>
  );
}

interface BiographySplitSectionProps {
  asset: SiteImageAsset | null;
  title: string;
  paragraphs: string[];
}

function BiographySplitSection({ asset, title, paragraphs }: BiographySplitSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="grid items-start gap-8 border border-black/8 bg-white/68 p-5 shadow-sm backdrop-blur-xl md:p-8 lg:grid-cols-[1.05fr_0.95fr]"
    >
      <div className="order-2 space-y-5 text-right lg:order-1">
        <h2 className="text-4xl md:text-5xl">{title}</h2>
        <div className="space-y-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="order-1 overflow-hidden border border-black/8 bg-stone-100 lg:order-2">
        <div className="relative aspect-[4/5]">
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
              {title}
            </div>
          )}
        </div>
      </div>
    </motion.section>
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
