import { ChangeEvent, FormEvent, useState } from "react";
import { X, Mail, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

import { Checkbox } from "./ui/checkbox";

type LegalSection = "accessibility" | "arrival" | "privacy" | "terms" | "copyright" | null;

const quickLinks = [
  { label: "בית", path: "/" },
  { label: "תמי ורונן", path: "/tammy-ronen" },
  { label: "הארכיון - בית למחול", path: "/studio" },
  { label: "אירועים", path: "/events" },
  { label: "רזידנסי", path: "/residency" },
  { label: "צור קשר", path: "/contact" },
];

const PHONE_REGEX = /^[+]?[\d\s\-()]{8,}$/;

export function Footer() {
  const [activeSection, setActiveSection] = useState<LegalSection>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [channels, setChannels] = useState({
    newsletter: false,
    whatsapp: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    setSuccessMessage("");
    setErrorMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage('נא להזין כתובת דוא"ל תקינה.');
      return;
    }

    if (!channels.newsletter && !channels.whatsapp) {
      setErrorMessage("בחרו לפחות ערוץ עדכון אחד.");
      return;
    }

    if (channels.whatsapp && !PHONE_REGEX.test(normalizedPhone)) {
      setErrorMessage("נא להזין מספר טלפון תקין עבור קבוצת הוואטסאפ.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          phone: channels.whatsapp ? normalizedPhone : "",
          newsletter: channels.newsletter,
          whatsapp: channels.whatsapp,
          source: "website-footer",
          pageUrl: window.location.href,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { already?: boolean; updated?: boolean; message?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.message || "לא ניתן להשלים הרשמה כרגע.");
      }

      setEmail("");
      setPhone("");
      setChannels({ newsletter: false, whatsapp: false });
      setSuccessMessage(
        result?.updated
          ? "פרטי ההרשמה עודכנו."
          : result?.already
            ? "כתובת זו כבר רשומה."
            : "תודה, נעדכן אתכם בערוצים שסימנתם.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "אירעה שגיאה בהרשמה. נסו שוב מאוחר יותר.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleChannel = (key: "newsletter" | "whatsapp", checked: boolean) => {
    setChannels((current) => ({
      ...current,
      [key]: checked,
    }));
  };

  return (
    <>
      <footer className="footer-shell relative z-20 isolate mt-32 border-t border-[var(--footer-border)] text-[var(--footer-text)] opacity-100">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4" dir="rtl">
              <h3 className="mb-4 text-xl font-light text-[var(--footer-text)]">הארכיון - בית למחול</h3>
              <p className="text-sm leading-relaxed text-[var(--footer-muted)]">
                סטודיו ליצירה במחול, רזידנסי, מחקר תנועתי ומפגש בין אמנים בירושלים.
              </p>
            </div>

            <div className="space-y-4" dir="rtl">
              <h3 className="mb-4 text-xl font-light text-[var(--footer-text)]">קישורים מהירים</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li key={link.path} whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
                    <Link
                      to={link.path}
                      className="inline-block rounded-sm text-sm text-[var(--footer-link)] transition-colors visited:text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-4" dir="rtl">
              <h3 className="mb-4 text-xl font-light text-[var(--footer-text)]">יצירת קשר</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-[var(--footer-muted)]">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>האוניברסיטה העברית, קמפוס ספרא, בניין הספרייה הישנה, ירושלים</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <a
                    href="tel:+972506262730"
                    className="rounded-sm text-[var(--footer-link)] transition-colors visited:text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                  >
                    050-6262730
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <a
                    href="mailto:tammykleinman@gmail.com"
                    className="rounded-sm break-all text-[var(--footer-link)] transition-colors visited:text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                  >
                    tammykleinman@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4" dir="rtl">
              <h3 className="mb-4 text-xl font-light text-[var(--footer-text)]">לחדשות ועדכונים</h3>
              <p className="mb-4 text-sm text-[var(--footer-muted)]">
                הצטרפו לניוזלטר, לקבוצת הוואטסאפ או לשניהם, ונעדכן אתכם בהתאם.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="relative overflow-hidden border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,210,140,0.14),transparent_42%)]" />
                <div className="relative space-y-4">
                  <div className="space-y-2">
                    <span className="block text-xs font-medium tracking-[0.12em] text-[var(--footer-muted)]">
                      כתובת דוא״ל
                    </span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--footer-muted)]" />
                      <input
                  type="email"
                  value={email}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                  required
                  placeholder="כתובת דוא״ל"
                  className="w-full border border-white/8 bg-black/8 px-4 py-3 pr-10 text-right text-sm text-[var(--footer-text)] placeholder:text-[var(--footer-muted)] focus:border-[var(--footer-link-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--footer-focus)]"
                />
                    </div>
                  </div>

                <div className="space-y-2.5">
                  <div
                    className={`flex flex-row-reverse items-center justify-between gap-3 border px-4 py-3 transition-colors ${
                      channels.newsletter
                        ? "border-[var(--footer-link-hover)] bg-[rgba(245,210,140,0.12)]"
                        : "border-white/8 bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <Checkbox
                      id="newsletter-choice"
                      checked={channels.newsletter}
                      onCheckedChange={(checked) => toggleChannel("newsletter", Boolean(checked))}
                      className="border-[var(--footer-border)] data-[state=checked]:border-[var(--footer-link-hover)] data-[state=checked]:bg-[var(--footer-link-hover)]"
                    />
                    <label htmlFor="newsletter-choice" className="text-sm font-medium text-[var(--footer-text)]">
                      ניוזלטר
                    </label>
                  </div>

                  <div
                    className={`flex flex-row-reverse items-center justify-between gap-3 border px-4 py-3 transition-colors ${
                      channels.whatsapp
                        ? "border-[var(--footer-link-hover)] bg-[rgba(245,210,140,0.12)]"
                        : "border-white/8 bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <Checkbox
                      id="whatsapp-choice"
                      checked={channels.whatsapp}
                      onCheckedChange={(checked) => toggleChannel("whatsapp", Boolean(checked))}
                      className="border-[var(--footer-border)] data-[state=checked]:border-[var(--footer-link-hover)] data-[state=checked]:bg-[var(--footer-link-hover)]"
                    />
                    <label htmlFor="whatsapp-choice" className="text-sm font-medium text-[var(--footer-text)]">
                      קבוצת וואטסאפ
                    </label>
                  </div>
                </div>

                {channels.whatsapp ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPhone(event.target.value)}
                    required
                    placeholder="מספר טלפון לקבוצת הוואטסאפ"
                    className="w-full border border-white/8 bg-black/8 px-4 py-3 text-right text-sm text-[var(--footer-text)] placeholder:text-[var(--footer-muted)] focus:border-[var(--footer-link-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--footer-focus)]"
                  />
                ) : null}

                <p className="text-[11px] leading-relaxed text-[var(--footer-muted)]">
                  אפשר לבחור ערוץ אחד או לסמן את שניהם.
                </p>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full bg-[var(--footer-link-hover)] px-4 py-3 text-base font-semibold text-[var(--footer-bg)] transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] disabled:opacity-50"
                >
                  {isSubmitting ? "שולח..." : "הרשמה"}
                </motion.button>

                {successMessage ? (
                  <p className="text-xs text-green-300" aria-live="polite">
                    {successMessage}
                  </p>
                ) : null}
                {errorMessage ? (
                  <p className="text-xs text-red-300" aria-live="polite">
                    {errorMessage}
                  </p>
                ) : null}
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-[var(--footer-border)] pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <button
                  onClick={() => setActiveSection("accessibility")}
                  className="rounded-sm text-[var(--footer-link)] transition-colors duration-300 hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                >
                  נגישות
                </button>
                <button
                  onClick={() => setActiveSection("arrival")}
                  className="rounded-sm text-[var(--footer-link)] transition-colors duration-300 hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                >
                  דרכי הגעה
                </button>
                <button
                  onClick={() => setActiveSection("privacy")}
                  className="rounded-sm text-[var(--footer-link)] transition-colors duration-300 hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                >
                  מדיניות פרטיות
                </button>
                <button
                  onClick={() => setActiveSection("terms")}
                  className="rounded-sm text-[var(--footer-link)] transition-colors duration-300 hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                >
                  תנאי שימוש
                </button>
                <button
                  onClick={() => setActiveSection("copyright")}
                  className="rounded-sm text-[var(--footer-link)] transition-colors duration-300 hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                >
                  זכויות יוצרים
                </button>
              </div>
              <div className="text-sm text-[var(--footer-muted)]">© 2026 תמי ורונן יצחקי. כל הזכויות שמורות.</div>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {activeSection ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            onClick={() => setActiveSection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[80vh] w-full max-w-4xl overflow-hidden bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-black/5 bg-white/95 px-8 py-6 backdrop-blur-sm">
                <h2 className="text-2xl">
                  {activeSection === "accessibility" && "נגישות"}
                  {activeSection === "arrival" && "דרכי הגעה"}
                  {activeSection === "privacy" && "מדיניות פרטיות"}
                  {activeSection === "terms" && "תנאי שימוש"}
                  {activeSection === "copyright" && "זכויות יוצרים"}
                </h2>
                <button
                  onClick={() => setActiveSection(null)}
                  className="p-2 transition-colors hover:bg-black/5"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="prose prose-lg max-h-[calc(80vh-100px)] overflow-y-auto px-8 py-8 max-w-none" dir="rtl">
                {activeSection === "accessibility" && <AccessibilityContent />}
                {activeSection === "arrival" && <ArrivalContent />}
                {activeSection === "privacy" && <PrivacyContent />}
                {activeSection === "terms" && <TermsContent />}
                {activeSection === "copyright" && <CopyrightContent />}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function AccessibilityContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">נגישות האתר</h3>
        <p className="mb-4 leading-relaxed text-secondary">
          אנו מחויבים להנגשת אתר זה לאנשים עם מוגבלויות, תוך ציות לחוק שוויון זכויות לאנשים עם מוגבלויות, התשנ"ח-1998, ולתקנות הנלוות.
        </p>
        <p className="mb-4 leading-relaxed text-secondary">
          <strong>רכיב נגישות:</strong> האתר כולל רכיב נגישות המאפשר התאמות חזותיות, שינויי צבע, ניווט במקלדת ותמיכה בקוראי מסך.
        </p>
        <p className="leading-relaxed text-secondary">
          <strong>רמת נגישות:</strong> אנו שואפים לעמוד ברמת AA של תקן WCAG 2.1.
        </p>
      </section>

      <section>
        <h3 className="mb-4 text-xl">נגישות המקום</h3>
        <p className="leading-relaxed text-secondary">
          המבנה ממוקם בקמפוס ספרא של האוניברסיטה העברית בירושלים, בבניין הספרייה הישנה. מומלץ ליצור קשר מראש כדי לתאם הגעה ולוודא את תנאי הנגישות הרלוונטיים לביקור.
        </p>
      </section>

      <section>
        <h3 className="mb-4 text-xl">פרטי רכזת נגישות</h3>
        <p className="leading-relaxed text-secondary">
          <strong>שם:</strong> תמי יצחקי
          <br />
          <strong>טלפון:</strong>{" "}
          <a href="tel:+972506262730" className="text-accent hover:underline">
            050-6262730
          </a>
          <br />
          <strong>דוא"ל:</strong>{" "}
          <a href="mailto:tammykleinman@gmail.com" className="text-accent hover:underline">
            tammykleinman@gmail.com
          </a>
        </p>
      </section>

      <section>
        <p className="text-sm text-secondary">
          <strong>עדכון אחרון:</strong> מרץ 2026
        </p>
      </section>
    </div>
  );
}

function ArrivalContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">פרטי המפעיל</h3>
        <p className="leading-relaxed text-secondary">
          <strong>שם המפעיל:</strong> תמי ורונן יצחקי
          <br />
          <strong>כתובת:</strong> האוניברסיטה העברית, קמפוס ספרא, בניין הספרייה הישנה, ירושלים
          <br />
          <strong>טלפון:</strong>{" "}
          <a href="tel:+972506262730" className="text-accent hover:underline">
            050-6262730
          </a>
          <br />
          <strong>דוא"ל:</strong>{" "}
          <a href="mailto:tammykleinman@gmail.com" className="text-accent hover:underline">
            tammykleinman@gmail.com
          </a>
        </p>
      </section>

      <section>
        <h3 className="mb-4 text-xl">דרכי הגעה</h3>
        <p className="leading-relaxed text-secondary">
          הארכיון - בית למחול פועל בבניין הספרייה הישנה שבקמפוס ספרא של האוניברסיטה העברית בירושלים. מומלץ ליצור קשר מראש לתיאום הגעה, קבלת הנחיות מדויקות וסיוע בכניסה לקמפוס.
        </p>
      </section>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">מדיניות פרטיות / Privacy Policy</h3>

        <div className="mb-8 space-y-4">
          <p className="leading-relaxed text-secondary">
            אנו מכבדים את פרטיותך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.
          </p>

          <h4 className="mb-3 mt-6 text-lg">איסוף מידע</h4>
          <p className="leading-relaxed text-secondary">
            אנו אוספים מידע שאתה מספק ביודעין דרך טפסי יצירת קשר או בקשה למועמדות. המידע עשוי לכלול: שם, כתובת דוא"ל, מספר טלפון והודעות שאתה שולח אלינו.
          </p>

          <h4 className="mb-3 mt-6 text-lg">שימוש במידע</h4>
          <p className="leading-relaxed text-secondary">
            אנו משתמשים במידע כדי להגיב לפניותיך, לעבד בקשות למועמדות, לשפר את השירותים שלנו ולשלוח עדכונים רלוונטיים (רק אם נתת הסכמה).
          </p>

          <h4 className="mb-3 mt-6 text-lg">שיתוף מידע</h4>
          <p className="leading-relaxed text-secondary">
            אנו לא משתפים את המידע האישי שלך עם גורמים שלישיים, למעט כאשר נדרש על פי חוק או כדי להגן על זכויותינו.
          </p>

          <h4 className="mb-3 mt-6 text-lg">אבטחת מידע</h4>
          <p className="leading-relaxed text-secondary">
            אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע שלך מפני גישה, שינוי או גילוי לא מורשים.
          </p>

          <h4 className="mb-3 mt-6 text-lg">הזכויות שלך</h4>
          <p className="leading-relaxed text-secondary">
            יש לך את הזכות לבקש גישה למידע האישי שלך, לתקן אותו או למחוק אותו. צור קשר עם רכז הנגישות שלנו לצורך כך.
          </p>
        </div>

        <div className="space-y-4 border-t border-black/10 pt-6" dir="ltr">
          <h4 className="mb-3 text-lg">English Version</h4>
          <p className="leading-relaxed text-secondary">
            We respect your privacy. This privacy policy explains how we collect, use, and protect your information.
          </p>

          <h5 className="mb-2 mt-4 font-medium">Information Collection</h5>
          <p className="leading-relaxed text-secondary">
            We collect information you knowingly provide through contact forms or residency applications. This may include: name, email address, phone number, and messages you send us.
          </p>

          <h5 className="mb-2 mt-4 font-medium">Use of Information</h5>
          <p className="leading-relaxed text-secondary">
            We use your information to respond to inquiries, process residency applications, improve our services, and send relevant updates (only with your consent).
          </p>

          <h5 className="mb-2 mt-4 font-medium">Information Sharing</h5>
          <p className="leading-relaxed text-secondary">
            We do not share your personal information with third parties, except when required by law or to protect our rights.
          </p>

          <h5 className="mb-2 mt-4 font-medium">Data Security</h5>
          <p className="leading-relaxed text-secondary">
            We implement reasonable security measures to protect your information from unauthorized access, alteration, or disclosure.
          </p>

          <h5 className="mb-2 mt-4 font-medium">Your Rights</h5>
          <p className="leading-relaxed text-secondary">
            You have the right to request access to, correction of, or deletion of your personal information. Contact our accessibility coordinator for assistance.
          </p>
        </div>
      </section>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">תנאי שימוש / Terms of Use</h3>

        <div className="mb-8 space-y-4">
          <p className="leading-relaxed text-secondary">
            ברוכים הבאים לאתר של תמי ורונן יצחקי. השימוש באתר זה כפוף לתנאים הבאים.
          </p>

          <h4 className="mb-3 mt-6 text-lg">קבלת התנאים</h4>
          <p className="leading-relaxed text-secondary">
            גישה לאתר זה ושימוש בו מהווים את הסכמתך לתנאי שימוש אלו. אם אינך מסכים, אנא הימנע משימוש באתר.
          </p>

          <h4 className="mb-3 mt-6 text-lg">שימוש מותר</h4>
          <p className="leading-relaxed text-secondary">
            אתה רשאי להשתמש באתר למטרות אישיות ולא מסחריות בלבד. אסור להעתיק, לשכפל או להפיץ תכנים מהאתר ללא אישור מפורש בכתב.
          </p>

          <h4 className="mb-3 mt-6 text-lg">התנהגות משתמשים</h4>
          <p className="leading-relaxed text-secondary">
            אסור להשתמש באתר בצורה שעלולה לפגוע, להשבית או לפגום בתפקוד האתר, או להפריע לשימוש של משתמשים אחרים.
          </p>

          <h4 className="mb-3 mt-6 text-lg">שינויים בתנאים</h4>
          <p className="leading-relaxed text-secondary">
            אנו שומרים את הזכות לשנות תנאי שימוש אלו בכל עת. המשך שימוש באתר לאחר שינויים מהווה הסכמה לתנאים המעודכנים.
          </p>

          <h4 className="mb-3 mt-6 text-lg">הגבלת אחריות</h4>
          <p className="leading-relaxed text-secondary">
            האתר מסופק "כמות שהוא". אנו לא נושאים באחריות לכל נזק ישיר או עקיף הנובע משימוש באתר.
          </p>
        </div>

        <div className="space-y-4 border-t border-black/10 pt-6" dir="ltr">
          <h4 className="mb-3 text-lg">English Version</h4>
          <p className="leading-relaxed text-secondary">
            Welcome to the website of Tammy and Ronen Izhaki. Use of this site is subject to the following terms.
          </p>

          <h5 className="mb-2 mt-4 font-medium">Acceptance of Terms</h5>
          <p className="leading-relaxed text-secondary">
            Access to and use of this website constitute your acceptance of these terms of use. If you do not agree, please refrain from using the site.
          </p>

          <h5 className="mb-2 mt-4 font-medium">Permitted Use</h5>
          <p className="leading-relaxed text-secondary">
            You may use this site for personal, non-commercial purposes only. You may not copy, reproduce, or distribute content from the site without express written permission.
          </p>

          <h5 className="mb-2 mt-4 font-medium">User Conduct</h5>
          <p className="leading-relaxed text-secondary">
            You may not use the site in any manner that could damage, disable, or impair the site's functionality or interfere with other users' use.
          </p>

          <h5 className="mb-2 mt-4 font-medium">Changes to Terms</h5>
          <p className="leading-relaxed text-secondary">
            We reserve the right to modify these terms of use at any time. Continued use of the site after changes constitutes acceptance of the updated terms.
          </p>

          <h5 className="mb-2 mt-4 font-medium">Limitation of Liability</h5>
          <p className="leading-relaxed text-secondary">
            The site is provided "as is". We are not liable for any direct or indirect damages arising from use of the site.
          </p>
        </div>
      </section>
    </div>
  );
}

function CopyrightContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">זכויות יוצרים / Copyright</h3>

        <div className="mb-6 space-y-4">
          <p className="leading-relaxed text-secondary">© 2026 תמי ורונן יצחקי. כל הזכויות שמורות.</p>
          <p className="leading-relaxed text-secondary">
            כל התכנים באתר זה, כולל טקסטים, תמונות, סרטונים, עיצוב גרפי ולוגו, הם רכושם הבלעדי של תמי ורונן יצחקי ומוגנים על פי חוקי זכויות יוצרים בינלאומיים וישראליים.
          </p>
          <p className="leading-relaxed text-secondary">
            אין להעתיק, לשכפל, להפיץ, לשדר, להציג בפומבי, לבצע, לפרסם, לרשות או לעשות כל שימוש מסחרי בכל חלק מהתכנים ללא קבלת אישור מפורש בכתב מהבעלים.
          </p>
          <p className="leading-relaxed text-secondary">
            לשימוש מסחרי, לרישיון או לפניות בנושא זכויות יוצרים, אנא צרו קשר בכתובת:{" "}
            <a href="mailto:tammykleinman@gmail.com" className="text-accent hover:underline">
              tammykleinman@gmail.com
            </a>
          </p>
        </div>

        <div className="space-y-4 border-t border-black/10 pt-6" dir="ltr">
          <p className="leading-relaxed text-secondary">© 2026 Tammy and Ronen Izhaki. All rights reserved.</p>
          <p className="leading-relaxed text-secondary">
            All content on this website, including text, images, videos, graphic design, and logo, is the exclusive property of Tammy and Ronen Izhaki and is protected under international and Israeli copyright laws.
          </p>
          <p className="leading-relaxed text-secondary">
            You may not copy, reproduce, distribute, transmit, publicly display, perform, publish, license, or make any commercial use of any part of the content without obtaining express written permission from the owners.
          </p>
          <p className="leading-relaxed text-secondary">
            For commercial use, licensing, or copyright inquiries, please contact:{" "}
            <a href="mailto:tammykleinman@gmail.com" className="text-accent hover:underline">
              tammykleinman@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
