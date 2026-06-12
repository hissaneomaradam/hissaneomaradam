import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "motion/react";

const LANGS = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

const NAV_SECTIONS = [
  { id: "about",       labelKey: "nav.profile" },
  { id: "projects",    labelKey: "nav.deck"    },
  { id: "skills",      labelKey: "nav.skills"  },
  { id: "experience",  labelKey: "nav.exp"     },
  { id: "achievements",labelKey: "nav.wins"    },
  { id: "contact",     labelKey: "nav.contact" },
];

function CasablancaTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const t = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Casablanca",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());
      setTime(t);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--oah-muted)", letterSpacing: "0.06em" }}>
      Casablanca · {time}
    </span>
  );
}

export function Navbar({ onLogoClick }: { onLogoClick?: () => void }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const lastScrollY = useRef(0);
  const isRTL = i18n.language === "ar";
  const isNeo = theme === "neocity";

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 60) { setVisible(true); }
      else if (y > lastScrollY.current + 8) { setVisible(false); setOpen(false); }
      else if (y < lastScrollY.current - 4) { setVisible(true); }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const ids = NAV_SECTIONS.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const switchLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("oah-lang", code);
    setLangOpen(false);
  };

  const links = NAV_SECTIONS.map((s) => ({
    id: s.id,
    label: s.id === "experience" ? "EXP" : t(s.labelKey),
    href: `#${s.id}`,
  }));

  const accent = isNeo ? "var(--oah-gold)" : "var(--oah-gold)";

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label="Main navigation"
    >
      {/* Floating pill container */}
      <div className="px-4 pt-3">
        <div
          className="max-w-6xl mx-auto rounded-2xl transition-all duration-500"
          style={{
            background: scrolled
              ? isNeo
                ? "rgba(6,8,15,0.85)"
                : "rgba(11,19,32,0.85)"
              : "transparent",
            backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
            border: scrolled ? `1px solid var(--oah-border)` : "1px solid transparent",
            boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.3)" : "none",
          }}
        >
          <div className="flex items-center justify-between px-5 py-3 gap-4">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none"
              aria-label="Omar Adam Hissane — home"
              onClick={onLogoClick}
            >
              <span
                style={{
                  fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive",
                  fontSize: isNeo ? "0.85rem" : "1rem",
                  color: "var(--oah-fg)",
                  letterSpacing: isNeo ? "0.12em" : "0.05em",
                }}
              >
                <span style={{ color: accent }}>{isNeo ? "◈" : "♠"}</span>
                {" "}OAH
              </span>
              <CasablancaTime />
            </a>

            {/* Nav links — desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative px-3 py-1.5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Space Grotesk', sans-serif",
                      fontSize: isNeo ? "0.58rem" : "0.78rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? accent : "var(--oah-muted)",
                      letterSpacing: isNeo ? "0.1em" : "0",
                      background: isActive ? `color-mix(in srgb, ${isNeo ? "#00D9FF" : "#FFD166"} 8%, transparent)` : "transparent",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full"
                        style={{ width: "16px", height: "2px", background: accent }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Controls — desktop */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {/* Theme switcher */}
              <motion.button
                onClick={toggleTheme}
                disabled={isTransitioning}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all focus-visible:outline-none focus-visible:ring-2"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.06em",
                  color: isNeo ? "#00D9FF" : "#7B2CBF",
                  background: isNeo ? "rgba(0,217,255,0.06)" : "rgba(123,44,191,0.08)",
                  border: isNeo ? "1px solid rgba(0,217,255,0.18)" : "1px solid rgba(123,44,191,0.18)",
                  opacity: isTransitioning ? 0.4 : 1,
                }}
                aria-label={isNeo ? "Switch to The Deck theme" : "Switch to Neo City theme"}
              >
                <span style={{ fontSize: "0.7rem" }}>{isNeo ? "♠" : "◈"}</span>
                {isNeo ? "THE DECK" : "NEO CITY"}
              </motion.button>

              {/* Language switcher */}
              <div className="relative">
                <motion.button
                  onClick={() => setLangOpen((v) => !v)}
                  whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    color: "var(--oah-muted)",
                    border: "1px solid var(--oah-border)",
                    background: "transparent",
                  }}
                  aria-label="Change language"
                  aria-expanded={langOpen}
                >
                  {LANGS.find((l) => l.code === i18n.language)?.flag}
                  <span style={{ opacity: 0.5, marginLeft: "2px" }}>▾</span>
                </motion.button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full mt-1.5 right-0 rounded-xl overflow-hidden z-50"
                      style={{
                        background: isNeo ? "rgba(6,8,15,0.96)" : "rgba(11,19,32,0.96)",
                        border: "1px solid var(--oah-border)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                        minWidth: "100px",
                        backdropFilter: "blur(16px)",
                      }}
                      role="menu"
                    >
                      {LANGS.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => switchLang(lang.code)}
                          role="menuitem"
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs transition-colors"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.65rem",
                            color: i18n.language === lang.code ? accent : "var(--oah-muted)",
                            background: i18n.language === lang.code ? `color-mix(in srgb, ${isNeo ? "#00D9FF" : "#FFD166"} 6%, transparent)` : "transparent",
                          }}
                        >
                          {lang.flag} {lang.label}
                          {i18n.language === lang.code && (
                            <span style={{ color: accent, marginLeft: "auto" }}>✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Available badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.06em",
                  color: isNeo ? "#00D9FF" : "#0E5A47",
                  background: isNeo ? "rgba(0,217,255,0.06)" : "rgba(14,90,71,0.08)",
                  border: isNeo ? "1px solid rgba(0,217,255,0.18)" : "1px solid rgba(14,90,71,0.2)",
                }}
                aria-label="Availability status: open"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: isNeo ? "#00D9FF" : "#0E5A47" }}
                />
                {t("nav.available")}
              </div>

              {/* CTA */}
              <motion.a
                href="mailto:omaradamhissane@gmail.com"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2"
                style={{
                  fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive",
                  fontSize: isNeo ? "0.55rem" : "0.7rem",
                  letterSpacing: isNeo ? "0.1em" : "0.04em",
                  color: isNeo ? "var(--oah-bg)" : "var(--oah-gold)",
                  background: isNeo ? "var(--oah-gold)" : "transparent",
                  border: isNeo ? "none" : "1px solid rgba(255,209,102,0.3)",
                  boxShadow: isNeo ? "0 0 20px rgba(0,217,255,0.2)" : "none",
                }}
              >
                {t("nav.hire")}
              </motion.a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2"
              onClick={() => setOpen(!open)}
              style={{ color: "var(--oah-muted)", border: "1px solid var(--oah-border)" }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden mx-4 mt-1 rounded-2xl"
            style={{
              background: isNeo ? "rgba(6,8,15,0.96)" : "rgba(11,19,32,0.96)",
              border: "1px solid var(--oah-border)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="p-4 flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl transition-colors"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: activeSection === link.id ? 600 : 400,
                    color: activeSection === link.id ? accent : "var(--oah-fg2)",
                    background: activeSection === link.id ? `color-mix(in srgb, ${isNeo ? "#00D9FF" : "#FFD166"} 6%, transparent)` : "transparent",
                  }}
                  aria-current={activeSection === link.id ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-3 mt-1 border-t flex-wrap" style={{ borderColor: "var(--oah-border)" }}>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: isNeo ? "#00D9FF" : "#7B2CBF", background: "var(--oah-surface2)", border: "1px solid var(--oah-border)" }}
                >
                  {isNeo ? "♠ THE DECK" : "◈ NEO CITY"}
                </button>
                {LANGS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { switchLang(lang.code); setOpen(false); }}
                    className="text-xs px-2 py-1 rounded-md"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: i18n.language === lang.code ? accent : "var(--oah-muted)",
                      background: i18n.language === lang.code ? `color-mix(in srgb, ${isNeo ? "#00D9FF" : "#FFD166"} 8%, transparent)` : "transparent",
                    }}
                    aria-label={`Switch to ${lang.label}`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
