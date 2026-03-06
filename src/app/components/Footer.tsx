import { useState } from "react";
import { X, Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

type LegalSection = "general" | "privacy" | "terms" | "copyright" | null;

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const quickLinks = [
  { label: "בית", path: "/" },
  { label: "תמי ורונן", path: "/tammy-ronen" },
  { label: "סטודיו", path: "/studio" },
  { label: "רזידנסי", path: "/residency" },
  { label: "צור קשר", path: "/contact" },
];

export function Footer() {
  const [activeSection, setActiveSection] = useState<LegalSection>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert("תודה על ההרשמה לניוזלטר!");
    setEmail("");
  };

  return (
    <>
      <footer className="footer-shell relative z-20 isolate mt-32 border-t border-[var(--footer-border)] text-[var(--footer-text)] opacity-100">

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* About Section */}
            <div className="space-y-4" dir="rtl">
              <h3 className="text-xl font-light mb-4 text-[var(--footer-text)]">ארכיון ריקודים</h3>
              <p className="text-sm text-[var(--footer-muted)] leading-relaxed">
                שימור ותיעוד מורשת המחול הישראלי והעולמי באמצעות טכנולוגיה דיגיטלית מתקדמת
              </p>
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-[var(--footer-surface)] border border-[var(--footer-border)] flex items-center justify-center text-[var(--footer-text)] hover:bg-[var(--footer-link-hover)] hover:text-[var(--footer-bg)] hover:border-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4" dir="rtl">
              <h3 className="text-xl font-light mb-4 text-[var(--footer-text)]">קישורים מהירים</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={link.path}
                      className="text-sm text-[var(--footer-link)] visited:text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] transition-colors inline-block rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4" dir="rtl">
              <h3 className="text-xl font-light mb-4 text-[var(--footer-text)]">יצירת קשר</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-[var(--footer-muted)]">
                  <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                  <span>האוניברסיטה העברית, קמפוס ספרא, בניין הספרייה הישנה, ירושלים</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Phone className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                  <a href="tel:+972506262730" className="text-[var(--footer-link)] visited:text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] rounded-sm transition-colors">
                    050-6262730
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Mail className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                  <a href="mailto:tammykleinman@gmail.com" className="text-[var(--footer-link)] visited:text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] rounded-sm transition-colors break-all">
                    tammykleinman@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4" dir="rtl">
              <h3 className="text-xl font-light mb-4 text-[var(--footer-text)]">הרשמה לעדכונים</h3>
              <p className="text-sm text-[var(--footer-muted)] mb-4">
                קבלו עדכונים על מופעים, רזידנסים וסדנאות
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="כתובת דוא״ל"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--footer-surface)] border border-[var(--footer-border)] focus:border-[var(--footer-link-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--footer-focus)] transition-all text-sm text-[var(--footer-text)] placeholder:text-[var(--footer-muted)]"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2.5 bg-[var(--footer-link-hover)] text-[var(--footer-bg)] rounded-xl font-medium hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] transition-all text-sm disabled:opacity-50"
                >
                  {isSubmitting ? "שולח..." : "הרשמה"}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Legal Links */}
          <div className="pt-8 border-t border-[var(--footer-border)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <button
                  onClick={() => setActiveSection("general")}
                  className="text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] rounded-sm transition-colors duration-300"
                >
                  כללי
                </button>
                <button
                  onClick={() => setActiveSection("privacy")}
                  className="text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] rounded-sm transition-colors duration-300"
                >
                  מדיניות פרטיות
                </button>
                <button
                  onClick={() => setActiveSection("terms")}
                  className="text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] rounded-sm transition-colors duration-300"
                >
                  תנאי שימוש
                </button>
                <button
                  onClick={() => setActiveSection("copyright")}
                  className="text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-focus)] rounded-sm transition-colors duration-300"
                >
                  זכויות יוצרים
                </button>
              </div>
              <div className="text-sm text-[var(--footer-muted)]">
                © 2026 ארכיון ריקודים. כל הזכויות שמורות.
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setActiveSection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-black/5 px-8 py-6 flex justify-between items-center">
                <h2 className="text-2xl">
                  {activeSection === "general" && "מידע כללי"}
                  {activeSection === "privacy" && "מדיניות פרטיות"}
                  {activeSection === "terms" && "תנאי שימוש"}
                  {activeSection === "copyright" && "זכויות יוצרים"}
                </h2>
                <button
                  onClick={() => setActiveSection(null)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="px-8 py-8 overflow-y-auto max-h-[calc(80vh-100px)] prose prose-lg max-w-none" dir="rtl">
                {activeSection === "general" && <GeneralContent />}
                {activeSection === "privacy" && <PrivacyContent />}
                {activeSection === "terms" && <TermsContent />}
                {activeSection === "copyright" && <CopyrightContent />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GeneralContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl mb-4">פרטי המפעיל</h3>
        <p className="text-secondary leading-relaxed">
          <strong>שם המפעיל:</strong> תמי קליינמן ורונן יצחקי<br />
          <strong>כתובת:</strong> האוניברסיטה העברית, קמפוס ספרא, בניין הספרייה הישנה, ירושלים<br />
          <strong>טלפון:</strong> <a href="tel:+972506262730" className="text-accent hover:underline">050-6262730</a><br />
          <strong>דוא"ל:</strong> <a href="mailto:tammykleinman@gmail.com" className="text-accent hover:underline">tammykleinman@gmail.com</a>
        </p>
      </section>

      <section>
        <h3 className="text-xl mb-4">הצהרת נגישות</h3>
        <p className="text-secondary leading-relaxed mb-4">
          אנו מחויבים להנגשת אתר זה לאנשים עם מוגבלויות, תוך ציות לחוק שוויון זכויות לאנשים עם מוגבלויות, התשנ"ח-1998, ולתקנות הנלוות.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          <strong>רכיב נגישות:</strong> האתר כולל רכיב נגישות המאפשר התאמות חזותיות, שינויי צבע, ניווט במקלדת ותמיכה בקוראי מסך.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          <strong>רמת נגישות:</strong> אנו שואפים לעמוד ברמת AA של תקן WCAG 2.1.
        </p>
      </section>

      <section>
        <h3 className="text-xl mb-4">פרטי רכז/ת נגישות</h3>
        <p className="text-secondary leading-relaxed">
          <strong>שם:</strong> תמי קליינמן<br />
          <strong>טלפון:</strong> <a href="tel:+972506262730" className="text-accent hover:underline">050-6262730</a><br />
          <strong>דוא"ל:</strong> <a href="mailto:tammykleinman@gmail.com" className="text-accent hover:underline">tammykleinman@gmail.com</a>
        </p>
      </section>

      <section>
        <h3 className="text-xl mb-4">נגישות פיזית</h3>
        <p className="text-secondary leading-relaxed">
          המבנה ממוקם בקמפוס ספרא של האוניברסיטה העברית בירושלים, בניין הספרייה הישנה. אנא צרו קשר מראש לתיאום הגעה.
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

function PrivacyContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl mb-4">מדיניות פרטיות / Privacy Policy</h3>
        
        <div className="space-y-4 mb-8">
          <p className="text-secondary leading-relaxed">
            אנו מכבדים את פרטיותך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">איסוף מידע</h4>
          <p className="text-secondary leading-relaxed">
            אנו אוספים מידע שאתה מספק ביודעין דרך טפסי יצירת קשר או בקשה למועמדות. המידע עשוי לכלול: שם, כתובת דוא"ל, מספר טלפון והודעות שאתה שולח אלינו.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">שימוש במידע</h4>
          <p className="text-secondary leading-relaxed">
            אנו משתמשים במידע כדי להגיב לפניותיך, לעבד בקשות למועמדות, לשפר את השירותים שלנו ולשלוח עדכונים רלוונטיים (רק אם נתת הסכמה).
          </p>
          
          <h4 className="text-lg mt-6 mb-3">שיתוף מידע</h4>
          <p className="text-secondary leading-relaxed">
            אנו לא משתפים את המידע האישי שלך עם גורמים שלישיים, למעט כאשר נדרש על פי חוק או כדי להגן על זכויותינו.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">אבטחת מידע</h4>
          <p className="text-secondary leading-relaxed">
            אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע שלך מפני גישה, שינוי או גילוי לא מורשים.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">הזכויות שלך</h4>
          <p className="text-secondary leading-relaxed">
            יש לך את הזכות לבקש גישה למידע האישי שלך, לתקן אותו או למחוק אותו. צור קשר עם רכז הנגישות שלנו לצורך כך.
          </p>
        </div>

        <div className="border-t border-black/10 pt-6 space-y-4" dir="ltr">
          <h4 className="text-lg mb-3">English Version</h4>
          <p className="text-secondary leading-relaxed">
            We respect your privacy. This privacy policy explains how we collect, use, and protect your information.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Information Collection</h5>
          <p className="text-secondary leading-relaxed">
            We collect information you knowingly provide through contact forms or residency applications. This may include: name, email address, phone number, and messages you send us.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Use of Information</h5>
          <p className="text-secondary leading-relaxed">
            We use your information to respond to inquiries, process residency applications, improve our services, and send relevant updates (only with your consent).
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Information Sharing</h5>
          <p className="text-secondary leading-relaxed">
            We do not share your personal information with third parties, except when required by law or to protect our rights.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Data Security</h5>
          <p className="text-secondary leading-relaxed">
            We implement reasonable security measures to protect your information from unauthorized access, alteration, or disclosure.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Your Rights</h5>
          <p className="text-secondary leading-relaxed">
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
        <h3 className="text-xl mb-4">תנאי שימוש / Terms of Use</h3>
        
        <div className="space-y-4 mb-8">
          <p className="text-secondary leading-relaxed">
            ברוכים הבאים לאתר ארכיון הריקוד של תמי קליינמן ורונן יצחקי. השימוש באתר זה כפוף לתנאים הבאים.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">קבלת התנאים</h4>
          <p className="text-secondary leading-relaxed">
            גישה לאתר זה ושימוש בו מהווים את הסכמתך לתנאי שימוש אלו. אם אינך מסכים, אנא הימנע משימוש באתר.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">שימוש מותר</h4>
          <p className="text-secondary leading-relaxed">
            אתה רשאי להשתמש באתר למטרות אישיות ולא מסחריות בלבד. אסור להעתיק, לשכפל או להפיץ תכנים מהאתר ללא אישור מפורש בכתב.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">התנהגות משתמשים</h4>
          <p className="text-secondary leading-relaxed">
            אסור להשתמש באתר בצורה שעלולה לפגוע, להשבית או לפגום בתפקוד האתר, או להפריע לשימוש של משתמשים אחרים.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">שינויים בתנאים</h4>
          <p className="text-secondary leading-relaxed">
            אנו שומרים את הזכות לשנות תנאי שימוש אלו בכל עת. המשך שימוש באתר לאחר שינויים מהווה הסכמה לתנאים המעודכנים.
          </p>
          
          <h4 className="text-lg mt-6 mb-3">הגבלת אחריות</h4>
          <p className="text-secondary leading-relaxed">
            האתר מסופק "כמות שהוא". אנו לא נושאים באחריות לכל נזק ישיר או עקיף הנובע משימוש באתר.
          </p>
        </div>

        <div className="border-t border-black/10 pt-6 space-y-4" dir="ltr">
          <h4 className="text-lg mb-3">English Version</h4>
          <p className="text-secondary leading-relaxed">
            Welcome to the Dance Archive website of Tammy Kleinman and Ronen Izhaki. Use of this site is subject to the following terms.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Acceptance of Terms</h5>
          <p className="text-secondary leading-relaxed">
            Access to and use of this website constitute your acceptance of these terms of use. If you do not agree, please refrain from using the site.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Permitted Use</h5>
          <p className="text-secondary leading-relaxed">
            You may use this site for personal, non-commercial purposes only. You may not copy, reproduce, or distribute content from the site without express written permission.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">User Conduct</h5>
          <p className="text-secondary leading-relaxed">
            You may not use the site in any manner that could damage, disable, or impair the site's functionality or interfere with other users' use.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Changes to Terms</h5>
          <p className="text-secondary leading-relaxed">
            We reserve the right to modify these terms of use at any time. Continued use of the site after changes constitutes acceptance of the updated terms.
          </p>
          
          <h5 className="font-medium mt-4 mb-2">Limitation of Liability</h5>
          <p className="text-secondary leading-relaxed">
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
        <h3 className="text-xl mb-4">זכויות יוצרים / Copyright</h3>
        
        <div className="space-y-4 mb-6">
          <p className="text-secondary leading-relaxed">
            © 2026 תמי קליינמן ורונן יצחקי. כל הזכויות שמורות.
          </p>
          <p className="text-secondary leading-relaxed">
            כל התכנים באתר זה, כולל טקסטים, תמונות, סרטונים, עיצוב גרפי ולוגו, הם רכושם הבלעדי של תמי קליינמן ורונן יצחקי ומוגנים על פי חוקי זכויות יוצרים בינלאומיים וישראליים.
          </p>
          <p className="text-secondary leading-relaxed">
            אין להעתיק, לשכפל, להפיץ, לשדר, להציג בפומבי, לבצע, לפרסם, לרשות או לעשות כל שימוש מסחרי בכל חלק מהתכנים ללא קבלת אישור מפורש בכתב מהבעלים.
          </p>
          <p className="text-secondary leading-relaxed">
            לשימוש מסחרי, לרישיון או לפניות בנושא זכויות יוצרים, אנא צרו קשר בכתובת:{" "}
            <a href="mailto:tammykleinman@gmail.com" className="text-accent hover:underline">
              tammykleinman@gmail.com
            </a>
          </p>
        </div>

        <div className="border-t border-black/10 pt-6 space-y-4" dir="ltr">
          <p className="text-secondary leading-relaxed">
            ֲ© 2026 Tammy Kleinman and Ronen Izhaki. All rights reserved.
          </p>
          <p className="text-secondary leading-relaxed">
            All content on this website, including text, images, videos, graphic design, and logo, is the exclusive property of Tammy Kleinman and Ronen Izhaki and is protected under international and Israeli copyright laws.
          </p>
          <p className="text-secondary leading-relaxed">
            You may not copy, reproduce, distribute, transmit, publicly display, perform, publish, license, or make any commercial use of any part of the content without obtaining express written permission from the owners.
          </p>
          <p className="text-secondary leading-relaxed">
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

