import { motion, useScroll } from "motion/react";

export function FloatingSidebar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-1 bg-accent/10 z-50"
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "0%",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
    </motion.div>
  );
}
