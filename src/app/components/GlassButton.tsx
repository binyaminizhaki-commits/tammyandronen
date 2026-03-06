import { motion } from "motion/react";
import { ReactNode, useState } from "react";

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export function GlassButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
}: GlassButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyles = {
    primary: {
      background: isHovered ? "rgba(200, 169, 106, 0.15)" : "rgba(255, 255, 255, 0.5)",
      borderColor: isHovered ? "rgba(200, 169, 106, 0.6)" : "rgba(200, 169, 106, 0.3)",
      textColor: isHovered ? "#C8A96A" : "#111111",
      shadow: isHovered
        ? "0 12px 40px rgba(200, 169, 106, 0.3)"
        : "0 6px 24px rgba(200, 169, 106, 0.15)",
    },
    secondary: {
      background: isHovered ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.4)",
      borderColor: isHovered ? "rgba(17, 17, 17, 0.15)" : "rgba(17, 17, 17, 0.08)",
      textColor: isHovered ? "#111111" : "#777777",
      shadow: isHovered
        ? "0 8px 32px rgba(0, 0, 0, 0.08)"
        : "0 4px 20px rgba(0, 0, 0, 0.04)",
    },
  };

  const styles = buttonStyles[variant];

  const ButtonContent = (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl cursor-pointer ${className}`}
    >
      <motion.div
        className="px-8 py-4 backdrop-blur-xl border transition-all duration-500"
        style={{
          background: styles.background,
          borderColor: styles.borderColor,
          boxShadow: styles.shadow,
        }}
      >
        <motion.div
          animate={{ color: styles.textColor }}
          transition={{ duration: 0.3 }}
          className="text-center tracking-wide"
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            variant === "primary"
              ? "radial-gradient(circle at center, rgba(200, 169, 106, 0.2) 0%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(17, 17, 17, 0.05) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {ButtonContent}
      </a>
    );
  }

  return ButtonContent;
}
