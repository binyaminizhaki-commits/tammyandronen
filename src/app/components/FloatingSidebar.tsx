import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";

const quotes = [
  { text: "לרקוד זה להיות חי", author: "מרתה גרהם" },
  { text: "המחול הוא שפה נסתרת של הנשמה", author: "מרתה גרהם" },
  { text: "תנועה לא משקרת לעולם", author: "אגנס דה מיל" },
  { text: "לרקוד זה לגלות עולם חדש", author: "פינה באוש" },
];

const choreographers = [
  "אוהד נהרין",
  "בת שבע דה רוטשילד",
  "רמי באר",
  "ליאת דרור",
  "ינאי ורשבסקי",
  "נועה זוק",
];

export function FloatingSidebar() {
  const { scrollYProgress } = useScroll();
  const [currentQuote, setCurrentQuote] = useState(0);

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.6, 0.6, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Right Sidebar - Decorative Typography */}
      <motion.div
        style={{ opacity }}
        className="fixed right-0 top-0 h-screen w-32 pointer-events-none z-40 hidden xl:block"
      >
        {/* Vertical Text */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-1/4 right-8 origin-center"
        >
          <div
            className="text-[120px] font-light text-accent/5 whitespace-nowrap"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              letterSpacing: "0.3em",
            }}
          >
            מחול
          </div>
        </motion.div>

        {/* Decorative Lines */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 right-12 space-y-4"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-px bg-accent/20"
              initial={{ height: 0 }}
              animate={{ height: `${20 + i * 10}px` }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Choreographers Names */}
        <div className="absolute bottom-32 right-6">
          {choreographers.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.15, x: 0 }}
              transition={{ delay: 2 + i * 0.3, duration: 1 }}
              className="text-xs text-secondary font-light mb-3"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              {name}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Left Sidebar - Quotes */}
      <motion.div
        style={{ opacity }}
        className="fixed left-0 top-0 h-screen w-32 pointer-events-none z-40 hidden xl:block"
      >
        {/* Animated Quote */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-1/3 left-8"
        >
          <div className="relative h-64 w-16">
            {quotes.map((quote, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentQuote === i ? 0.4 : 0,
                }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <div
                  className="text-xs font-light text-secondary leading-relaxed"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  "{quote.text}"
                </div>
                <div
                  className="text-[10px] text-accent mt-4"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  — {quote.author}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decorative Circle */}
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-1/4 left-10"
        >
          <motion.div
            className="w-16 h-16 rounded-full border border-accent/20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-4 rounded-full border border-accent/10" />
          </motion.div>
        </motion.div>

        {/* Year Markers */}
        <div className="absolute top-1/2 -translate-y-1/2 left-12 space-y-8">
          {["2020", "2021", "2022", "2023", "2024", "2025"].map((year, i) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.2, x: 0 }}
              transition={{ delay: 1 + i * 0.2, duration: 1 }}
              className="text-[10px] text-accent font-light tracking-wider"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              {year}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Scroll Progress */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-accent/10 z-50"
        style={{
          scaleX: scrollYProgress,
          transformOrigin: "0%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
      </motion.div>
    </>
  );
}
