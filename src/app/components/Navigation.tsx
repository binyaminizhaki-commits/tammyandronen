import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import logo from "../../assets/archive_black_shakoof_full.png";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../translations/useTranslation";
import { LanguageToggle } from "./LanguageToggle";

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
        { label: "אירועים", path: "/events" },
        { label: t.nav.residency, path: "/residency" },
        { label: t.nav.contact, path: "/contact" },
      ]
    : [
        { label: t.nav.home, path: "/" },
        { label: t.nav.tammyRonen, path: "/tammy-ronen" },
        { label: "Archive", path: "/studio" },
        { label: "Events", path: "/events" },
        { label: t.nav.residency, path: "/residency" },
        { label: t.nav.contact, path: "/contact" },
      ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const menuLabel = isRTL ? "תפריט" : "Menu";
  const closeMenuLabel = isRTL ? "סגור" : "Close";
  const desktopLeft = isRTL ? <LanguageToggle /> : <SiteLogo />;
  const desktopRight = isRTL ? <SiteLogo /> : <LanguageToggle />;

  return (
    <motion.nav
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 overflow-hidden border-b border-black/8 bg-white/36 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,255,255,0.18))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/6" />

      <div className="relative hidden items-center gap-6 px-6 py-3 md:grid md:grid-cols-[12rem_minmax(0,1fr)_12rem] xl:px-8">
        <div className="flex items-center">{desktopLeft}</div>

        <div className="flex items-center justify-center gap-7">
          {navItems.map((item, index) => (
            <NavItem
              key={item.path}
              item={item}
              index={index}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        <div className="flex items-center justify-end">{desktopRight}</div>
      </div>

      <div
        className={cn(
          "relative flex items-center justify-between gap-3 px-4 py-3 md:hidden",
          isRTL ? "flex-row-reverse" : "",
        )}
      >
        <SiteLogo />

        <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
          <LanguageToggle className="px-2.5" />
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 border border-white/55 bg-white/42 px-3 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-xl transition-colors hover:bg-white/58",
              isRTL ? "flex-row-reverse" : "",
            )}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-site-nav"
            aria-label={isMobileMenuOpen ? closeMenuLabel : menuLabel}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span>{isMobileMenuOpen ? closeMenuLabel : menuLabel}</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isMobileMenuOpen ? (
          <motion.div
            id="mobile-site-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative overflow-hidden border-t border-white/45 bg-white/46 backdrop-blur-2xl md:hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.48),rgba(255,255,255,0.18))]" />
            <div className="grid gap-1 px-4 py-3">
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
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
      className="relative"
    >
      <Link
        to={item.path}
        className={cn(
          "relative inline-flex items-center justify-center px-1 py-2 text-sm font-medium text-foreground/74 transition-colors duration-200 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
          isActive ? "text-foreground" : "",
        )}
      >
        <span className={cn("relative inline-flex items-center pb-0.5", mobile ? "text-xs" : "")}>
          <span>{item.label}</span>
          {isActive ? (
            <motion.span
              layoutId="site-nav-indicator"
              className="absolute inset-x-0 -bottom-[11px] h-0.5 bg-accent"
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
            />
          ) : null}
        </span>
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
        className={cn(
          "flex min-h-11 items-center justify-between border-b border-black/8 px-1 py-3 text-sm font-medium transition-colors duration-200",
          isActive ? "text-foreground" : "text-foreground/76 hover:text-foreground",
        )}
      >
        <span>{item.label}</span>
        {isActive ? <span className="h-1.5 w-1.5 bg-accent" /> : null}
      </div>
    </Link>
  );
}

function SiteLogo() {
  return (
    <Link
      to="/"
      className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <img src={logo} alt="הארכיון - בית למחול" className="h-11 w-auto md:h-12" />
    </Link>
  );
}
