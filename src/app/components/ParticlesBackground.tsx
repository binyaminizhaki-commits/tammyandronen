import { motion } from "motion/react";
import { useMemo } from "react";
import { useIsMobile } from "./ui/use-mobile";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

export function ParticlesBackground() {
  const isMobile = useIsMobile();

  const particles = useMemo(() => {
    const particlesList: Particle[] = [];
    const colors = ["200, 169, 106", "119, 119, 119", "200, 169, 106", "17, 17, 17"];

    for (let i = 0; i < 60; i++) {
      particlesList.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    return particlesList;
  }, []);

  if (isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: `rgba(${particle.color}, ${particle.opacity})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(${particle.color}, ${particle.opacity * 0.8})`,
            willChange: "transform",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(particle.id) * 20, 0],
            scale: [1, 1.2, 1],
            opacity: [particle.opacity * 0.6, particle.opacity, particle.opacity * 0.6],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {particles.slice(0, 15).map((particle, i) => {
        const nextParticle = particles[(i + 3) % particles.length];
        return (
          <motion.svg
            key={`line-${particle.id}`}
            className="absolute inset-0 h-full w-full"
            style={{ willChange: "opacity" }}
          >
            <motion.line
              x1={`${particle.x}%`}
              y1={`${particle.y}%`}
              x2={`${nextParticle.x}%`}
              y2={`${nextParticle.y}%`}
              stroke="rgba(200, 169, 106, 0.1)"
              strokeWidth="0.5"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{
                duration: 8,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.svg>
        );
      })}

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${20 + i * 18}%`,
            top: `${15 + (i % 3) * 30}%`,
            width: 80 + i * 20,
            height: 80 + i * 20,
            background: "radial-gradient(circle, rgba(200, 169, 106, 0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
            willChange: "transform",
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25 + i * 3,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
