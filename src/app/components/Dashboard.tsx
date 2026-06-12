import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Monitor, BookOpen, Eye, Coffee, Cpu, Zap, Target, Music2 } from "lucide-react";

const STATUS_ITEMS = [
  {
    icon: Target,
    label: "Current Focus",
    value: "Full-Stack Web Development",
    sub: "Building real-world products",
    color: "#00D9FF",
    pulse: true,
  },
  {
    icon: Cpu,
    label: "Currently Learning",
    value: "Three.js / WebGL",
    sub: "3D on the web",
    color: "#7A5FFF",
    pulse: false,
  },
  {
    icon: Monitor,
    label: "Current Project",
    value: "CoBIM Cloud",
    sub: "Enterprise BIM platform",
    color: "#FFD166",
    pulse: true,
  },
  {
    icon: Music2,
    label: "Now Playing",
    value: "Hotel California",
    sub: "Eagles · Live",
    color: "#1DB954",
    pulse: false,
  },
  {
    icon: Zap,
    label: "Current Mood",
    value: "Bored but optimistic",
    sub: "Ready for new challenges",
    color: "#FF7A00",
    pulse: false,
  },
  {
    icon: BookOpen,
    label: "Reading",
    value: "The Alchemist",
    sub: "Paulo Coelho",
    color: "#FF2D95",
    pulse: false,
  },
  {
    icon: Eye,
    label: "Watching",
    value: "SE7EN",
    sub: "Whats in the boooooox?",
    color: "#3A86FF",
    pulse: false,
  },
  {
    icon: Coffee,
    label: "Fuel",
    value: "Espresso × 2",
    sub: "+ A white Monster energy",
    color: "#C8960A",
    pulse: false,
  },
];

function SectionLabel({ label, isNeo }: { label: string; isNeo: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, var(--oah-border))" }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--oah-muted)", letterSpacing: "0.2em" }}>
        {isNeo ? "◈" : "♦"} {label} {isNeo ? "◈" : "♦"}
      </span>
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, var(--oah-border), transparent)" }} />
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const t = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Casablanca",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false,
      }).format(new Date());
      setTime(t);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

function StatusCard({ item, index, isNeo }: { item: typeof STATUS_ITEMS[0]; index: number; isNeo: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? isNeo
            ? `linear-gradient(135deg, ${item.color}08, rgba(10,14,26,0.95))`
            : `linear-gradient(145deg, ${item.color}06, #0B1320)`
          : isNeo
            ? "rgba(10,14,26,0.7)"
            : "linear-gradient(145deg, #0d1f2e, #0B1320)",
        border: `1px solid ${hovered ? item.color + "30" : "var(--oah-card-border)"}`,
        boxShadow: hovered ? `0 0 20px ${item.color}10` : "none",
      }}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-px transition-all duration-300"
        style={{ background: hovered ? `linear-gradient(90deg, transparent, ${item.color}50, transparent)` : "transparent" }}
      />

      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: hovered ? `${item.color}15` : `${item.color}08`,
            border: `1px solid ${hovered ? item.color + "40" : item.color + "18"}`,
          }}
        >
          <Icon size={15} style={{ color: hovered ? item.color : "var(--oah-muted)", transition: "color 0.25s" }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>
              {item.label.toUpperCase()}
            </p>
            {item.pulse && (
              <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: item.color }} />
            )}
          </div>
          <p style={{
            fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Space Grotesk', sans-serif",
            fontSize: isNeo ? "0.62rem" : "0.82rem",
            fontWeight: 600,
            letterSpacing: isNeo ? "0.06em" : "0",
            color: hovered ? item.color : "var(--oah-fg)",
            transition: "color 0.25s",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {item.value}
          </p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)", marginTop: "2px" }}>
            {item.sub}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isNeo = theme === "neocity";

  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";

  return (
    <section id="dashboard" className="relative py-24 px-6 md:px-12 lg:px-20">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--oah-section-alt)" }} />

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <SectionLabel label="STATUS" isNeo={isNeo} />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em" }}>
                {isNeo ? "SYSTEM STATUS" : "MY SPACE"}
              </h2>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "var(--oah-fg2)", marginTop: "0.5rem" }}>
                What I'm up to right now. Updated regularly.
              </p>
            </div>

            {/* Live clock */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                color: "var(--oah-gold)",
                background: "var(--oah-surface2)",
                border: "1px solid var(--oah-border)",
                letterSpacing: "0.08em",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--oah-gold)" }} />
              <LiveClock />
              <span style={{ color: "var(--oah-muted)", marginLeft: "4px" }}>CASABLANCA</span>
            </div>
          </div>
        </motion.div>

        {/* Status grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STATUS_ITEMS.map((item, i) => (
            <StatusCard key={item.label} item={item} index={i} isNeo={isNeo} />
          ))}
        </div>

        {/* Last updated notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "var(--oah-muted)", letterSpacing: "0.08em" }}>
            I hate the routine
          </span>
        </motion.div>
      </div>
    </section>
  );
}
