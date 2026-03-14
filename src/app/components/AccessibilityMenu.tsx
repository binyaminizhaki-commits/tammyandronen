import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Accessibility,
  Type,
  Contrast,
  Eye,
  MousePointer,
  Keyboard,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Link as LinkIcon,
  Minus,
  Plus,
  X,
} from "lucide-react";

type AccessibilitySettings = {
  fontSize: number;
  highContrast: boolean;
  linkHighlight: boolean;
  readableFont: boolean;
  stopAnimations: boolean;
  bigCursor: boolean;
  keyboardNav: boolean;
  lineHeight: number;
  letterSpacing: number;
};

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem("accessibilitySettings");
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: 100,
          highContrast: false,
          linkHighlight: false,
          readableFont: false,
          stopAnimations: false,
          bigCursor: false,
          keyboardNav: true,
          lineHeight: 100,
          letterSpacing: 0,
        };
  });

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.style.setProperty("--accessibility-font-size", `${settings.fontSize}%`);

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Link highlight
    if (settings.linkHighlight) {
      root.classList.add("highlight-links");
    } else {
      root.classList.remove("highlight-links");
    }

    // Readable font
    if (settings.readableFont) {
      root.classList.add("readable-font");
    } else {
      root.classList.remove("readable-font");
    }

    // Stop animations
    if (settings.stopAnimations) {
      root.classList.add("stop-animations");
    } else {
      root.classList.remove("stop-animations");
    }

    // Big cursor
    if (settings.bigCursor) {
      root.classList.add("big-cursor");
    } else {
      root.classList.remove("big-cursor");
    }

    // Line height
    root.style.setProperty("--accessibility-line-height", `${settings.lineHeight}%`);

    // Letter spacing
    root.style.setProperty("--accessibility-letter-spacing", `${settings.letterSpacing}px`);

    // Keyboard navigation
    if (settings.keyboardNav) {
      root.classList.add("keyboard-nav");
    } else {
      root.classList.remove("keyboard-nav");
    }

    // Save to localStorage
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
  }, [settings]);

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      highContrast: false,
      linkHighlight: false,
      readableFont: false,
      stopAnimations: false,
      bigCursor: false,
      keyboardNav: true,
      lineHeight: 100,
      letterSpacing: 0,
    });
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const adjustValue = (key: "fontSize" | "lineHeight" | "letterSpacing", delta: number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: Math.max(50, Math.min(200, prev[key] + delta)),
    }));
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent/50 sm:bottom-6 sm:left-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="תפריט נגישות"
        title="נגישות"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-x-4 bottom-20 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-black/10 bg-white shadow-2xl sm:bottom-24 sm:left-6 sm:right-auto sm:w-96 sm:max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 rounded-t-3xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Accessibility className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-medium text-foreground">תפריט נגישות</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                  aria-label="סגור תפריט נגישות"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Font Size Control */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <Type className="w-5 h-5 text-accent" />
                    <span className="font-medium">גודל גופן</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => adjustValue("fontSize", -10)}
                      className="p-2 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                      aria-label="הקטן גופן"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-secondary min-w-[60px] text-center">
                      {settings.fontSize}%
                    </span>
                    <button
                      onClick={() => adjustValue("fontSize", 10)}
                      className="p-2 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                      aria-label="הגדל גופן"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Line Height Control */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <Type className="w-5 h-5 text-accent" />
                    <span className="font-medium">גובה שורה</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => adjustValue("lineHeight", -10)}
                      className="p-2 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                      aria-label="הקטן גובה שורה"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-secondary min-w-[60px] text-center">
                      {settings.lineHeight}%
                    </span>
                    <button
                      onClick={() => adjustValue("lineHeight", 10)}
                      className="p-2 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                      aria-label="הגדל גובה שורה"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Letter Spacing Control */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <Type className="w-5 h-5 text-accent" />
                    <span className="font-medium">ריווח אותיות</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => adjustValue("letterSpacing", -1)}
                      className="p-2 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                      aria-label="הקטן ריווח אותיות"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-secondary min-w-[60px] text-center">
                      {settings.letterSpacing}px
                    </span>
                    <button
                      onClick={() => adjustValue("letterSpacing", 1)}
                      className="p-2 bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                      aria-label="הגדל ריווח אותיות"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-black/10" />

                {/* Toggle Options */}
                <div className="space-y-3">
                  <ToggleOption
                    icon={Contrast}
                    label="ניגודיות גבוהה"
                    checked={settings.highContrast}
                    onChange={() => toggleSetting("highContrast")}
                  />
                  <ToggleOption
                    icon={LinkIcon}
                    label="הדגש קישורים"
                    checked={settings.linkHighlight}
                    onChange={() => toggleSetting("linkHighlight")}
                  />
                  <ToggleOption
                    icon={Eye}
                    label="גופן קריא"
                    checked={settings.readableFont}
                    onChange={() => toggleSetting("readableFont")}
                  />
                  <ToggleOption
                    icon={Pause}
                    label="עצור אנימציות"
                    checked={settings.stopAnimations}
                    onChange={() => toggleSetting("stopAnimations")}
                  />
                  <ToggleOption
                    icon={MousePointer}
                    label="סמן עכבר גדול"
                    checked={settings.bigCursor}
                    onChange={() => toggleSetting("bigCursor")}
                  />
                  <ToggleOption
                    icon={Keyboard}
                    label="ניווט מקלדת"
                    checked={settings.keyboardNav}
                    onChange={() => toggleSetting("keyboardNav")}
                  />
                </div>

                <div className="h-px bg-black/10" />

                {/* Reset Button */}
                <button
                  onClick={resetSettings}
                  className="w-full py-3 bg-black/5 hover:bg-black/10 rounded-xl font-medium text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>אפס הגדרות</span>
                </button>

                {/* Info */}
                <div className="text-sm text-secondary leading-relaxed bg-accent/5 p-4 rounded-xl">
                  <p className="font-medium text-foreground mb-2">אתר זה נבנה בהתאם לתקן הישראלי (ת"י 5568)</p>
                  <p>
                    האתר עומד ברמת AA של WCAG 2.1 ומספק נגישות מלאה לאנשים עם מוגבלויות.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Toggle Option Component
function ToggleOption({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: any;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center justify-between p-3 bg-black/5 hover:bg-black/10 rounded-xl transition-colors"
      role="switch"
      aria-checked={checked}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-accent" />
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-black/20"
        } relative`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ x: checked ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}
