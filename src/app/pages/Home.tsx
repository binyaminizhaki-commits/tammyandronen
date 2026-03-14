import { motion } from "motion/react";

import logo from "../../assets/538b7bcd41901d2112ea7835b15e0f5512afe10a.png";
import { Navigation } from "../components/Navigation";
import { PartnerLogosSection } from "../components/PartnerLogosSection";
import { UnifiedBackground } from "../components/UnifiedBackground";

export function Home() {
  return (
    <div className="relative min-h-screen pt-20 md:pt-24">
      <UnifiedBackground />
      <Navigation />

      <section
        id="main-content"
        className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-6 py-16 md:py-20"
      >
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

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center md:gap-12">
          <motion.img
            src={logo}
            alt="הארכיון - בית למחול"
            className="h-auto w-[min(80vw,33rem)] select-none md:w-[min(62vw,42rem)] lg:w-[44rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.018 }}
            transition={{ duration: 0.8, delay: 0.15, scale: { duration: 0.18, ease: "easeOut" } }}
          />

          <PartnerLogosSection
            variant="bare"
            className="w-full max-w-5xl border-t border-black/8 pt-6 md:pt-8"
          />
        </div>
      </section>
    </div>
  );
}
