import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import logo from "../../assets/archive_black_shakoof_full.png";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "../translations/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

export function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const navItems = isRTL
    ? [
        { label: t.nav.home, path: "/" },
        { label: t.nav.tammyRonen, path: "/tammy-ronen" },
        { label: t.nav.studio, path: "/studio" },
        { label: t.nav.residency, path: "/residency" },
        { label: t.nav.contact, path: "/contact" },
      ]
    : [
        { label: t.nav.home, path: "/" },
        { label: t.nav.tammyRonen, path: "/tammy-ronen" },
        { label: t.nav.studio, path: "/studio" },
        { label: t.nav.residency, path: "/residency" },
        { label: t.nav.contact, path: "/contact" },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* Desktop Navigation */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 py-5 items-center">
        <div className="w-44 flex justify-start">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3"
            >
              <img src={logo} alt="ארכיון ריקודים" className="h-12 w-auto" />
            </motion.div>
          </Link>
        </div>

        <div className="flex-1 px-4 flex justify-center">
          <div className="flex w-full max-w-4xl items-center justify-between gap-1.5 bg-background/5 border border-black/10 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-lg">
            {navItems.map((item, index) => (
              <NavItem
                key={item.path}
                item={item}
                index={index}
                isActive={location.pathname === item.path}
              />
            ))}
          </div>
        </div>

        <div className="w-44 flex justify-end">
          <LanguageToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden px-6 pb-4 space-y-3">
        <div className="flex items-center justify-center gap-2 bg-background/5 border border-black/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-lg">
          {navItems.map((item, index) => (
            <NavItem
              key={item.path}
              item={item}
              index={index}
              mobile
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <LanguageToggle />
        </div>
      </div>
    </motion.nav>
  );
}

interface NavItemProps {
  item: {
    label: string;
    path: string;
  };
  index: number;
  mobile?: boolean;
  isActive: boolean;
}

function NavItem({ item, index, mobile, isActive }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative ${mobile ? "" : "flex-1"}`}
    >
      <Link to={item.path} className="block">
        <motion.div
          className={`relative cursor-pointer text-sm font-semibold ${
            mobile ? "px-3 py-2" : "w-full text-center px-4 py-2.5"
          } rounded-full transition-all duration-300 ${
            isActive ? "text-accent" : "text-foreground/80 hover:text-accent"
          }`}
        >
          <span className={mobile ? "text-xs" : ""}>{item.label}</span>

          {isActive && (
            <motion.div
              layoutId="tubelight"
              className="absolute inset-0 w-full bg-accent/5 rounded-full -z-10"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-t-full">
                <div className="absolute w-12 h-6 bg-accent/20 rounded-full blur-md -top-2 -left-2" />
                <div className="absolute w-8 h-6 bg-accent/20 rounded-full blur-md -top-1" />
                <div className="absolute w-4 h-4 bg-accent/20 rounded-full blur-sm top-0 left-2" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
