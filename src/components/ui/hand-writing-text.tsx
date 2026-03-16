"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface HandWrittenTitleProps {
  title?: string;
  subtitle?: string;
  align?: "center" | "start";
  size?: "default" | "compact";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  scribbleClassName?: string;
}

function HandWrittenTitle({
  title = "Hand Written",
  subtitle = "Optional subtitle",
  align = "center",
  size = "default",
  className,
  titleClassName,
  subtitleClassName,
  scribbleClassName,
}: HandWrittenTitleProps) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
        opacity: { duration: 0.5 },
      },
    },
  };

  const compact = size === "compact";

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-5xl overflow-visible",
        compact ? "py-8 md:py-10" : "py-14 md:py-18",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-0 scale-[1.02] md:scale-[1.04]">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          initial="hidden"
          animate="visible"
          className="h-full w-full"
        >
          <title>KokonutUI</title>
          <motion.path
            d="M 950 90
               C 1250 300, 1050 480, 600 520
               C 250 520, 150 480, 150 300
               C 150 120, 350 80, 600 80
               C 850 80, 950 180, 950 180"
            fill="none"
            strokeWidth={compact ? 10 : 12}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className={cn("opacity-90", scribbleClassName)}
          />
        </motion.svg>
      </div>

      <div
        className={cn(
          "relative z-10 flex flex-col justify-center gap-4",
          align === "center" ? "items-center text-center" : "items-start text-left",
        )}
      >
        <motion.h1
          className={cn(
            "text-balance tracking-tighter text-foreground",
            compact ? "text-4xl md:text-5xl lg:text-6xl" : "text-5xl md:text-6xl lg:text-7xl",
            titleClassName,
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {title}
        </motion.h1>

        {subtitle ? (
          <motion.p
            className={cn(
              "max-w-3xl text-balance leading-relaxed text-secondary",
              compact ? "text-base md:text-lg" : "text-lg md:text-xl",
              subtitleClassName,
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}

export { HandWrittenTitle };
