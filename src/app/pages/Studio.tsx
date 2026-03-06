import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { motion } from "motion/react";
import { Maximize2, Sparkles, Volume2, Video, Users, Home, Coffee } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../translations/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

export function Studio() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const studioSpecs = [
    {
      icon: Maximize2,
      title: t.studio.specs.size.title,
      description: t.studio.specs.size.description,
    },
    {
      icon: Sparkles,
      title: t.studio.specs.floor.title,
      description: t.studio.specs.floor.description,
    },
    {
      icon: Volume2,
      title: t.studio.specs.sound.title,
      description: t.studio.specs.sound.description,
    },
    {
      icon: Video,
      title: t.studio.specs.lighting.title,
      description: t.studio.specs.lighting.description,
    },
    {
      icon: Sparkles,
      title: t.studio.specs.mirrors.title,
      description: t.studio.specs.mirrors.description,
    },
    {
      icon: Users,
      title: t.studio.specs.equipment.title,
      description: t.studio.specs.equipment.description,
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
          <h1 className="text-6xl md:text-7xl">{t.studio.title}</h1>

          {/* Hero Image Placeholder */}
          <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-gradient-to-br from-accent/20 to-secondary/10 backdrop-blur-sm border border-black/5 relative">
            <div className="absolute inset-0 flex items-center justify-center text-secondary/30 text-lg">
              {t.studio.galleryPlaceholder}
            </div>
          </div>
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`max-w-4xl mx-auto space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <p className="text-xl text-secondary leading-relaxed">
            {t.studio.paragraph1}
          </p>
          <p className="text-xl text-secondary leading-relaxed">
            {t.studio.paragraph2}
          </p>
          <p className="text-xl text-secondary leading-relaxed">
            {t.studio.paragraph3}
          </p>
        </motion.section>

        {/* Gallery Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <h2 className="text-5xl text-center">{t.studio.gallery}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <GalleryItem key={index} index={index} t={t} />
            ))}
          </div>
        </motion.section>

        {/* Specs Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <h2 className="text-5xl text-center">{t.studio.facilities}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studioSpecs.map((spec, index) => (
              <SpecCard key={index} spec={spec} index={index} />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

interface GalleryItemProps {
  index: number;
  t: any;
}

function GalleryItem({ index, t }: GalleryItemProps) {
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
          {t.studio.galleryPlaceholder} {index}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface SpecCardProps {
  spec: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  };
  index: number;
}

function SpecCard({ spec, index }: SpecCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = spec.icon;
  const { isRTL } = useLanguage();

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
        className="p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 h-full"
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
          <h4 className="text-lg font-semibold">{spec.title}</h4>
          <p className="text-sm text-secondary leading-relaxed">
            {spec.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
