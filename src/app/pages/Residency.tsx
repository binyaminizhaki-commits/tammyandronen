import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { motion } from "motion/react";
import { Clock, Users, Wrench, Presentation, Sparkles, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../translations/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

export function Residency() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const residencyIncludes = [
    {
      icon: Clock,
      title: t.residency.items.hours.title,
      description: t.residency.items.hours.description,
    },
    {
      icon: Users,
      title: t.residency.items.mentorship.title,
      description: t.residency.items.mentorship.description,
    },
    {
      icon: Wrench,
      title: t.residency.items.equipment.title,
      description: t.residency.items.equipment.description,
    },
    {
      icon: Presentation,
      title: t.residency.items.wip.title,
      description: t.residency.items.wip.description,
    },
    {
      icon: Sparkles,
      title: t.residency.items.performance.title,
      description: t.residency.items.performance.description,
    },
  ];

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
          className={`space-y-12 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h1 className="text-6xl md:text-7xl">{t.residency.title}</h1>
          <p className="text-2xl text-secondary max-w-3xl leading-relaxed">
            {t.residency.subtitle}
          </p>
        </motion.section>

        {/* Main Content */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`max-w-4xl mx-auto space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <p className="text-xl text-secondary leading-relaxed">
            {t.residency.paragraph1}
          </p>
          <p className="text-xl text-secondary leading-relaxed">{t.residency.paragraph2}</p>
          <p className="text-xl text-secondary leading-relaxed">
            {t.residency.paragraph3}
          </p>
        </motion.section>

        {/* What's Included */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <h2 className="text-5xl text-center">{t.residency.includes}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {residencyIncludes.map((item, index) => (
              <IncludeCard key={index} item={item} index={index} />
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative py-20"
        >
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-5xl">{t.residency.apply}</h2>
            <p className="text-xl text-secondary leading-relaxed">
              {t.residency.applyDescription}
            </p>
            <ApplyButton t={t} />
          </div>

          {/* Decorative 3D Element */}
          <motion.div
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(200, 169, 106, 0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.section>

        {/* Additional Info */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`max-w-4xl mx-auto space-y-8 pt-12 border-t border-black/5 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h3 className="text-3xl text-center text-accent">{t.residency.additionalInfo}</h3>
          <div className="space-y-6 text-secondary">
            <div>
              <h4 className="text-lg text-primary mb-2">{t.residency.duration.title}</h4>
              <p className="leading-relaxed">
                {t.residency.duration.description}
              </p>
            </div>
            <div>
              <h4 className="text-lg text-primary mb-2">{t.residency.process.title}</h4>
              <p className="leading-relaxed">
                {t.residency.process.description}
              </p>
            </div>
            <div>
              <h4 className="text-lg text-primary mb-2">{t.residency.cost.title}</h4>
              <p className="leading-relaxed">
                {t.residency.cost.description}
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

interface IncludeCardProps {
  item: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  };
  index: number;
}

function IncludeCard({ item, index }: IncludeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isRTL } = useLanguage();
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 h-full"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          borderColor: isHovered ? "rgba(200, 169, 106, 0.4)" : "rgba(17, 17, 17, 0.08)",
          boxShadow: isHovered
            ? "0 12px 40px rgba(200, 169, 106, 0.2)"
            : "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
        whileHover={{ y: -6 }}
      >
        <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <motion.div
            animate={{
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? 8 : 0,
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <Icon className="w-10 h-10 text-accent" />
          </motion.div>
          <h4 className="text-xl">{item.title}</h4>
          <p className="text-sm text-secondary leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ApplyButtonProps {
  t: any;
}

function ApplyButton({ t }: ApplyButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href="https://forms.gle/example"
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <motion.div
        className="relative px-12 py-5 rounded-2xl backdrop-blur-xl border transition-all duration-500 overflow-hidden group"
        style={{
          background: isHovered
            ? "rgba(200, 169, 106, 0.15)"
            : "rgba(255, 255, 255, 0.5)",
          borderColor: isHovered ? "rgba(200, 169, 106, 0.6)" : "rgba(200, 169, 106, 0.3)",
          boxShadow: isHovered
            ? "0 12px 40px rgba(200, 169, 106, 0.3)"
            : "0 6px 24px rgba(200, 169, 106, 0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-xl tracking-wide"
            animate={{
              color: isHovered ? "#C8A96A" : "#111111",
            }}
            transition={{ duration: 0.3 }}
          >
            {t.residency.applyButton}
          </motion.span>
          <motion.div
            animate={{
              x: isHovered ? 4 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ExternalLink className="w-5 h-5" style={{ color: isHovered ? "#C8A96A" : "#111111" }} />
          </motion.div>
        </div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "radial-gradient(circle at center, rgba(200, 169, 106, 0.2) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </motion.a>
  );
}
