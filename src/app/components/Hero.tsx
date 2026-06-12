import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Github, Linkedin, ChevronDown, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";

const SUITS_CYCLE = ["♠", "♥", "♦", "♣"];

const skillCards = [
  { label: "React", suit: "♠", color: "#3A86FF", rank: "A" },
  { label: "Laravel", suit: "♥", color: "#E63946", rank: "K" },
  { label: "Node.js", suit: "♣", color: "#0E5A47", rank: "Q" },
  { label: "MongoDB", suit: "♦", color: "#FFD166", rank: "J" },
  { label: "TypeScript", suit: "♠", color: "#7B2CBF", rank: "10" },
];

const neoSkills = [
  { label: "React", color: "#00D9FF", icon: "◈" },
  { label: "Laravel", color: "#FF2D95", icon: "◈" },
  { label: "Node.js", color: "#7A5FFF", icon: "◈" },
  { label: "MongoDB", color: "#00D9FF", icon: "◈" },
  { label: "TypeScript", color: "#FF7A00", icon: "◈" },
];

function useTypewriterLoop(lines: string[], typeSpeed = 45, pause = 1800, eraseSpeed = 25) {
  const [display, setDisplay] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "erasing">("typing");

  useEffect(() => {
    const current = lines[lineIdx] || "";
    if (phase === "typing") {
      if (display.length < current.length) {
        const t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), typeSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pausing"), pause);
        return () => clearTimeout(t);
      }
    }
    if (phase === "pausing") { setPhase("erasing"); }
    if (phase === "erasing") {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay((d) => d.slice(0, -1)), eraseSpeed);
        return () => clearTimeout(t);
      } else {
        setLineIdx((i) => (i + 1) % lines.length);
        setPhase("typing");
      }
    }
  }, [display, phase, lineIdx, lines, typeSpeed, pause, eraseSpeed]);

  return { display, phase };
}

function FloatingSkillCard({ card, index }: { card: typeof skillCards[0]; index: number }) {
  const angle = (index / skillCards.length) * 360;
  const r = 185;
  const x = Math.cos((angle * Math.PI) / 180) * r;
  const y = Math.sin((angle * Math.PI) / 180) * (r * 0.48);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, x, y }}
      transition={{ delay: 1.3 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "absolute", top: "50%", left: "50%", marginLeft: "-32px", marginTop: "-48px" }}
    >
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [(index % 2 ? 1 : -1) * 5, (index % 2 ? -1 : 1) * 5, (index % 2 ? 1 : -1) * 5] }}
        transition={{ duration: 3.5 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.25, zIndex: 30 }}
      >
        <div
          className="w-16 h-24 rounded-xl flex flex-col items-center justify-between p-2 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #F4EDD6, #e8dfc4)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 15px ${card.color}35`,
          }}
        >
          <div className="absolute inset-0 rounded-xl opacity-20" style={{ background: `linear-gradient(135deg, transparent 30%, ${card.color}40 50%, transparent 70%)` }} />
          <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
            <div className="self-start" style={{ fontFamily: "'Bungee', cursive", fontSize: "0.8rem", color: card.color, lineHeight: 1 }}>
              {card.rank}<span className="block" style={{ fontSize: "0.6rem" }}>{card.suit}</span>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.48rem", color: "#07111F", textAlign: "center", lineHeight: 1.2 }}>{card.label}</span>
            <div className="self-end rotate-180" style={{ fontFamily: "'Bungee', cursive", fontSize: "0.8rem", color: card.color, lineHeight: 1 }}>
              {card.rank}<span className="block" style={{ fontSize: "0.6rem" }}>{card.suit}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AceCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [18, -18]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-18, 18]), { stiffness: 150, damping: 20 });
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [suitIndex, setSuitIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSuitIndex((i) => (i + 1) % SUITS_CYCLE.length), 2800);
    return () => clearInterval(t);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
    setPos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  const foilAngle = Math.atan2(pos.y - 0.5, pos.x - 0.5) * (180 / Math.PI);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); setHovered(false); setPos({ x: 0.5, y: 0.5 }); }}
      initial={{ rotateY: -180, opacity: 0, y: 20 }}
      animate={{ rotateY: 0, opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800, cursor: "none" }}
    >
      <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <div
          className="rounded-[28px] p-0.5 card-border-legendary"
          style={{
            boxShadow: hovered
              ? "0 0 70px rgba(255,209,102,0.6), 0 40px 90px rgba(0,0,0,0.8)"
              : "0 0 35px rgba(255,209,102,0.3), 0 30px 60px rgba(0,0,0,0.7)",
            transition: "box-shadow 0.3s",
          }}
        >
          <div
            className="w-52 h-80 md:w-64 md:h-96 rounded-[26px] flex flex-col items-center justify-between p-5 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #F8F1DC 0%, #ede5cb 60%, #e0d8b8 100%)" }}
          >
            <div className="absolute inset-0 rounded-[26px] pointer-events-none transition-opacity duration-300" style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(ellipse at ${pos.x * 100}% ${pos.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 50%), linear-gradient(${foilAngle + 90}deg, rgba(255,215,0,0.2), rgba(255,100,100,0.15), rgba(123,44,191,0.15), rgba(0,200,255,0.15), rgba(255,215,0,0.2))`,
              mixBlendMode: "overlay",
            }} />
            <div className="absolute inset-0 rounded-[26px] overflow-hidden pointer-events-none">
              <div style={{ position: "absolute", top: "-50%", width: "25%", height: "200%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.35), transparent)", animation: "shimmer 3s ease-in-out infinite", opacity: 0.7 }} />
            </div>
            <div className="self-start z-10">
              <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.8rem", color: "#07111F", lineHeight: 0.9 }}>A</span>
              <motion.span key={suitIndex} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: "'Bungee', cursive", fontSize: "1rem", color: "#E63946", display: "block" }}>
                {SUITS_CYCLE[suitIndex]}
              </motion.span>
            </div>
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #07111F 0%, #0d1f30 100%)", border: "2px solid rgba(255,209,102,0.5)", boxShadow: "0 0 40px rgba(255,209,102,0.25), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
                <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.5rem", color: "#FFD166", letterSpacing: "0.02em", textShadow: "0 0 20px rgba(255,209,102,0.6)" }}>OAH</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#5a6878", letterSpacing: "0.2em", textTransform: "uppercase" }}>Full-Stack Dev</span>
            </div>
            <div className="self-end rotate-180 z-10">
              <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.8rem", color: "#07111F", lineHeight: 0.9 }}>A</span>
              <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1rem", color: "#E63946", display: "block" }}>{SUITS_CYCLE[suitIndex]}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NeoHologram() {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScanLine((v) => (v + 1) % 100), 20);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center"
      style={{ width: "320px", height: "420px" }}
    >
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full"
        style={{ border: "1px solid rgba(0,217,255,0.2)", borderRadius: "50%" }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{ inset: "20px", border: "1px solid rgba(255,45,149,0.15)", borderRadius: "50%" }}
      />

      {/* Floating skill nodes */}
      {neoSkills.map((skill, i) => {
        const angle = (i / neoSkills.length) * 360;
        const r = 140;
        const x = Math.cos((angle * Math.PI) / 180) * r;
        const y = Math.sin((angle * Math.PI) / 180) * (r * 0.6);
        return (
          <motion.div
            key={skill.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, x, y }}
            transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
            style={{ position: "absolute", top: "50%", left: "50%", marginLeft: "-32px", marginTop: "-16px" }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: skill.color,
                background: `${skill.color}10`,
                border: `1px solid ${skill.color}30`,
                boxShadow: `0 0 12px ${skill.color}20`,
                whiteSpace: "nowrap",
              }}
            >
              <span>{skill.icon}</span>
              {skill.label}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Central holographic ID card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 rounded-2xl overflow-hidden"
        style={{
          width: "160px",
          height: "210px",
          background: "linear-gradient(145deg, rgba(0,217,255,0.08), rgba(122,95,255,0.06))",
          border: "1px solid rgba(0,217,255,0.25)",
          boxShadow: "0 0 60px rgba(0,217,255,0.15), 0 30px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(0,217,255,0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ top: `${scanLine}%`, background: "linear-gradient(90deg, transparent, rgba(0,217,255,0.6), transparent)", boxShadow: "0 0 8px rgba(0,217,255,0.4)" }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,217,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="relative z-10 flex flex-col items-center justify-between h-full p-4">
          <div className="w-full flex items-center justify-between">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(0,217,255,0.5)", letterSpacing: "0.1em" }}>ID//2026</span>
            <span style={{ color: "rgba(0,217,255,0.4)", fontSize: "0.7rem" }}>◈</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(0,217,255,0.1), rgba(122,95,255,0.1))", border: "1px solid rgba(0,217,255,0.2)" }}
            >
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.1rem", color: "#00D9FF", fontWeight: 700, textShadow: "0 0 20px rgba(0,217,255,0.6)" }}>OAH</span>
            </div>
            <div className="text-center">
              <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.55rem", color: "#F4F7FA", letterSpacing: "0.12em", fontWeight: 600 }}>OMAR ADAM</p>
              <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.55rem", color: "#F4F7FA", letterSpacing: "0.12em", fontWeight: 600 }}>HISSANE</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.42rem", color: "rgba(0,217,255,0.6)", marginTop: "4px", letterSpacing: "0.08em" }}>FULL-STACK DEV</p>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-1">
              {["◈", "◈", "◈", "◈", "◈"].map((s, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  style={{ color: "#00D9FF", fontSize: "0.55rem" }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,217,255,0.4), transparent)" }} />
            <div className="mt-1 flex justify-between">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.4rem", color: "rgba(0,217,255,0.35)", letterSpacing: "0.06em" }}>CLEARANCE</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.4rem", color: "#FF2D95", letterSpacing: "0.06em" }}>LEVEL_A</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Corner HUD elements */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: i < 2 ? "10px" : "auto",
            bottom: i >= 2 ? "10px" : "auto",
            left: i % 2 === 0 ? "10px" : "auto",
            right: i % 2 === 1 ? "10px" : "auto",
            width: "16px",
            height: "16px",
            borderTop: i < 2 ? "1px solid rgba(0,217,255,0.3)" : "none",
            borderBottom: i >= 2 ? "1px solid rgba(0,217,255,0.3)" : "none",
            borderLeft: i % 2 === 0 ? "1px solid rgba(0,217,255,0.3)" : "none",
            borderRight: i % 2 === 1 ? "1px solid rgba(0,217,255,0.3)" : "none",
          }}
        />
      ))}
    </motion.div>
  );
}

function HeroStatCounter({ stat, index, isNeo }: { stat: { value: number; label: string; suffix: string }; index: number; isNeo: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const delay = setTimeout(() => {
      let n = 0;
      const step = stat.value / 30;
      const t = setInterval(() => {
        n += step;
        if (n >= stat.value) { setCount(stat.value); clearInterval(t); }
        else setCount(Math.floor(n));
      }, 30);
      return () => clearInterval(t);
    }, 900 + index * 120);
    return () => clearTimeout(delay);
  }, [stat.value, index]);

  return (
    <div className="flex flex-col gap-0.5">
      <span
        style={{
          fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive",
          fontSize: isNeo ? "1.2rem" : "1.6rem",
          color: "var(--oah-gold)",
          lineHeight: 1,
          letterSpacing: isNeo ? "0.05em" : "0.02em",
        }}
      >
        {count}{stat.suffix}
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "var(--oah-muted)", letterSpacing: "0.08em" }}>
        {stat.label.toUpperCase()}
      </span>
    </div>
  );
}

export function Hero() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isRTL = i18n.language === "ar";
  const isNeo = theme === "neocity";
  const taglines: string[] = t("hero.taglines", { returnObjects: true }) as string[];
  const { display } = useTypewriterLoop(taglines);

  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";
  const accentGrad = isNeo
    ? "linear-gradient(90deg, #00D9FF 0%, #FF2D95 55%, #7A5FFF 100%)"
    : "linear-gradient(90deg, #FFD166 0%, #E63946 55%, #7B2CBF 100%)";

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-12 lg:px-20 pt-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: isNeo ? "radial-gradient(ellipse at 65% 50%, rgba(0,217,255,0.06) 0%, transparent 60%)" : "radial-gradient(ellipse at 65% 50%, rgba(14,90,71,0.10) 0%, transparent 60%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          {/* Status badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.06em",
                background: isNeo ? "rgba(0,217,255,0.06)" : "rgba(14,90,71,0.08)",
                border: isNeo ? "1px solid rgba(0,217,255,0.2)" : "1px solid rgba(14,90,71,0.25)",
                color: isNeo ? "var(--oah-gold)" : "#0E5A47",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: isNeo ? "var(--oah-gold)" : "#0E5A47" }} />
              {t("nav.available")} · Open for opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <h1 style={{ fontFamily: displayFont, fontSize: isNeo ? "clamp(2rem, 5vw, 4.2rem)" : "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1, letterSpacing: isNeo ? "0.08em" : "0.02em", color: "var(--oah-fg)" }}>
              OMAR
              <br />
              ADAM
              <br />
              <span style={{ backgroundImage: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", backgroundSize: "200%", animation: "legendary-rotate 5s ease infinite" }}>
                HISSANE
              </span>
            </h1>
          </motion.div>

          {/* Divider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 my-5">
            <div className="h-px flex-1" style={{ background: isNeo ? "linear-gradient(90deg, rgba(0,217,255,0.4), transparent)" : "linear-gradient(90deg, rgba(255,209,102,0.4), transparent)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--oah-muted)", letterSpacing: "0.18em" }}>
              {t("hero.role").toUpperCase()}
            </span>
            <div className="h-px flex-1" style={{ background: isNeo ? "linear-gradient(90deg, transparent, rgba(0,217,255,0.4))" : "linear-gradient(90deg, transparent, rgba(255,209,102,0.4))" }} />
          </motion.div>

          {/* Typewriter tagline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-10 h-8">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "var(--oah-muted)" }}>
              {isNeo ? "$ " : "> "}{display}
              <span className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: "var(--oah-gold)" }} />
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap gap-3">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5"
              style={{
                fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive",
                fontSize: isNeo ? "0.65rem" : "0.85rem",
                letterSpacing: isNeo ? "0.12em" : "0.05em",
                background: isNeo ? "var(--oah-gold)" : "linear-gradient(135deg, #FFD166, #E63946)",
                color: isNeo ? "var(--oah-bg)" : "#07111F",
                borderRadius: "10px",
                boxShadow: isNeo ? "0 0 30px rgba(0,217,255,0.3)" : "0 0 30px rgba(255,209,102,0.3)",
              }}
            >
              {isNeo ? "VIEW GRID" : t("hero.viewDeck") + " ♠"}
            </motion.a>
            <motion.a
              href="https://github.com/hissaneomaradam"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-2 px-6 py-3.5"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--oah-fg)", borderRadius: "10px", border: "1px solid var(--oah-border)", background: "var(--oah-surface2)" }}
            >
              <Github size={16} />
              GitHub
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/hissaneomaradam/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-2 px-6 py-3.5"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--oah-fg)", borderRadius: "10px", border: "1px solid var(--oah-border)", background: "var(--oah-surface2)" }}
            >
              <Linkedin size={16} />
              LinkedIn
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-2 px-6 py-3.5"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--oah-gold)", borderRadius: "10px", border: "1px solid var(--oah-border)", background: "var(--oah-surface2)" }}
            >
              <ExternalLink size={16} />
              Contact
            </motion.a>
          </motion.div>

          {/* Mini stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-6 mt-10 pt-8"
            style={{ borderTop: "1px solid var(--oah-border)" }}
          >
            {[
              { value: 3, label: "Projects Built", suffix: "+" },
              { value: 7, label: "Certifications", suffix: "" },
              { value: 15, label: "Technologies", suffix: "+" },
              { value: 2, label: "Years Learning", suffix: "" },
            ].map((stat, i) => (
              <HeroStatCounter key={stat.label} stat={stat} index={i} isNeo={isNeo} />
            ))}
          </motion.div>
        </div>

        {/* Right — theme-aware visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative flex items-center justify-center"
          style={{ height: "420px" }}
        >
          {isNeo ? (
            <NeoHologram />
          ) : (
            <>
              {skillCards.map((card, i) => (
                <FloatingSkillCard key={card.label} card={card} index={i} />
              ))}
              <AceCard />
            </>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ color: "var(--oah-muted)" }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
