import { motion } from "motion/react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../translations/useTranslation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const addressValue = "האוניברסיטה העברית, קמפוס ספרא, בניין הספרייה הישנה, ירושלים";
const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=%D7%94%D7%90%D7%95%D7%A0%D7%99%D7%91%D7%A8%D7%A1%D7%99%D7%98%D7%94+%D7%94%D7%A2%D7%91%D7%A8%D7%99%D7%AA+%D7%A7%D7%9E%D7%A4%D7%95%D7%A1+%D7%A1%D7%A4%D7%A8%D7%90+%D7%91%D7%A0%D7%99%D7%99%D7%9F+%D7%94%D7%A1%D7%A4%D7%A8%D7%99%D7%99%D7%94+%D7%94%D7%99%D7%A9%D7%A0%D7%94+%D7%99%D7%A8%D7%95%D7%A9%D7%9C%D7%99%D7%9D";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function Contact() {
  const { t, language } = useTranslation();
  const { isRTL } = useLanguage();
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const copy =
    language === "he"
      ? {
          contactDescription: "השאירו הודעה ונחזור אליכם בהקדם.",
          navigationTitle: "ניווט האתר",
          formTitle: "שלחו הודעה",
          submitLabel: "שליחת הודעה",
          submittingLabel: "שולח...",
          invalidEmail: "נא להזין כתובת דוא\"ל תקינה.",
          success: "ההודעה נשלחה ונשמרה בהצלחה.",
          fallbackError: "אירעה שגיאה בשליחת ההודעה. נסו שוב מאוחר יותר.",
        }
      : {
          contactDescription: "Leave a message and we will get back to you soon.",
          navigationTitle: "Site navigation",
          formTitle: "Send a message",
          submitLabel: "Send message",
          submittingLabel: "Sending...",
          invalidEmail: "Please enter a valid email address.",
          success: "Your message was sent successfully.",
          fallbackError: "There was a problem sending your message. Please try again later.",
        };

  const quickLinks = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.tammyRonen, path: "/tammy-ronen" },
    { label: t.nav.studio, path: "/studio" },
    { label: t.nav.residency, path: "/residency" },
    { label: t.nav.contact, path: "/contact" },
  ];

  const contactItems = [
    {
      title: t.contact.info.email,
      value: "tammykleinman@gmail.com",
      href: "mailto:tammykleinman@gmail.com",
      icon: Mail,
    },
    {
      title: t.contact.info.phone,
      value: "050-6262730",
      href: "tel:+972506262730",
      icon: Phone,
    },
    {
      title: t.contact.info.address,
      value: addressValue,
      href: mapUrl,
      icon: MapPin,
    },
  ];

  const handleChange = (field: keyof ContactFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();
    const payload = {
      name: formData.name.trim(),
      email: normalizedEmail,
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      pageUrl: window.location.href,
    };

    setSuccessMessage("");
    setErrorMessage("");

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setErrorMessage(copy.invalidEmail);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || copy.fallbackError);
      }

      setFormData(initialFormState);
      setSuccessMessage(copy.success);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.fallbackError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <UnifiedBackground />
      <Navigation />

      <div className="mx-auto max-w-7xl space-y-16 px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={isRTL ? "space-y-4 text-right" : "space-y-4 text-left"}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl">{t.contact.title}</h1>
          <p className="max-w-3xl text-xl leading-relaxed text-secondary">{copy.contactDescription}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            const isAddress = item.icon === MapPin;

            return (
              <motion.a
                key={item.title}
                href={item.href}
                target={isAddress ? "_blank" : undefined}
                rel={isAddress ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`rounded-[1.75rem] border border-black/8 bg-white/70 p-6 shadow-lg shadow-stone-200/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div className="space-y-4">
                  <Icon className="h-9 w-9 text-accent" />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-light">{item.title}</h2>
                    <p className="text-base leading-relaxed text-secondary">{item.value}</p>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] border border-black/8 bg-white/68 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
          >
            <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
              <h2 className="text-4xl">{copy.navigationTitle}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="rounded-2xl border border-black/8 bg-white/85 px-5 py-4 text-base text-foreground transition-all duration-300 hover:border-accent/35 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] border border-black/8 bg-white/68 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
          >
            <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
              <div className="space-y-3">
                <h2 className="text-4xl">{copy.formTitle}</h2>
                <p className="text-lg leading-relaxed text-secondary">{t.contact.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange("name")}
                    required
                    placeholder={t.contact.form.name}
                    className={`w-full rounded-2xl border border-black/10 bg-white/85 px-5 py-4 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    required
                    placeholder={t.contact.form.email}
                    className={`w-full rounded-2xl border border-black/10 bg-white/85 px-5 py-4 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    placeholder={t.contact.form.phone}
                    className={`w-full rounded-2xl border border-black/10 bg-white/85 px-5 py-4 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  />
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={handleChange("subject")}
                    placeholder={t.contact.form.subject}
                    className={`w-full rounded-2xl border border-black/10 bg-white/85 px-5 py-4 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  />
                </div>

                <textarea
                  value={formData.message}
                  onChange={handleChange("message")}
                  required
                  rows={6}
                  placeholder={t.contact.form.message}
                  className={`w-full rounded-[1.5rem] border border-black/10 bg-white/85 px-5 py-4 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? copy.submittingLabel : copy.submitLabel}
                </button>

                {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
                {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
              </form>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
