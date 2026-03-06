import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";
import { useTranslation } from "../translations/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

export function TammyRonen() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

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
          className={`${isRTL ? 'text-right' : 'text-left'} space-y-6 md:space-y-8`}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl">{t.tammyRonen.title}</h1>
          <p className="text-2xl text-secondary max-w-3xl leading-relaxed">
            {t.tammyRonen.subtitle}
          </p>
        </motion.section>

        {/* Bio Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <ProfileCard name="Tammy Kleinman" role="Choreographer & Dancer" index={0} />
          <ProfileCard name="Ronen Snir" role="Choreographer & Dancer" index={1} />
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`max-w-4xl mx-auto space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <p className="text-xl text-secondary leading-relaxed">
            {t.tammyRonen.bio1}
          </p>
          <p className="text-xl text-secondary leading-relaxed">
            {t.tammyRonen.bio2}
          </p>
          <p className="text-xl text-secondary leading-relaxed">
            {t.tammyRonen.bio3}
          </p>
        </motion.section>

        {/* Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl text-center"
          >
            {t.tammyRonen.works}
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <WorkCard key={index} index={index} t={t} />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

interface ProfileCardProps {
  name: string;
  role: string;
  index: number;
}

function ProfileCard({ name, role, index }: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-3xl overflow-hidden backdrop-blur-xl border transition-all duration-500"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          borderColor: isHovered ? "rgba(200, 169, 106, 0.4)" : "rgba(17, 17, 17, 0.08)",
          boxShadow: isHovered
            ? "0 20px 60px rgba(200, 169, 106, 0.2)"
            : "0 8px 30px rgba(0, 0, 0, 0.05)",
        }}
        whileHover={{ y: -10 }}
      >
        {/* Image Placeholder */}
        <div className="aspect-[3/4] bg-gradient-to-br from-accent/20 to-secondary/10 relative">
          <div className="absolute inset-0 flex items-center justify-center text-secondary/30 text-lg">
            {name}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 space-y-2 text-center">
          <h3 className="text-2xl font-light">{name}</h3>
          <p className="text-secondary">{role}</p>
        </div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "radial-gradient(circle at center, rgba(200, 169, 106, 0.1) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

interface WorkCardProps {
  index: number;
  t: any;
}

function WorkCard({ index, t }: WorkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
        className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-secondary/10 backdrop-blur-sm border border-black/5 relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        style={{
          borderColor: isHovered ? "rgba(200, 169, 106, 0.4)" : "rgba(17, 17, 17, 0.05)",
          boxShadow: isHovered
            ? "0 20px 40px rgba(200, 169, 106, 0.2)"
            : "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-secondary/30">
          {t.tammyRonen.worksPlaceholder} {index}
        </div>
      </motion.div>
    </motion.div>
  );
}
