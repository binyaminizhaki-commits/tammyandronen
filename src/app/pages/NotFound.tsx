import { Link } from "react-router";
import { motion } from "motion/react";
import { Home } from "lucide-react";
import { useTranslation } from "../translations/useTranslation";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-light text-accent mb-4">{t.notFound.title}</h1>
          <h2 className="text-4xl font-light text-primary mb-4">{t.notFound.subtitle}</h2>
          <p className="text-xl text-secondary leading-relaxed">
            {t.notFound.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-full font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              <span>{t.notFound.backHome}</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(200, 169, 106, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
