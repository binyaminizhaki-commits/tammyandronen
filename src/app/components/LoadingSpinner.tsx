import { motion } from "motion/react";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent" />
      </motion.div>
    </div>
  );
}
