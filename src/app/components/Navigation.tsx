import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import logo from "../../assets/archive_black_shakoof_full.png";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../translations/useTranslation";
import { LanguageToggle } from "./LanguageToggle";

const HEBREW_ARCHIVE_LABEL = "\u05d4\u05d0\u05e8\u05db\u05d9\u05d5\u05df";
const HEBREW_EVENTS_LABEL = "\u05d0\u05d9\u05e8\u05d5\u05e2\u05d9\u05dd";
const HEBREW_MENU_LABEL = "\u05ea\u05e4\u05e8\u05d9\u05d8";
const HEBREW_CLOSE_LABEL = "\u05e1\u05d2\u05d5\u05e8";
const SITE_LOGO_ALT = "\u05d4\u05d0\u05e8\u05db\u05d9\u05d5\u05df - \u05d1\u05d9\u05ea \u05dc\u05de\u05d7\u05d5\u05dc";

export function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.tammyRonen, path: "/tammy-ronen" },
    { label: isRTL ? HEBREW_ARCHIVE_LABEL : "Archive", path: "/studio" },
    { label: isRTL ? HEBREW_EVENTS_LABEL : "Events", path: "/events" },
    { label: t.nav.residency, path: "/residency" },
    { label: t.nav.contact, path: "/contact" },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const menuLabel = isRTL ? HEBREW_MENU_LABEL : "Menu";
  const closeMenuLabel = isRTL ? HEBREW_CLOSE_LABEL : "Close";
  const desktopLeft = isRTL ? <LanguageToggle /> : <SiteLogo />;
  const desktopRight = isRTL ? <SiteLogo /> : <LanguageToggle />;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 overflow-hidden border-b border-black/8 bg-white/36 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/28">
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
        className="relative flex min-w-0 items-center justify-between gap-2 px-3 py-3 md:hidden"
        dir="ltr"
      >
        <SiteLogo className="shrink-0" />

        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <LanguageToggle compact />
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-white/55 bg-white/42 text-sm font-medium text-foreground shadow-sm backdrop-blur-xl transition-colors hover:bg-white/58"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-site-nav"
            aria-label={isMobileMenuOpen ? closeMenuLabel : menuLabel}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="sr-only">{isMobileMenuOpen ? closeMenuLabel : menuLabel}</span>
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
              {navItems.map((item, index) => (
                <MobileNavItem
                  key={item.path}
                  item={item}
                  index={index}
                  isActive={location.pathname === item.path}
                  onSelect={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
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

function NavItem({ item, mobile, isActive }: NavItemProps) {
  return (
    <div className="relative">
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
    </div>
  );
}

interface MobileNavItemProps {
  item: {
    label: string;
    path: string;
  };
  index: number;
  isActive: boolean;
  onSelect: () => void;
}

function MobileNavItem({ item, index, isActive, onSelect }: MobileNavItemProps) {
  return (
    <Link to={item.path} className="block" onClick={onSelect}>
      <div
        className={cn(
          "flex min-h-11 items-center justify-between border-b border-black/8 px-1 py-3 text-sm font-medium transition-colors duration-200",
          index === 0 ? "border-t border-black/8" : "",
          isActive ? "text-foreground" : "text-foreground/76 hover:text-foreground",
        )}
      >
        <span>{item.label}</span>
        {isActive ? <span className="h-1.5 w-1.5 bg-accent" /> : null}
      </div>
    </Link>
  );
}

function SiteLogo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex min-w-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        className,
      )}
    >
      <img src={logo} alt={SITE_LOGO_ALT} className="h-10 w-auto md:h-12" />
    </Link>
  );
}
