import { Link } from "react-router";
import { motion } from "motion/react";
import { ScrollIndicator } from "../components/ScrollIndicator";
import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { ArrowLeft, ChevronDown, Zap, Heart, Star } from "lucide-react";
import logo from "../../assets/538b7bcd41901d2112ea7835b15e0f5512afe10a.png";
import { PartnerLogosSection } from "../components/PartnerLogosSection";
import { EventsShowcase } from "../components/events/EventsShowcase";
import { useTranslation } from "../translations/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ResponsiveImageGrid } from "../components/media/ResponsiveImageGrid";
import { getGroupsBySection } from "../data/siteImages";
import { useEvents } from "../events/useEvents";

// Import institution logos
import choreographers from "../../assets/90199beb5a874cc4fa092a81d81d32b6075a164d.png";
import mafal from "../../assets/bd74627b310de222d4c9dd78f511e837cc276f00.png";
import jerusalem from "../../assets/623f68a5851b1bb80dc2fea7371524231acd3062.png";
import dance_library from "../../assets/473fdb91f99c12360650b37404dd18d498ee9d0b.png";
import culture_sports from "../../assets/4675ffc0c75efe2ccec5fff8629c20aac74e5340.png";
import music_academy from "../../assets/2ed1fb418b05cdef3af5a22bed5117c42038abca.png";

const partnerLogos = [
  { src: choreographers, alt: "קוריאוגרפים", width: 180 },
  { src: mafal, alt: "מפעל הפיס", width: 140 },
  { src: jerusalem, alt: "עיריית ירושלים - שווה לחיות", width: 160 },
  { src: dance_library, alt: "מרכז ידועים לביבליוגרפיה על אביב ומוזאון", width: 140 },
  { src: culture_sports, alt: "משרד התרבות והספורט", width: 160 },
  { src: music_academy, alt: "האקדמיה למוסיקה ולמחול בירושלים", width: 140 },
];

export function Home() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const upcomingEvents = useEvents();
  const archiveEvents = useEvents({ archive: true, limit: 3 });
  const galleryLabels = {
    openGallery: t.gallery.openGallery,
    images: t.gallery.images,
    previousImage: t.gallery.previousImage,
    nextImage: t.gallery.nextImage,
  };
  const studioPreviewAssets = getGroupsBySection("studio", "studioArchive")[0]?.assets.slice(0, 3) ?? [];
  const [studioHeroAsset, studioAudienceAsset, studioPatioAsset] = studioPreviewAssets;
  const hasStudioPreviewCollage = Boolean(studioHeroAsset && studioAudienceAsset && studioPatioAsset);
  const shouldShowEventsFallback =
    !upcomingEvents.loading && !upcomingEvents.error && upcomingEvents.events.length === 0;

  const features = [
    { 
      icon: Zap,
      title: t.home.features.unique.title, 
      description: t.home.features.unique.description,
      gradient: "from-amber-500/20 to-yellow-500/10"
    },
    { 
      icon: Heart,
      title: t.home.features.heritage.title, 
      description: t.home.features.heritage.description,
      gradient: "from-rose-500/20 to-pink-500/10"
    },
    { 
      icon: Star,
      title: t.home.features.innovation.title, 
      description: t.home.features.innovation.description,
      gradient: "from-blue-500/20 to-cyan-500/10"
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Unified Background */}
      <UnifiedBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <section id="main-content" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Simplified Background - no animations */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div
            className="absolute left-1/2 top-[18%] h-[62vw] w-[62vw] max-h-96 max-w-96 -translate-x-1/2 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(200, 169, 106, 0.08) 0%, rgba(200, 169, 106, 0.02) 100%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-[16%] left-1/2 h-[54vw] w-[54vw] max-h-80 max-w-80 -translate-x-1/2 rounded-full"
            style={{
              background: "linear-gradient(225deg, rgba(119, 119, 119, 0.05) 0%, rgba(119, 119, 119, 0.01) 100%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            
          </motion.div>

          {/* Main Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center mb-16"
          >
            <motion.img
              src={logo}
              alt="האולכין - בית למחול"
              className="w-80 md:w-[500px] lg:w-[600px] h-auto select-none drop-shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              animate={{
                filter: [
                  "drop-shadow(0 10px 30px rgba(200, 169, 106, 0.2))",
                  "drop-shadow(0 10px 50px rgba(200, 169, 106, 0.4))",
                  "drop-shadow(0 10px 30px rgba(200, 169, 106, 0.2))",
                ],
              }}
              style={{
                animationDuration: "4s",
                animationIterationCount: "infinite",
              }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl md:text-3xl text-secondary max-w-3xl mx-auto mb-16 leading-relaxed px-4"
          >
            {t.home.heroSubtitle}
            <br />
            {t.home.heroSubtitle2}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link to="/studio">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(200, 169, 106, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-accent text-white rounded-full font-medium shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
              >
                <span>{t.home.discoverStudio}</span>
                <ArrowLeft className={`w-5 h-5 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
              </motion.button>
            </Link>
            <Link to="/tammy-ronen">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/40 backdrop-blur-xl border border-black/10 rounded-full font-medium hover:bg-white/60 hover:border-accent/30 transition-all duration-300"
              >
                {t.home.meetFounders}
              </motion.button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className={`group relative p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-black/5 hover:border-accent/30 hover:shadow-2xl transition-all duration-500 overflow-hidden`}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-500"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8 text-accent" />
                    </motion.div>
                    <h3 className="text-2xl font-light mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-secondary leading-relaxed">{feature.description}</p>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-sm text-secondary">{t.home.scrollDown}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-accent" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="relative overflow-hidden py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-5xl md:text-6xl font-light"><span className="font-bold">{t.home.about.title1}</span><span className="text-accent"><span className="font-bold">{t.home.about.title2}</span></span></h2>
              <p className="text-xl text-secondary leading-relaxed">
                {t.home.about.paragraph1}
              </p>
              <p className="text-xl text-secondary leading-relaxed">
                {t.home.about.paragraph2}
              </p>
              <div className="pt-4">
                <Link to="/studio">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border-2 border-accent text-accent rounded-full font-medium hover:bg-accent hover:text-white transition-all duration-300"
                  >
                    {t.home.about.readMore}
                  </motion.button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-5 rounded-[2.25rem] border border-black/6 bg-white/60 p-6 shadow-2xl shadow-stone-200/25 backdrop-blur-xl"
              >
                <div className={`flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="inline-flex rounded-full border border-accent/25 bg-white/85 px-4 py-2 text-xs font-medium tracking-[0.2em] text-accent uppercase">
                    {t.gallery.archivePreview}
                  </span>
                  <Link
                    to="/studio"
                    className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    {t.home.discoverStudio}
                  </Link>
                </div>

                <Link to="/studio" className="group block" aria-label={t.home.discoverStudio}>
                  {hasStudioPreviewCollage ? (
                    <div className="grid gap-3">
                      <div className="overflow-hidden rounded-[1.9rem] border border-black/8 bg-stone-100/80 shadow-lg shadow-stone-200/25">
                        <ImageWithFallback
                          src={studioHeroAsset.src}
                          alt={studioHeroAsset.altHe}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {[studioAudienceAsset, studioPatioAsset].map((asset) => (
                          <div
                            key={asset.id}
                            className="overflow-hidden rounded-[1.6rem] border border-black/8 bg-stone-100/80 shadow-md shadow-stone-200/20"
                          >
                            <ImageWithFallback
                              src={asset.src}
                              alt={asset.altHe}
                              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ResponsiveImageGrid
                      assets={studioPreviewAssets}
                      dialogTitle={t.gallery.archivePreview}
                      labels={galleryLabels}
                      interactive={false}
                      emphasizeFirst
                      showCaptions={false}
                    />
                  )}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {shouldShowEventsFallback ? (
        <EventsShowcase
          mode="home"
          upcoming={upcomingEvents.events}
          archive={archiveEvents.events}
          upcomingLoading={upcomingEvents.loading}
          upcomingError={upcomingEvents.error}
          archiveLoading={archiveEvents.loading}
          archiveError={archiveEvents.error}
        />
      ) : null}

      {/* CTA Section */}
      <section className="relative overflow-hidden py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-5xl md:text-6xl font-light">
            {t.home.cta.title1}<span className="text-accent">{t.home.cta.title2}</span>
          </h2>
          <p className="text-xl text-secondary leading-relaxed max-w-2xl mx-auto">
            {t.home.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/residency">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(200, 169, 106, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-accent text-white rounded-full font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {t.home.cta.applyResidency}
              </motion.button>
            </Link>
            <Link to="/studio">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/40 backdrop-blur-xl border border-black/10 rounded-full font-medium hover:bg-white/60 hover:border-accent/30 transition-all duration-300"
              >
                {t.home.cta.discoverStudio}
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Background Decoration */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[82vw] w-[82vw] max-h-[600px] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(200, 169, 106, 0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </section>

      <section className="relative px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <PartnerLogosSection />
        </motion.div>
      </section>

      <ScrollIndicator />
    </div>
  );
}
