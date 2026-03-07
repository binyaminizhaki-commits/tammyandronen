import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../../assets/archive_black_shakoof_full.png";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "../translations/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

export function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = isRTL
    ? [
        { label: t.nav.home, path: "/" },
        { label: t.nav.tammyRonen, path: "/tammy-ronen" },
        { label: "הארכיון", path: "/studio" },
        { label: t.nav.residency, path: "/residency" },
        { label: t.nav.contact, path: "/contact" },
      ]
    : [
        { label: t.nav.home, path: "/" },
        { label: t.nav.tammyRonen, path: "/tammy-ronen" },
        { label: "Archive", path: "/studio" },
        { label: t.nav.residency, path: "/residency" },
        { label: t.nav.contact, path: "/contact" },
      ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const menuLabel = isRTL ? "תפריט" : "Menu";
  const closeMenuLabel = isRTL ? "סגור" : "Close";

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
      <div className="md:hidden px-4 pt-4">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-black/10 bg-background/70 px-4 py-3 shadow-lg backdrop-blur-xl ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <LanguageToggle />
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent/30 hover:text-accent ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-site-nav"
            aria-label={isMobileMenuOpen ? closeMenuLabel : menuLabel}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span>{isMobileMenuOpen ? closeMenuLabel : menuLabel}</span>
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          {isMobileMenuOpen ? (
            <motion.div
              id="mobile-site-nav"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[2rem] border border-black/10 bg-background/80 shadow-xl backdrop-blur-xl"
            >
              <div className="grid gap-2 p-3">
                <Link
                  to="/"
                  className="flex items-center justify-center rounded-[1.5rem] border border-black/6 bg-white/75 p-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src={logo} alt="ארכיון ריקודים" className="h-10 w-auto" />
                </Link>

                {navItems.map((item) => (
                  <MobileNavItem
                    key={item.path}
                    item={item}
                    isActive={location.pathname === item.path}
                    onSelect={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
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

interface MobileNavItemProps {
  item: {
    label: string;
    path: string;
  };
  isActive: boolean;
  onSelect: () => void;
}

function MobileNavItem({ item, isActive, onSelect }: MobileNavItemProps) {
  return (
    <Link to={item.path} className="block" onClick={onSelect}>
      <div
        className={`flex min-h-11 items-center justify-center rounded-[1.5rem] px-4 py-3 text-sm font-medium transition-all duration-300 ${
          isActive
            ? "bg-accent/12 text-accent ring-1 ring-accent/20"
            : "bg-white/70 text-foreground/85 hover:bg-white/90 hover:text-accent"
        }`}
      >
        {item.label}
      </div>
    </Link>
  );
}
