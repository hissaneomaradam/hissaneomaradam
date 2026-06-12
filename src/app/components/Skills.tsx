import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const RARITY_SKILLS: Record<string, { rarity: "LEGENDARY" | "EPIC" | "RARE" | "COMMON"; color: string }> = {
  // Legendary
  "React.js": { rarity: "LEGENDARY", color: "#FFD166" },
  "Laravel": { rarity: "LEGENDARY", color: "#E63946" },
  "Full-Stack Development": { rarity: "LEGENDARY", color: "#FFD166" },
  "Three.js": { rarity: "LEGENDARY", color: "#FFD166" },
  "BIM": { rarity: "LEGENDARY", color: "#FFD166" },
  // Epic
  "TypeScript": { rarity: "EPIC", color: "#8B5CF6" },
  "Node.js": { rarity: "EPIC", color: "#0E5A47" },
  "Docker": { rarity: "EPIC", color: "#3A86FF" },
  "MongoDB": { rarity: "EPIC", color: "#0E5A47" },
  "Python": { rarity: "EPIC", color: "#3A86FF" },
  "Figma": { rarity: "EPIC", color: "#FF2D95" },
  "REST APIs": { rarity: "EPIC", color: "#8B5CF6" },
  "Cybersecurity": { rarity: "EPIC", color: "#E63946" },
  "Machine Learning": { rarity: "EPIC", color: "#8B5CF6" },
  // Rare
  "MySQL": { rarity: "RARE", color: "#3A86FF" },
  "Git": { rarity: "RARE", color: "#E63946" },
  "GitHub": { rarity: "RARE", color: "#8B5CF6" },
  "Tailwind CSS": { rarity: "RARE", color: "#3A86FF" },
  "Agile Methodologies": { rarity: "RARE", color: "#0E5A47" },
  "Scrum": { rarity: "RARE", color: "#0E5A47" },
  "IFC": { rarity: "RARE", color: "#FFD166" },
};

const RARITY_STYLE = {
  LEGENDARY: { border: "#FFD166", glow: "rgba(255,209,102,0.35)", label: "★", bg: "rgba(255,209,102,0.07)" },
  EPIC: { border: "#8B5CF6", glow: "rgba(139,92,246,0.3)", label: "◆", bg: "rgba(139,92,246,0.07)" },
  RARE: { border: "#118AB2", glow: "rgba(17,138,178,0.25)", label: "●", bg: "rgba(17,138,178,0.06)" },
  COMMON: { border: "rgba(248,241,220,0.12)", glow: "transparent", label: "○", bg: "rgba(248,241,220,0.03)" },
};

const groups = [
  {
    suit: "♠", category: "Frontend", color: "#3A86FF",
    skills: [
      "React.js", "JavaScript", "TypeScript", "HTML5", "CSS",
      "Tailwind CSS", "Bootstrap", "Responsive Web Design",
      "Three.js", "Single Page Applications", "UI/UX Fundamentals", "Figma",
    ],
  },
  {
    suit: "♥", category: "Backend", color: "#E63946",
    skills: [
      "Laravel", "Node.js", "PHP", "REST APIs",
      "Full-Stack Development", "CRUD Applications", "Cloud-Native Applications",
    ],
  },
  {
    suit: "♦", category: "Database", color: "#FFD166",
    skills: [
      "MongoDB", "MySQL", "NoSQL",
      "MongoDB Aggregation",
    ],
  },
  {
    suit: "♣", category: "DevOps & Tools", color: "#0E5A47",
    skills: [
      "Git", "GitHub", "Docker", "Jira",
      "Postman API", "Version Control",
    ],
  },
  {
    suit: "♠", category: "AI & Emerging Tech", color: "#8B5CF6",
    skills: [
      "Python", "Machine Learning", "AI Prompting", "Chatbots",
      "Internet of Things (IoT)", "Cybersecurity",
      "Threat Detection", "Network Vulnerabilities",
      "Privacy & Data Security",
    ],
  },
  {
    suit: "♥", category: "BIM & 3D", color: "#FF7A00",
    skills: [
      "BIM", "IFC", "Three.js",
      "Software Project Management",
    ],
  },
  {
    suit: "♦", category: "Architecture & Methods", color: "#7B2CBF",
    skills: [
      "OOP", "UML", "Merise",
      "Agile Methodologies", "Scrum", "Project Management",
      "Procedural Programming", "Design, Develop & Debug Scripts",
    ],
  },
  {
    suit: "♣", category: "Soft Skills", color: "#E63946",
    skills: [
      "Communication", "Leadership", "Teamwork",
      "Problem Solving", "Creativity", "Entrepreneurship",
      "Analytical Skills", "Time Management", "Stress Management",
    ],
  },
];

const totalCards = groups.reduce((acc, g) => acc + g.skills.length, 0);
const legendaryCount = Object.values(RARITY_SKILLS).filter((s) => s.rarity === "LEGENDARY").length;

function SkillMiniCard({ skill, groupColor, index, inView }: { skill: string; groupColor: string; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const rarityData = RARITY_SKILLS[skill] || { rarity: "COMMON" as const, color: groupColor };
  const style = RARITY_STYLE[rarityData.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.8), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08, zIndex: 10 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-default"
    >
      <div
        className="px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 relative"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "0.72rem",
          color: hovered ? rarityData.color : "var(--oah-fg2)",
          background: hovered ? style.bg : "rgba(248,241,220,0.03)",
          border: `1px solid ${hovered ? style.border + "60" : "rgba(248,241,220,0.07)"}`,
          boxShadow: hovered ? `0 0 12px ${style.glow}` : "none",
        }}
      >
        {rarityData.rarity !== "COMMON" && (
          <span className="absolute top-0.5 right-1" style={{ fontSize: "6px", color: style.border, opacity: 0.7 }}>
            {style.label}
          </span>
        )}
        {skill}
      </div>
    </motion.div>
  );
}

export function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { theme } = useTheme();
  const isNeo = theme === "neocity";
  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";

  return (
    <section id="skills" ref={ref} className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, var(--oah-border))" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--oah-muted)", letterSpacing: "0.2em" }}>
              {isNeo ? "◈" : "♣"} CARD COLLECTION {isNeo ? "◈" : "♣"}
            </span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, var(--oah-border), transparent)" }} />
          </div>

          <div className="flex items-end justify-between">
            <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em" }}>
              {isNeo ? "SKILL MATRIX" : "Skills"}
            </h2>
            <div
              className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace", background: "var(--oah-surface2)", border: "1px solid var(--oah-border)" }}
            >
              <span style={{ fontSize: "0.62rem", color: "var(--oah-muted)" }}>{totalCards} SKILLS</span>
              <span style={{ width: "1px", height: "12px", background: "var(--oah-border)", display: "inline-block" }} />
              <span style={{ fontSize: "0.62rem", color: "var(--oah-gold)" }}>★ {legendaryCount} LEGENDARY</span>
            </div>
          </div>
        </motion.div>

        {/* Rarity legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {(["LEGENDARY", "EPIC", "RARE", "COMMON"] as const).map((r) => (
            <span
              key={r}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.08em",
                color: RARITY_STYLE[r].border,
                background: RARITY_STYLE[r].bg,
                border: `1px solid ${RARITY_STYLE[r].border}25`,
              }}
            >
              {RARITY_STYLE[r].label} {r}
            </span>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {groups.map((group, gi) => {
            let skillOffset = 0;
            for (let i = 0; i < gi; i++) skillOffset += groups[i].skills.length;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: gi * 0.07 }}
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: isNeo
                    ? `linear-gradient(145deg, ${group.color}06, rgba(6,8,15,0.8))`
                    : "linear-gradient(145deg, #0d1f2e, #0B1320)",
                  border: `1px solid ${group.color}18`,
                }}
              >
                {/* Watermark suit */}
                <div
                  className="absolute bottom-2 right-2 text-5xl pointer-events-none select-none"
                  style={{ color: group.color, fontFamily: "serif", opacity: 0.04 }}
                  aria-hidden="true"
                >
                  {group.suit}
                </div>

                {/* Category header */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0"
                    style={{ background: `${group.color}15`, border: `1px solid ${group.color}30`, color: group.color }}
                    aria-hidden="true"
                  >
                    {group.suit}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      color: group.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill, si) => (
                    <SkillMiniCard
                      key={skill}
                      skill={skill}
                      groupColor={group.color}
                      index={skillOffset + si}
                      inView={inView}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
