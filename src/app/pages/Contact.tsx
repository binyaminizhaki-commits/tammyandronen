import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../translations/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

export function Contact() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const mapQuery = encodeURIComponent("Hebrew University Safra Campus Old Library Building Jerusalem");
  const mapEmbedSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const mapDirectionsHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert(isRTL ? "תודה על פנייתך! ניצור איתך קשר בהקדם." : "Thank you for reaching out! We'll contact you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-24">
      <UnifiedBackground />
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h1 className="text-6xl md:text-7xl">{t.contact.title}</h1>
          <p className="text-xl text-secondary max-w-2xl leading-relaxed">
            {t.contact.subtitle}
          </p>
        </motion.section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm text-secondary">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                  placeholder={t.contact.form.name}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-secondary">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm text-secondary">
                  {t.contact.form.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                  placeholder="050-1234567"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm text-secondary">
                  {t.contact.form.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                  placeholder={t.contact.form.subject}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm text-secondary">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-6 py-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300 resize-none"
                  placeholder={t.contact.form.message}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full px-8 py-4 bg-accent text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? (isRTL ? "׳©׳•׳׳—..." : "Sending...") : t.contact.form.send}</span>
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.section>

          {/* Contact Info */}
          <motion.section
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <ContactInfoCard
                icon={<Phone className="w-6 h-6 text-accent" />}
                title={t.contact.info.phone}
                content="050-6262730"
                isRTL={isRTL}
              />
              <ContactInfoCard
                icon={<Mail className="w-6 h-6 text-accent" />}
                title={t.contact.info.email}
                content="tammykleinman@gmail.com"
                isRTL={isRTL}
              />
              <ContactInfoCard
                icon={<MapPin className="w-6 h-6 text-accent" />}
                title={t.contact.info.address}
                content={t.contact.addressValue}
                isRTL={isRTL}
              />
            </div>

            {/* Interactive Map */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-black/10 bg-white/70 backdrop-blur-sm relative">
                <iframe
                  title={isRTL ? "׳׳₪׳× ׳׳™׳§׳•׳ - ׳׳¨׳›׳™׳•׳ ׳¨׳™׳§׳•׳“׳™׳" : "Location map - Dance Archive"}
                  src={mapEmbedSrc}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href={mapDirectionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-md ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <MapPin className="w-4 h-4" />
                <span>{isRTL ? "׳₪׳×׳— ׳‘׳׳₪׳•׳× Google" : "Open in Google Maps"}</span>
              </a>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  isRTL: boolean;
}

function ContactInfoCard({ icon, title, content, isRTL }: ContactInfoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ x: isRTL ? -6 : 6 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          borderColor: isHovered ? "rgba(200, 169, 106, 0.4)" : "rgba(17, 17, 17, 0.08)",
          boxShadow: isHovered
            ? "0 8px 30px rgba(200, 169, 106, 0.2)"
            : "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={`flex items-start gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-primary">{title}</h3>
            <p className="text-secondary text-sm leading-relaxed">{content}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

