import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import {
  Cpu, Brain, Lightbulb, Gamepad2, Camera, Music,
  Rss, Code2, UtensilsCrossed, Film, Watch, Trophy,
  Flame,
} from "lucide-react";

const interests = [
  {
    icon: Code2,
    label: "Coding",
    desc: "Building things from scratch — the craft never gets old.",
    color: "#00D9FF",
  },
  {
    icon: Brain,
    label: "Artificial Intelligence",
    desc: "From LLMs to applied ML — fascinated by machines that learn.",
    color: "#7A5FFF",
  },
  {
    icon: Cpu,
    label: "Technology",
    desc: "Hardware, software, and everything that pushes the boundary.",
    color: "#3A86FF",
  },
  {
    icon: Lightbulb,
    label: "Entrepreneurship",
    desc: "Turning problems into products and ideas into businesses.",
    color: "#FFD166",
  },
  {
    icon: Flame,
    label: "Innovation",
    desc: "First-principles thinking and doing things that haven't been done.",
    color: "#FF7A00",
  },
  {
    icon: Music,
    label: "Music",
    desc: "Cinematic scores, electronic ambience, and anything that codes well to.",
    color: "#FF2D95",
  },
  {
    icon: Gamepad2,
    label: "Gaming",
    desc: "From indie gems to AAA worlds — games as art and systems design.",
    color: "#7B2CBF",
  },
  {
    icon: Camera,
    label: "Photography",
    desc: "Light, composition, and the decisive moment.",
    color: "#E63946",
  },
  {
    icon: UtensilsCrossed,
    label: "Cooking",
    desc: "Precision, creativity, and the satisfaction of feeding people well.",
    color: "#FF7A00",
  },
  {
    icon: Trophy,
    label: "Chess",
    desc: "Patience, pattern recognition, and thinking three moves ahead.",
    color: "#FFD166",
  },
  {
    icon: Film,
    label: "Films",
    desc: "Sci-Fi, Denis Villeneuve, and anything that expands the imagination.",
    color: "#3A86FF",
  },
  {
    icon: Watch,
    label: "Watches",
    desc: "Mechanical craftsmanship — engineering you can wear on your wrist.",
    color: "#C8960A",
  },
  {
    icon: Rss,
    label: "Tech Trends",
    desc: "Tracking what's emerging before it becomes mainstream.",
    color: "#00D9FF",
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

function InterestCard({ item, index, isNeo }: { item: typeof interests[0]; index: number; isNeo: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      viewport={{ once: true, margin: "-40px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl p-5 cursor-default transition-all duration-300"
      style={{
        background: hovered
          ? isNeo
            ? `linear-gradient(135deg, ${item.color}10, rgba(10,14,26,0.95))`
            : `linear-gradient(135deg, ${item.color}08, rgba(11,19,32,0.95))`
          : isNeo
            ? "rgba(10,14,26,0.6)"
            : "linear-gradient(145deg, #0d1f2e, #0B1320)",
        border: `1px solid ${hovered ? item.color + "35" : "var(--oah-card-border)"}`,
        boxShadow: hovered ? `0 8px 30px ${item.color}12, 0 0 0 1px ${item.color}20` : "none",
      }}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
        style={{
          background: hovered ? `${item.color}18` : `${item.color}0a`,
          border: `1px solid ${hovered ? item.color + "40" : item.color + "18"}`,
        }}
      >
        <Icon
          size={17}
          style={{ color: hovered ? item.color : "var(--oah-muted)", transition: "color 0.25s" }}
          aria-hidden="true"
        />
      </div>

      {/* Label */}
      <h4
        style={{
          fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Space Grotesk', sans-serif",
          fontSize: isNeo ? "0.6rem" : "0.82rem",
          fontWeight: 600,
          letterSpacing: isNeo ? "0.08em" : "0",
          color: hovered ? item.color : "var(--oah-fg)",
          transition: "color 0.25s",
          marginBottom: "6px",
        }}
      >
        {item.label}
      </h4>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.75rem",
          color: "var(--oah-fg2)",
          lineHeight: 1.55,
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 0.25s",
        }}
      >
        {item.desc}
      </p>
    </motion.div>
  );
}

export function Interests() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isNeo = theme === "neocity";
  const isRTL = i18n.language === "ar";

  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";

  return (
    <section id="interests" className="relative py-24 px-6 md:px-12 lg:px-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <SectionLabel label="INTERESTS" isNeo={isNeo} />
          <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em" }}>
            {isNeo ? "SIGNAL FEED" : "OFF THE DECK"}
          </h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "var(--oah-fg2)", marginTop: "0.5rem", maxWidth: "480px" }}>
            {isNeo ? "What runs in the background." : "Beyond the code — what keeps me going."}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {interests.map((item, i) => (
            <InterestCard key={item.label} item={item} index={i} isNeo={isNeo} />
          ))}
        </div>
      </div>
    </section>
  );
}
