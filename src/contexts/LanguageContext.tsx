import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "he" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "he";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const dir = language === "he" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

// Translations
const translations = {
  he: {
    nav: {
      home: "בית",
      tammyRonen: "תמי ורונן",
      studio: "הסטודיו",
      residency: "רזידנסי",
      contact: "יצירת קשר",
    },
    home: {
      badge: "ארכיון דיגיטלי למחול",
      subtitle: "שימור ותיעוד מורשת הריקוד הישראלי והעולמי",
      subtitle2: "באמצעות טכנולוגיה דיגיטלית מתקדמת",
      partners: "בשיתוף ובתמיכת",
      exploreStudio: "גלה את הסטודיו",
      meetFounders: "הכירו את המייסדים",
      scrollDown: "גלול למטה",
      features: {
        unique: {
          title: "אוסף ייחודי",
          description: "תיעוד מקיף של ריקודים מסורתיים ועכשוויים",
        },
        heritage: {
          title: "מורשת תרבותית",
          description: "שימור וקידום של מורשת הריקוד הישראלי",
        },
        innovation: {
          title: "חדשנות",
          description: "שילוב טכנולוגיה מתקדמת בשימור מורשת",
        },
      },
      about: {
        title: "מורשת",
        titleAccent: "בתנועה",
        text1: "ארכיון ריקודים הוא פרויקט ייחודי המוקדש לשימור ותיעוד מורשת המחול הישראלי והבינלאומי. אנחנו משלבים טכנולוגיה דיגיטלית מתקדמת עם מומחיות אומנותית כדי ליצור ארכיון חי ונגיש.",
        text2: "דרך הסטודיו שלנו ותוכנית הרזידנסי, אנחנו לא רק משמרים את העבר - אנחנו גם תומכים ביצירה העכשווית ונותנים במה לדור הבא של יוצרי מחול.",
        readMore: "קראו עוד",
        imagePlaceholder: "תמונת הארכיון",
      },
      cta: {
        title: "הצטרפו",
        titleAccent: "למסע",
        text: "בין אם אתם יוצרים מחפשים מרחב ליצירה, או חובבי מחול המעוניינים להכיר את המורשת - יש לנו מקום בשבילכם",
        applyResidency: "הגישו לרזידנסי",
        exploreStudio: "גלו את הסטודיו",
      },
    },
    accessibility: {
      title: "תפריט נגישות",
      close: "סגור תפריט נגישות",
      fontSize: "גודל גופן",
      lineHeight: "גובה שורה",
      letterSpacing: "ריווח אותיות",
      highContrast: "ניגודיות גבוהה",
      linkHighlight: "הדגש קישורים",
      readableFont: "גופן קריא",
      stopAnimations: "עצור אנימציות",
      bigCursor: "סמן עכבר גדול",
      keyboardNav: "ניווט מקלדת",
      reset: "אפס הגדרות",
      infoTitle: "אתר זה נבנה בהתאם לתקן הישראלי (ת\"י 5568)",
      infoText: "האתר עומד ברמת AA של WCAG 2.1 ומספק נגישות מלאה לאנשים עם מוגבלויות.",
      buttonLabel: "תפריט נגישות",
      decrease: "הקטן",
      increase: "הגדל",
    },
    skipToMain: "דלג לתוכן הראשי",
  },
  en: {
    nav: {
      home: "Home",
      tammyRonen: "Tammy & Ronen",
      studio: "Studio",
      residency: "Residency",
      contact: "Contact",
    },
    home: {
      badge: "Digital Dance Archive",
      subtitle: "Preserving and documenting Israeli and global dance heritage",
      subtitle2: "through advanced digital technology",
      partners: "In partnership and with the support of",
      exploreStudio: "Explore the Studio",
      meetFounders: "Meet the Founders",
      scrollDown: "Scroll down",
      features: {
        unique: {
          title: "Unique Collection",
          description: "Comprehensive documentation of traditional and contemporary dances",
        },
        heritage: {
          title: "Cultural Heritage",
          description: "Preservation and promotion of Israeli dance heritage",
        },
        innovation: {
          title: "Innovation",
          description: "Integrating advanced technology in heritage preservation",
        },
      },
      about: {
        title: "Heritage",
        titleAccent: "in Motion",
        text1: "Dance Archive is a unique project dedicated to preserving and documenting Israeli and international dance heritage. We combine advanced digital technology with artistic expertise to create a living, accessible archive.",
        text2: "Through our studio and residency program, we don't just preserve the past - we also support contemporary creation and provide a platform for the next generation of dance creators.",
        readMore: "Read More",
        imagePlaceholder: "Archive Image",
      },
      cta: {
        title: "Join",
        titleAccent: "the Journey",
        text: "Whether you're creators looking for a space to create, or dance enthusiasts interested in learning about the heritage - we have a place for you",
        applyResidency: "Apply for Residency",
        exploreStudio: "Explore the Studio",
      },
    },
    accessibility: {
      title: "Accessibility menu",
      close: "Close accessibility menu",
      fontSize: "Font Size",
      lineHeight: "Line Height",
      letterSpacing: "Letter Spacing",
      highContrast: "High Contrast",
      linkHighlight: "Highlight Links",
      readableFont: "Readable Font",
      stopAnimations: "Stop Animations",
      bigCursor: "Big Cursor",
      keyboardNav: "Keyboard Navigation",
      reset: "Reset Settings",
      infoTitle: "This site is built in accordance with Israeli Standard (ת\"י 5568)",
      infoText: "The site meets WCAG 2.1 Level AA and provides full accessibility for people with disabilities.",
      buttonLabel: "Accessibility menu",
      decrease: "Decrease",
      increase: "Increase",
    },
    skipToMain: "Skip to main content",
  },
};
