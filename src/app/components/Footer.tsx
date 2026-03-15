import { ChangeEvent, FormEvent, useState } from "react";
import { X, Mail, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

import { useLanguage } from "../contexts/LanguageContext";
import type { Language } from "../translations/translations";
import { useTranslation } from "../translations/useTranslation";
import { Checkbox } from "./ui/checkbox";

type LegalSection = "accessibility" | "arrival" | "privacy" | "terms" | "copyright" | null;
type LegalSectionKey = Exclude<LegalSection, null>;
type SuccessMessageKey = "updated" | "already" | "subscribed";
type ErrorMessageKey = "invalidEmail" | "selectChannel" | "invalidPhone" | "submitError";

type FooterCopy = {
  brandTitle: string;
  brandDescription: string;
  quickLinksTitle: string;
  quickLinks: {
    archive: string;
    events: string;
  };
  contactTitle: string;
  address: string;
  newsletter: {
    title: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    newsletterLabel: string;
    whatsappLabel: string;
    phonePlaceholder: string;
    helper: string;
    submit: string;
    submitting: string;
    messages: Record<SuccessMessageKey | ErrorMessageKey, string>;
  };
  legalButtons: Record<LegalSectionKey, string>;
  copyrightLine: string;
  modalCloseLabel: string;
};

const PHONE_REGEX = /^[+]?[\d\s\-()]{8,}$/;
const CONTACT_PHONE = "050-6262730";
const CONTACT_PHONE_HREF = "tel:+972506262730";
const CONTACT_EMAIL = "tammykleinman@gmail.com";
const legalSectionOrder: LegalSectionKey[] = ["accessibility", "arrival", "privacy", "terms", "copyright"];

const footerCopy: Record<Language, FooterCopy> = {
  he: {
    brandTitle: "הארכיון - בית למחול",
    brandDescription: "סטודיו ליצירה במחול, רזידנסי, מחקר תנועתי ומפגש בין אמנים בירושלים.",
    quickLinksTitle: "קישורים מהירים",
    quickLinks: {
      archive: "הארכיון - בית למחול",
      events: "אירועים",
    },
    contactTitle: "יצירת קשר",
    address: "האוניברסיטה העברית, קמפוס ספרא, בניין הספרייה הישנה, ירושלים",
    newsletter: {
      title: "לחדשות ועדכונים",
      description: "הצטרפו לניוזלטר, לקבוצת הוואטסאפ או לשניהם, ונעדכן אתכם בהתאם.",
      emailLabel: 'כתובת דוא"ל',
      emailPlaceholder: 'כתובת דוא"ל',
      newsletterLabel: "ניוזלטר",
      whatsappLabel: "קבוצת וואטסאפ",
      phonePlaceholder: "מספר טלפון לקבוצת הוואטסאפ",
      helper: "אפשר לבחור ערוץ אחד או לסמן את שניהם.",
      submit: "הרשמה",
      submitting: "שולח...",
      messages: {
        updated: "פרטי ההרשמה עודכנו.",
        already: "כתובת זו כבר רשומה.",
        subscribed: "תודה, נעדכן אתכם בערוצים שסימנתם.",
        invalidEmail: 'נא להזין כתובת דוא"ל תקינה.',
        selectChannel: "בחרו לפחות ערוץ עדכון אחד.",
        invalidPhone: "נא להזין מספר טלפון תקין עבור קבוצת הוואטסאפ.",
        submitError: "לא ניתן להשלים את ההרשמה כרגע. נסו שוב מאוחר יותר.",
      },
    },
    legalButtons: {
      accessibility: "נגישות",
      arrival: "דרכי הגעה",
      privacy: "מדיניות פרטיות",
      terms: "תנאי שימוש",
      copyright: "זכויות יוצרים",
    },
    copyrightLine: "© 2026 תמי ורונן יצחקי. כל הזכויות שמורות.",
    modalCloseLabel: "סגור",
  },
  en: {
    brandTitle: "Archive - Home for Dance",
    brandDescription: "A space for dance creation, residency, movement research, and encounters between artists in Jerusalem.",
    quickLinksTitle: "Quick links",
    quickLinks: {
      archive: "Archive",
      events: "Events",
    },
    contactTitle: "Get in touch",
    address: "Hebrew University, Safra Campus, Old Library Building, Jerusalem",
    newsletter: {
      title: "News & updates",
      description: "Join the newsletter, the WhatsApp group, or both, and we will keep you updated.",
      emailLabel: "Email address",
      emailPlaceholder: "Email address",
      newsletterLabel: "Newsletter",
      whatsappLabel: "WhatsApp group",
      phonePlaceholder: "Phone number for the WhatsApp group",
      helper: "You can choose one channel or both.",
      submit: "Subscribe",
      submitting: "Sending...",
      messages: {
        updated: "Your subscription details were updated.",
        already: "This address is already subscribed.",
        subscribed: "Thanks, we will keep you updated through the selected channels.",
        invalidEmail: "Please enter a valid email address.",
        selectChannel: "Select at least one update channel.",
        invalidPhone: "Please enter a valid phone number for the WhatsApp group.",
        submitError: "Unable to complete the subscription right now. Please try again later.",
      },
    },
    legalButtons: {
      accessibility: "Accessibility",
      arrival: "Getting here",
      privacy: "Privacy policy",
      terms: "Terms of use",
      copyright: "Copyright",
    },
    copyrightLine: "© 2026 Tammy and Ronen Izhaki. All rights reserved.",
    modalCloseLabel: "Close",
  },
};

export function Footer() {
  const { language, isRTL } = useLanguage();
  const { t } = useTranslation();
  const copy = footerCopy[language];
  const contentDir = isRTL ? "rtl" : "ltr";
  const [activeSection, setActiveSection] = useState<LegalSection>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [channels, setChannels] = useState({
    newsletter: false,
    whatsapp: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessageKey, setSuccessMessageKey] = useState<SuccessMessageKey | null>(null);
  const [errorMessageKey, setErrorMessageKey] = useState<ErrorMessageKey | null>(null);

  const quickLinks = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.tammyRonen, path: "/tammy-ronen" },
    { label: copy.quickLinks.archive, path: "/studio" },
    { label: copy.quickLinks.events, path: "/events" },
    { label: t.nav.residency, path: "/residency" },
    { label: t.nav.contact, path: "/contact" },
  ];

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    setSuccessMessageKey(null);
    setErrorMessageKey(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessageKey("invalidEmail");
      return;
    }

    if (!channels.newsletter && !channels.whatsapp) {
      setErrorMessageKey("selectChannel");
      return;
    }

    if (channels.whatsapp && !PHONE_REGEX.test(normalizedPhone)) {
      setErrorMessageKey("invalidPhone");
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
        | { already?: boolean; updated?: boolean }
        | null;

      if (!response.ok) {
        throw new Error("submitError");
      }

      setEmail("");
      setPhone("");
      setChannels({ newsletter: false, whatsapp: false });
      setSuccessMessageKey(result?.updated ? "updated" : result?.already ? "already" : "subscribed");
    } catch {
      setErrorMessageKey("submitError");
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
            <div className="space-y-4" dir={contentDir}>
              <h3 className="mb-4 text-xl font-light text-[var(--footer-text)]">{copy.brandTitle}</h3>
              <p className="text-sm leading-relaxed text-[var(--footer-muted)]">{copy.brandDescription}</p>
            </div>

            <div className="space-y-4" dir={contentDir}>
              <h3 className="mb-4 text-xl font-light text-[var(--footer-text)]">{copy.quickLinksTitle}</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <motion.li
                    key={link.path}
                    whileHover={{ x: isRTL ? -4 : 4 }}
                    transition={{ duration: 0.2 }}
                  >
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

            <div className="space-y-4" dir={contentDir}>
              <h3 className="mb-4 text-xl font-light text-[var(--footer-text)]">{copy.contactTitle}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-[var(--footer-muted)]">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>{copy.address}</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <a
                    href={CONTACT_PHONE_HREF}
                    dir="ltr"
                    className="rounded-sm text-[var(--footer-link)] transition-colors visited:text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                  >
                    {CONTACT_PHONE}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    dir="ltr"
                    className="rounded-sm break-all text-[var(--footer-link)] transition-colors visited:text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4" dir={contentDir}>
              <h3 className="mb-4 text-xl font-light text-[var(--footer-text)]">{copy.newsletter.title}</h3>
              <p className="mb-4 text-sm text-[var(--footer-muted)]">{copy.newsletter.description}</p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="relative overflow-hidden border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,210,140,0.14),transparent_42%)]" />
                <div className="relative space-y-4">
                  <div className="space-y-2">
                    <span className="block text-xs font-medium tracking-[0.12em] text-[var(--footer-muted)]">
                      {copy.newsletter.emailLabel}
                    </span>
                    <div className="relative">
                      <Mail
                        className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--footer-muted)] ${isRTL ? "right-3" : "left-3"}`}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(inputEvent: ChangeEvent<HTMLInputElement>) => setEmail(inputEvent.target.value)}
                        required
                        placeholder={copy.newsletter.emailPlaceholder}
                        dir="ltr"
                        className={`w-full border border-white/8 bg-black/8 px-4 py-3 text-sm text-[var(--footer-text)] placeholder:text-[var(--footer-muted)] focus:border-[var(--footer-link-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--footer-focus)] ${isRTL ? "pr-10 text-right" : "pl-10 text-left"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div
                      className={`flex items-center justify-between gap-3 border px-4 py-3 transition-colors ${isRTL ? "flex-row-reverse" : ""} ${
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
                        {copy.newsletter.newsletterLabel}
                      </label>
                    </div>

                    <div
                      className={`flex items-center justify-between gap-3 border px-4 py-3 transition-colors ${isRTL ? "flex-row-reverse" : ""} ${
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
                        {copy.newsletter.whatsappLabel}
                      </label>
                    </div>
                  </div>

                  {channels.whatsapp ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(inputEvent: ChangeEvent<HTMLInputElement>) => setPhone(inputEvent.target.value)}
                      required
                      dir="ltr"
                      placeholder={copy.newsletter.phonePlaceholder}
                      className={`w-full border border-white/8 bg-black/8 px-4 py-3 text-sm text-[var(--footer-text)] placeholder:text-[var(--footer-muted)] focus:border-[var(--footer-link-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--footer-focus)] ${isRTL ? "text-right" : "text-left"}`}
                    />
                  ) : null}

                  <p className="text-[11px] leading-relaxed text-[var(--footer-muted)]">{copy.newsletter.helper}</p>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full bg-[var(--footer-link-hover)] px-4 py-3 text-base font-semibold text-[var(--footer-bg)] transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] disabled:opacity-50"
                  >
                    {isSubmitting ? copy.newsletter.submitting : copy.newsletter.submit}
                  </motion.button>

                  {successMessageKey ? (
                    <p className="text-xs text-green-300" aria-live="polite">
                      {copy.newsletter.messages[successMessageKey]}
                    </p>
                  ) : null}
                  {errorMessageKey ? (
                    <p className="text-xs text-red-300" aria-live="polite">
                      {copy.newsletter.messages[errorMessageKey]}
                    </p>
                  ) : null}
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-[var(--footer-border)] pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {legalSectionOrder.map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className="rounded-sm text-[var(--footer-link)] transition-colors duration-300 hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)]"
                  >
                    {copy.legalButtons[section]}
                  </button>
                ))}
              </div>
              <div className="text-sm text-[var(--footer-muted)]">{copy.copyrightLine}</div>
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
              <div
                className={`sticky top-0 flex items-center justify-between border-b border-black/5 bg-white/95 px-8 py-6 backdrop-blur-sm ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <h2 className="text-2xl">{copy.legalButtons[activeSection]}</h2>
                <button
                  onClick={() => setActiveSection(null)}
                  aria-label={copy.modalCloseLabel}
                  className="p-2 transition-colors hover:bg-black/5"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div
                className="prose prose-lg max-h-[calc(80vh-100px)] max-w-none overflow-y-auto px-8 py-8"
                dir={contentDir}
              >
                <LegalSectionContent section={activeSection} language={language} />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function LegalSectionContent({ section, language }: { section: LegalSectionKey; language: Language }) {
  if (section === "accessibility") {
    return <AccessibilityContent language={language} />;
  }

  if (section === "arrival") {
    return <ArrivalContent language={language} />;
  }

  if (section === "privacy") {
    return <PrivacyContent language={language} />;
  }

  if (section === "terms") {
    return <TermsContent language={language} />;
  }

  return <CopyrightContent language={language} />;
}

function AccessibilityContent({ language }: { language: Language }) {
  if (language === "en") {
    return (
      <div className="space-y-6">
        <section>
          <h3 className="mb-4 text-xl">Website accessibility</h3>
          <p className="mb-4 leading-relaxed text-secondary">
            We are committed to making this website accessible to people with disabilities, in accordance with the
            Equal Rights for Persons with Disabilities Law, 1998, and the related regulations.
          </p>
          <p className="mb-4 leading-relaxed text-secondary">
            <strong>Accessibility component:</strong> The site includes an accessibility panel for visual adjustments,
            color changes, keyboard navigation, and support for screen readers.
          </p>
          <p className="leading-relaxed text-secondary">
            <strong>Accessibility target:</strong> We aim to comply with WCAG 2.1 level AA.
          </p>
        </section>

        <section>
          <h3 className="mb-4 text-xl">Venue accessibility</h3>
          <p className="leading-relaxed text-secondary">
            The space is located on the Hebrew University Safra Campus in Jerusalem, inside the Old Library Building.
            We recommend contacting us in advance so we can coordinate your arrival and confirm the relevant
            accessibility conditions for your visit.
          </p>
        </section>

        <section>
          <h3 className="mb-4 text-xl">Accessibility contact</h3>
          <p className="leading-relaxed text-secondary">
            <strong>Name:</strong> Tammy Izhaki
            <br />
            <strong>Phone:</strong>{" "}
            <a href={CONTACT_PHONE_HREF} className="text-accent hover:underline">
              {CONTACT_PHONE}
            </a>
            <br />
            <strong>Email:</strong>{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <section>
          <p className="text-sm text-secondary">
            <strong>Last updated:</strong> March 2026
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">נגישות האתר</h3>
        <p className="mb-4 leading-relaxed text-secondary">
          אנו מחויבים להנגשת אתר זה לאנשים עם מוגבלויות, תוך ציות לחוק שוויון זכויות לאנשים עם מוגבלויות,
          התשנ"ח-1998, ולתקנות הנלוות.
        </p>
        <p className="mb-4 leading-relaxed text-secondary">
          <strong>רכיב נגישות:</strong> האתר כולל רכיב נגישות המאפשר התאמות חזותיות, שינויי צבע, ניווט במקלדת
          ותמיכה בקוראי מסך.
        </p>
        <p className="leading-relaxed text-secondary">
          <strong>רמת נגישות:</strong> אנו שואפים לעמוד ברמת AA של תקן WCAG 2.1.
        </p>
      </section>

      <section>
        <h3 className="mb-4 text-xl">נגישות המקום</h3>
        <p className="leading-relaxed text-secondary">
          המבנה ממוקם בקמפוס ספרא של האוניברסיטה העברית בירושלים, בבניין הספרייה הישנה. מומלץ ליצור קשר מראש
          כדי לתאם הגעה ולוודא את תנאי הנגישות הרלוונטיים לביקור.
        </p>
      </section>

      <section>
        <h3 className="mb-4 text-xl">פרטי רכזת נגישות</h3>
        <p className="leading-relaxed text-secondary">
          <strong>שם:</strong> תמי יצחקי
          <br />
          <strong>טלפון:</strong>{" "}
          <a href={CONTACT_PHONE_HREF} className="text-accent hover:underline">
            {CONTACT_PHONE}
          </a>
          <br />
          <strong>דוא"ל:</strong>{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
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

function ArrivalContent({ language }: { language: Language }) {
  if (language === "en") {
    return (
      <div className="space-y-6">
        <section>
          <h3 className="mb-4 text-xl">Operator details</h3>
          <p className="leading-relaxed text-secondary">
            <strong>Operator name:</strong> Tammy and Ronen Izhaki
            <br />
            <strong>Address:</strong> Hebrew University, Safra Campus, Old Library Building, Jerusalem
            <br />
            <strong>Phone:</strong>{" "}
            <a href={CONTACT_PHONE_HREF} className="text-accent hover:underline">
              {CONTACT_PHONE}
            </a>
            <br />
            <strong>Email:</strong>{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <section>
          <h3 className="mb-4 text-xl">Getting here</h3>
          <p className="leading-relaxed text-secondary">
            The archive operates from the Old Library Building on the Hebrew University Safra Campus in Jerusalem. We
            recommend contacting us in advance for exact arrival instructions and assistance with entering the campus.
          </p>
        </section>
      </div>
    );
  }

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
          <a href={CONTACT_PHONE_HREF} className="text-accent hover:underline">
            {CONTACT_PHONE}
          </a>
          <br />
          <strong>דוא"ל:</strong>{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section>
        <h3 className="mb-4 text-xl">דרכי הגעה</h3>
        <p className="leading-relaxed text-secondary">
          הארכיון פועל בבניין הספרייה הישנה שבקמפוס ספרא של האוניברסיטה העברית בירושלים. מומלץ ליצור קשר מראש
          לתיאום הגעה, קבלת הנחיות מדויקות וסיוע בכניסה לקמפוס.
        </p>
      </section>
    </div>
  );
}

function PrivacyContent({ language }: { language: Language }) {
  if (language === "en") {
    return (
      <div className="space-y-6">
        <section>
          <h3 className="mb-4 text-xl">Privacy policy</h3>

          <div className="space-y-4">
            <p className="leading-relaxed text-secondary">
              We respect your privacy. This privacy policy explains how we collect, use, and protect your information.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Information collection</h4>
            <p className="leading-relaxed text-secondary">
              We collect information you knowingly provide through contact forms or residency applications. This may
              include your name, email address, phone number, and messages you send us.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Use of information</h4>
            <p className="leading-relaxed text-secondary">
              We use your information to respond to inquiries, process residency applications, improve our services,
              and send relevant updates, only with your consent.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Information sharing</h4>
            <p className="leading-relaxed text-secondary">
              We do not share your personal information with third parties, except when required by law or when
              necessary to protect our rights.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Data security</h4>
            <p className="leading-relaxed text-secondary">
              We implement reasonable security measures to protect your information from unauthorized access,
              alteration, or disclosure.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Your rights</h4>
            <p className="leading-relaxed text-secondary">
              You have the right to request access to, correction of, or deletion of your personal information.
              Contact us if you need assistance.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">מדיניות פרטיות</h3>

        <div className="space-y-4">
          <p className="leading-relaxed text-secondary">
            אנו מכבדים את פרטיותך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.
          </p>

          <h4 className="mb-3 mt-6 text-lg">איסוף מידע</h4>
          <p className="leading-relaxed text-secondary">
            אנו אוספים מידע שאתה מספק ביודעין דרך טפסי יצירת קשר או בקשה למועמדות. המידע עשוי לכלול שם, כתובת
            דוא"ל, מספר טלפון והודעות שאתה שולח אלינו.
          </p>

          <h4 className="mb-3 mt-6 text-lg">שימוש במידע</h4>
          <p className="leading-relaxed text-secondary">
            אנו משתמשים במידע כדי להגיב לפניותיך, לעבד בקשות למועמדות, לשפר את השירותים שלנו ולשלוח עדכונים
            רלוונטיים, רק אם נתת הסכמה.
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
            יש לך זכות לבקש גישה למידע האישי שלך, לתקן אותו או למחוק אותו. אפשר ליצור איתנו קשר בכל שלב לצורך כך.
          </p>
        </div>
      </section>
    </div>
  );
}

function TermsContent({ language }: { language: Language }) {
  if (language === "en") {
    return (
      <div className="space-y-6">
        <section>
          <h3 className="mb-4 text-xl">Terms of use</h3>

          <div className="space-y-4">
            <p className="leading-relaxed text-secondary">
              Welcome to the website of Tammy and Ronen Izhaki. Use of this site is subject to the following terms.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Acceptance of terms</h4>
            <p className="leading-relaxed text-secondary">
              Access to and use of this website constitute your acceptance of these terms of use. If you do not agree,
              please refrain from using the site.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Permitted use</h4>
            <p className="leading-relaxed text-secondary">
              You may use this site for personal, non-commercial purposes only. You may not copy, reproduce, or
              distribute content from the site without express written permission.
            </p>

            <h4 className="mb-3 mt-6 text-lg">User conduct</h4>
            <p className="leading-relaxed text-secondary">
              You may not use the site in any manner that could damage, disable, or impair the site functionality or
              interfere with other users.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Changes to the terms</h4>
            <p className="leading-relaxed text-secondary">
              We reserve the right to modify these terms of use at any time. Continued use of the site after any
              change constitutes acceptance of the updated terms.
            </p>

            <h4 className="mb-3 mt-6 text-lg">Limitation of liability</h4>
            <p className="leading-relaxed text-secondary">
              The site is provided as is. We are not liable for any direct or indirect damages arising from use of the
              site.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">תנאי שימוש</h3>

        <div className="space-y-4">
          <p className="leading-relaxed text-secondary">
            ברוכים הבאים לאתר של תמי ורונן יצחקי. השימוש באתר זה כפוף לתנאים הבאים.
          </p>

          <h4 className="mb-3 mt-6 text-lg">קבלת התנאים</h4>
          <p className="leading-relaxed text-secondary">
            גישה לאתר זה ושימוש בו מהווים את הסכמתך לתנאי שימוש אלו. אם אינך מסכים, אנא הימנע משימוש באתר.
          </p>

          <h4 className="mb-3 mt-6 text-lg">שימוש מותר</h4>
          <p className="leading-relaxed text-secondary">
            אתה רשאי להשתמש באתר למטרות אישיות ולא מסחריות בלבד. אסור להעתיק, לשכפל או להפיץ תכנים מהאתר ללא אישור
            מפורש בכתב.
          </p>

          <h4 className="mb-3 mt-6 text-lg">התנהגות משתמשים</h4>
          <p className="leading-relaxed text-secondary">
            אסור להשתמש באתר בצורה שעלולה לפגוע, להשבית או לפגום בתפקוד האתר, או להפריע לשימוש של משתמשים אחרים.
          </p>

          <h4 className="mb-3 mt-6 text-lg">שינויים בתנאים</h4>
          <p className="leading-relaxed text-secondary">
            אנו שומרים את הזכות לשנות תנאי שימוש אלו בכל עת. המשך השימוש באתר לאחר שינויים מהווה הסכמה לתנאים
            המעודכנים.
          </p>

          <h4 className="mb-3 mt-6 text-lg">הגבלת אחריות</h4>
          <p className="leading-relaxed text-secondary">
            האתר מסופק כפי שהוא. אנו לא נושאים באחריות לכל נזק ישיר או עקיף הנובע משימוש באתר.
          </p>
        </div>
      </section>
    </div>
  );
}

function CopyrightContent({ language }: { language: Language }) {
  if (language === "en") {
    return (
      <div className="space-y-6">
        <section>
          <h3 className="mb-4 text-xl">Copyright</h3>

          <div className="space-y-4">
            <p className="leading-relaxed text-secondary">© 2026 Tammy and Ronen Izhaki. All rights reserved.</p>
            <p className="leading-relaxed text-secondary">
              All content on this website, including text, images, videos, graphic design, and logo, is the exclusive
              property of Tammy and Ronen Izhaki and is protected under international and Israeli copyright laws.
            </p>
            <p className="leading-relaxed text-secondary">
              You may not copy, reproduce, distribute, transmit, publicly display, perform, publish, license, or make
              any commercial use of any part of the content without obtaining express written permission from the
              owners.
            </p>
            <p className="leading-relaxed text-secondary">
              For commercial use, licensing, or copyright inquiries, please contact{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-xl">זכויות יוצרים</h3>

        <div className="space-y-4">
          <p className="leading-relaxed text-secondary">© 2026 תמי ורונן יצחקי. כל הזכויות שמורות.</p>
          <p className="leading-relaxed text-secondary">
            כל התכנים באתר זה, כולל טקסטים, תמונות, סרטונים, עיצוב גרפי ולוגו, הם רכושם הבלעדי של תמי ורונן יצחקי
            ומוגנים על פי חוקי זכויות יוצרים בינלאומיים וישראליים.
          </p>
          <p className="leading-relaxed text-secondary">
            אין להעתיק, לשכפל, להפיץ, לשדר, להציג בפומבי, לבצע, לפרסם, לרשות או לעשות כל שימוש מסחרי בכל חלק
            מהתכנים ללא קבלת אישור מפורש בכתב מהבעלים.
          </p>
          <p className="leading-relaxed text-secondary">
            לשימוש מסחרי, לרישיון או לפניות בנושא זכויות יוצרים, אנא צרו קשר בכתובת{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
