import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Accessibility,
  Contrast,
  Eye,
  Keyboard,
  Link as LinkIcon,
  Minus,
  MousePointer,
  Pause,
  Plus,
  RotateCcw,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";
import { Slider } from "./ui/slider";

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

type RangeSettingKey = "fontSize" | "lineHeight" | "letterSpacing";
type ToggleSettingKey =
  | "highContrast"
  | "linkHighlight"
  | "readableFont"
  | "stopAnimations"
  | "bigCursor"
  | "keyboardNav";

const DEFAULT_SETTINGS: AccessibilitySettings = {
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

const RANGE_CONFIG: Record<
  RangeSettingKey,
  {
    min: number;
    max: number;
    step: number;
    format: (value: number) => string;
  }
> = {
  fontSize: {
    min: 80,
    max: 200,
    step: 5,
    format: (value) => `${value}%`,
  },
  lineHeight: {
    min: 100,
    max: 220,
    step: 5,
    format: (value) => `${value}%`,
  },
  letterSpacing: {
    min: 0,
    max: 12,
    step: 0.5,
    format: (value) => `${value}px`,
  },
};

const COPY = {
  he: {
    title: "תפריט נגישות",
    close: "סגור תפריט נגישות",
    buttonLabel: "תפריט נגישות",
    fontSize: "גודל גופן",
    lineHeight: "גובה שורה",
    letterSpacing: "ריווח אותיות",
    decrease: "הקטן",
    increase: "הגדל",
    highContrast: "ניגודיות גבוהה",
    linkHighlight: "הדגשת קישורים",
    readableFont: "גופן קריא",
    stopAnimations: "עצירת אנימציות",
    bigCursor: "סמן עכבר גדול",
    keyboardNav: "ניווט מקלדת",
    reset: "איפוס הגדרות",
    infoTitle: 'אתר זה נבנה בהתאם לתקן הישראלי (ת"י 5568)',
    infoText: "האתר עומד ברמת AA של WCAG 2.1 ומספק נגישות מלאה לאנשים עם מוגבלויות.",
  },
  en: {
    title: "Accessibility Menu",
    close: "Close accessibility menu",
    buttonLabel: "Accessibility menu",
    fontSize: "Font Size",
    lineHeight: "Line Height",
    letterSpacing: "Letter Spacing",
    decrease: "Decrease",
    increase: "Increase",
    highContrast: "High Contrast",
    linkHighlight: "Highlight Links",
    readableFont: "Readable Font",
    stopAnimations: "Stop Animations",
    bigCursor: "Big Cursor",
    keyboardNav: "Keyboard Navigation",
    reset: "Reset Settings",
    infoTitle: 'This site is built in accordance with Israeli Standard (ת"י 5568)',
    infoText: "The site meets WCAG 2.1 Level AA and provides full accessibility for people with disabilities.",
  },
} as const;

const rangeDecimals = (step: number) => {
  const decimalPart = `${step}`.split(".")[1];
  return decimalPart ? decimalPart.length : 0;
};

const clampRangeValue = (key: RangeSettingKey, value: number) => {
  const { min, max, step } = RANGE_CONFIG[key];
  const decimals = rangeDecimals(step);
  const normalized = Number((Math.round(value / step) * step).toFixed(decimals));
  return Math.min(max, Math.max(min, normalized));
};

const sanitizeSettings = (value: unknown): AccessibilitySettings => {
  if (!value || typeof value !== "object") {
    return DEFAULT_SETTINGS;
  }

  const parsed = value as Partial<AccessibilitySettings>;

  return {
    fontSize: clampRangeValue("fontSize", Number(parsed.fontSize ?? DEFAULT_SETTINGS.fontSize)),
    highContrast: Boolean(parsed.highContrast),
    linkHighlight: Boolean(parsed.linkHighlight),
    readableFont: Boolean(parsed.readableFont),
    stopAnimations: Boolean(parsed.stopAnimations),
    bigCursor: Boolean(parsed.bigCursor),
    keyboardNav: parsed.keyboardNav ?? DEFAULT_SETTINGS.keyboardNav,
    lineHeight: clampRangeValue("lineHeight", Number(parsed.lineHeight ?? DEFAULT_SETTINGS.lineHeight)),
    letterSpacing: clampRangeValue(
      "letterSpacing",
      Number(parsed.letterSpacing ?? DEFAULT_SETTINGS.letterSpacing),
    ),
  };
};

export function AccessibilityMenu() {
  const { language, isRTL } = useLanguage();
  const copy = COPY[language];
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("accessibilitySettings");
    if (!saved) {
      return;
    }

    try {
      setSettings(sanitizeSettings(JSON.parse(saved)));
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const hasTextAdjustments =
      settings.fontSize !== DEFAULT_SETTINGS.fontSize ||
      settings.lineHeight !== DEFAULT_SETTINGS.lineHeight ||
      settings.letterSpacing !== DEFAULT_SETTINGS.letterSpacing;

    root.style.setProperty("--accessibility-font-scale", `${settings.fontSize / 100}`);
    root.style.setProperty("--accessibility-content-line-height", `${(1.65 * settings.lineHeight) / 100}`);
    root.style.setProperty("--accessibility-heading-line-height", `${Math.max(1.1, (1.2 * settings.lineHeight) / 100)}`);
    root.style.setProperty("--accessibility-letter-spacing", `${settings.letterSpacing}px`);
    root.classList.toggle("accessibility-text-adjust", hasTextAdjustments);
    root.classList.toggle("high-contrast", settings.highContrast);
    root.classList.toggle("highlight-links", settings.linkHighlight);
    root.classList.toggle("readable-font", settings.readableFont);
    root.classList.toggle("stop-animations", settings.stopAnimations);
    root.classList.toggle("big-cursor", settings.bigCursor);
    root.classList.toggle("keyboard-nav", settings.keyboardNav);

    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: ToggleSettingKey) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setRangeValue = (key: RangeSettingKey, nextValue: number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: clampRangeValue(key, nextValue),
    }));
  };

  const nudgeRangeValue = (key: RangeSettingKey, direction: -1 | 1) => {
    setSettings((prev) => ({
      ...prev,
      [key]: clampRangeValue(key, prev[key] + RANGE_CONFIG[key].step * direction),
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent/50 sm:bottom-6 sm:left-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={copy.buttonLabel}
        title={copy.buttonLabel}
      >
        <Accessibility className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 100 : -100 }}
              transition={{ type: "spring", damping: 25 }}
              className={`fixed inset-x-4 bottom-20 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-black/10 bg-white shadow-2xl sm:bottom-24 sm:w-[26rem] ${
                isRTL ? "sm:left-auto sm:right-6" : "sm:left-6 sm:right-auto"
              }`}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="accessibility-menu-title"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="sticky top-0 flex items-center justify-between rounded-t-3xl border-b border-black/10 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <Accessibility className="h-6 w-6 text-accent" />
                  <h2 id="accessibility-menu-title" className="text-xl font-medium text-foreground">
                    {copy.title}
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-black/5"
                  aria-label={copy.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-6">
                <RangeControl
                  icon={Type}
                  label={copy.fontSize}
                  value={settings.fontSize}
                  valueText={RANGE_CONFIG.fontSize.format(settings.fontSize)}
                  min={RANGE_CONFIG.fontSize.min}
                  max={RANGE_CONFIG.fontSize.max}
                  step={RANGE_CONFIG.fontSize.step}
                  onChange={(value) => setRangeValue("fontSize", value)}
                  onDecrease={() => nudgeRangeValue("fontSize", -1)}
                  onIncrease={() => nudgeRangeValue("fontSize", 1)}
                  decreaseLabel={`${copy.decrease} ${copy.fontSize}`}
                  increaseLabel={`${copy.increase} ${copy.fontSize}`}
                  dir={isRTL ? "rtl" : "ltr"}
                />

                <RangeControl
                  icon={Type}
                  label={copy.lineHeight}
                  value={settings.lineHeight}
                  valueText={RANGE_CONFIG.lineHeight.format(settings.lineHeight)}
                  min={RANGE_CONFIG.lineHeight.min}
                  max={RANGE_CONFIG.lineHeight.max}
                  step={RANGE_CONFIG.lineHeight.step}
                  onChange={(value) => setRangeValue("lineHeight", value)}
                  onDecrease={() => nudgeRangeValue("lineHeight", -1)}
                  onIncrease={() => nudgeRangeValue("lineHeight", 1)}
                  decreaseLabel={`${copy.decrease} ${copy.lineHeight}`}
                  increaseLabel={`${copy.increase} ${copy.lineHeight}`}
                  dir={isRTL ? "rtl" : "ltr"}
                />

                <RangeControl
                  icon={Type}
                  label={copy.letterSpacing}
                  value={settings.letterSpacing}
                  valueText={RANGE_CONFIG.letterSpacing.format(settings.letterSpacing)}
                  min={RANGE_CONFIG.letterSpacing.min}
                  max={RANGE_CONFIG.letterSpacing.max}
                  step={RANGE_CONFIG.letterSpacing.step}
                  onChange={(value) => setRangeValue("letterSpacing", value)}
                  onDecrease={() => nudgeRangeValue("letterSpacing", -1)}
                  onIncrease={() => nudgeRangeValue("letterSpacing", 1)}
                  decreaseLabel={`${copy.decrease} ${copy.letterSpacing}`}
                  increaseLabel={`${copy.increase} ${copy.letterSpacing}`}
                  dir={isRTL ? "rtl" : "ltr"}
                />

                <div className="h-px bg-black/10" />

                <div className="space-y-3">
                  <ToggleOption
                    icon={Contrast}
                    label={copy.highContrast}
                    checked={settings.highContrast}
                    onChange={() => toggleSetting("highContrast")}
                  />
                  <ToggleOption
                    icon={LinkIcon}
                    label={copy.linkHighlight}
                    checked={settings.linkHighlight}
                    onChange={() => toggleSetting("linkHighlight")}
                  />
                  <ToggleOption
                    icon={Eye}
                    label={copy.readableFont}
                    checked={settings.readableFont}
                    onChange={() => toggleSetting("readableFont")}
                  />
                  <ToggleOption
                    icon={Pause}
                    label={copy.stopAnimations}
                    checked={settings.stopAnimations}
                    onChange={() => toggleSetting("stopAnimations")}
                  />
                  <ToggleOption
                    icon={MousePointer}
                    label={copy.bigCursor}
                    checked={settings.bigCursor}
                    onChange={() => toggleSetting("bigCursor")}
                  />
                  <ToggleOption
                    icon={Keyboard}
                    label={copy.keyboardNav}
                    checked={settings.keyboardNav}
                    onChange={() => toggleSetting("keyboardNav")}
                  />
                </div>

                <div className="h-px bg-black/10" />

                <button
                  onClick={resetSettings}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-black/5 py-3 font-medium text-foreground transition-colors hover:bg-black/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>{copy.reset}</span>
                </button>

                <div className="rounded-xl bg-accent/5 p-4 text-sm leading-relaxed text-secondary">
                  <p className="mb-2 font-medium text-foreground">{copy.infoTitle}</p>
                  <p>{copy.infoText}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function RangeControl({
  icon: Icon,
  label,
  value,
  valueText,
  min,
  max,
  step,
  onChange,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  dir,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  valueText: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  dir: "rtl" | "ltr";
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-foreground">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-accent" />
          <span className="font-medium">{label}</span>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">{valueText}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrease}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/5 transition-colors hover:bg-black/10"
          aria-label={decreaseLabel}
        >
          <Minus className="h-4 w-4" />
        </button>

        <Slider
          dir={dir}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(values) => onChange(values[0] ?? value)}
          aria-label={label}
          className="flex-1"
        />

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/5 transition-colors hover:bg-black/10"
          aria-label={increaseLabel}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function ToggleOption({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between rounded-xl bg-black/5 p-3 transition-colors hover:bg-black/10"
      role="switch"
      aria-checked={checked}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-accent" />
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className={`relative h-6 w-12 rounded-full transition-colors ${checked ? "bg-accent" : "bg-black/20"}`}>
        <motion.div
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}
