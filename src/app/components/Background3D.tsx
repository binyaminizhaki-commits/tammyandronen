import { motion } from "motion/react";

export function Background3D() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Main gradient orb */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(200, 169, 106, 0.08) 0%, rgba(200, 169, 106, 0.02) 100%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
        style={{
          background:
            "linear-gradient(225deg, rgba(119, 119, 119, 0.05) 0%, rgba(119, 119, 119, 0.01) 100%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-accent/20"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(17, 17, 17, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17, 17, 17, 1) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  );
}
