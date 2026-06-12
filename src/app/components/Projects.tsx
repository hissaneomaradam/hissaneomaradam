import { motion, useSpring, AnimatePresence } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { ExternalLink, Github, Sparkles, Star, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const STYLES = `
  @keyframes legendary-rotate {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes legendary-pulse {
    0%, 100% { box-shadow: 0 0 30px rgba(255,209,102,0.4), 0 0 60px rgba(230,57,70,0.15); }
    50%       { box-shadow: 0 0 55px rgba(255,209,102,0.75), 0 0 100px rgba(230,57,70,0.3); }
  }
  @keyframes epic-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(123,44,191,0.35), 0 0 40px rgba(123,44,191,0.12); }
    50%       { box-shadow: 0 0 40px rgba(123,44,191,0.65), 0 0 70px rgba(123,44,191,0.28); }
  }
  @keyframes rare-pulse {
    0%, 100% { box-shadow: 0 0 15px rgba(17,138,178,0.3), 0 0 30px rgba(17,138,178,0.1); }
    50%       { box-shadow: 0 0 28px rgba(17,138,178,0.55), 0 0 55px rgba(17,138,178,0.22); }
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%) rotate(15deg); }
    100% { transform: translateX(400%) rotate(15deg); }
  }
  @keyframes grain {
    0%, 100% { transform: translate(0,0); }
    20%  { transform: translate(-2%,-3%); }
    40%  { transform: translate(-4%, 2%); }
    60%  { transform: translate( 3%,-3%); }
    80%  { transform: translate(-3%, 4%); }
  }
  @keyframes screen-flash {
    0%   { opacity: 0; }
    20%  { opacity: 0.18; }
    100% { opacity: 0; }
  }
  @keyframes particle-burst {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
  }
  .card-border-legendary {
    background-image: linear-gradient(90deg, #FFD166, #E63946, #7B2CBF, #118AB2, #0B5D45, #FFD166);
    background-size: 300% 300%;
    animation: legendary-rotate 4s ease infinite, legendary-pulse 3s ease-in-out infinite;
  }
  .card-border-epic {
    background-image: linear-gradient(90deg, #7B2CBF, #C084FC, #7B2CBF);
    background-size: 300% 300%;
    animation: legendary-rotate 4s ease infinite, epic-pulse 3s ease-in-out infinite;
  }
  .card-border-rare {
    background-image: linear-gradient(90deg, #118AB2, #38BDF8, #118AB2);
    background-size: 300% 300%;
    animation: legendary-rotate 4s ease infinite, rare-pulse 3s ease-in-out infinite;
  }
`;

const RARITY = {
  LEGENDARY: {
    label: "★ LEGENDARY",
    color: "#FFD166",
    gradient: "linear-gradient(90deg, #FFD166, #E63946, #7B2CBF, #118AB2, #0B5D45, #FFD166)",
    animClass: "legendary-pulse",
    foilColors: "rgba(255,215,0,0.28), rgba(255,100,100,0.2), rgba(123,44,191,0.2), rgba(0,200,255,0.2), rgba(255,215,0,0.28)",
    icon: Sparkles,
    tier: 4,
  },
  EPIC: {
    label: "◆ EPIC",
    color: "#7B2CBF",
    gradient: "linear-gradient(90deg, #7B2CBF, #C084FC, #7B2CBF)",
    animClass: "epic-pulse",
    foilColors: "rgba(123,44,191,0.3), rgba(192,132,252,0.2), rgba(123,44,191,0.3)",
    icon: Star,
    tier: 3,
  },
  RARE: {
    label: "● RARE",
    color: "#118AB2",
    gradient: "linear-gradient(90deg, #118AB2, #38BDF8, #118AB2)",
    animClass: "rare-pulse",
    foilColors: "rgba(17,138,178,0.25), rgba(56,189,248,0.2), rgba(17,138,178,0.25)",
    icon: Zap,
    tier: 2,
  },
};

function Particles({ active, color }: { active: boolean; color: string }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-20">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const dist = 60 + Math.random() * 60;
        const px = Math.cos((angle * Math.PI) / 180) * dist;
        const py = Math.sin((angle * Math.PI) / 180) * dist;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 8px ${color}`,
              "--px": `${px}px`,
              "--py": `${py}px`,
              animation: "particle-burst 0.7s ease-out forwards",
              animationDelay: `${i * 0.03}s`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

function HoloCard({ rarity, children, cardNum, suit, suitColor, dealDelay }: {
  rarity: keyof typeof RARITY;
  children: React.ReactNode;
  cardNum: string;
  suit: string;
  suitColor: string;
  dealDelay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [particles, setParticles] = useState(false);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const cfg = RARITY[rarity];
  const RarityIcon = cfg.icon;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPos({ x, y });
    rx.set((y - 0.5) * -30);
    ry.set((x - 0.5) * 30);
  }, [rx, ry]);

  const handleEnter = useCallback(() => {
    setHovered(true);
    if (rarity === "LEGENDARY") {
      setParticles(true);
      setTimeout(() => setParticles(false), 800);
    }
  }, [rarity]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    rx.set(0);
    ry.set(0);
    setPos({ x: 0.5, y: 0.5 });
  }, [rx, ry]);

  const foilAngle = Math.atan2(pos.y - 0.5, pos.x - 0.5) * (180 / Math.PI);

  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.85 }}
      animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: dealDelay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        perspective: 800,
        position: "relative",
        zIndex: hovered ? 20 : 1,
        scale: hovered ? 1.04 : 1,
        transition: "scale 0.3s ease",
      }}
      data-cursor={rarity === "LEGENDARY" ? "legendary" : "card"}
      data-legendary={rarity === "LEGENDARY" ? true : undefined}
    >
      <Particles active={particles} color={cfg.color} />

      {/* Screen flash on legendary hover */}
      {rarity === "LEGENDARY" && hovered && (
        <div
          className="fixed inset-0 pointer-events-none z-[150]"
          style={{
            background: "rgba(255,209,102,0.06)",
            animation: "screen-flash 0.5s ease-out forwards",
          }}
        />
      )}

      {/* Animated border */}
      <div
        className={`rounded-2xl card-border-${rarity.toLowerCase()}`}
        style={{ padding: "2px" }}
      >
        <div
          className="rounded-2xl relative overflow-hidden"
          style={{ background: "var(--oah-card-bg)", borderRadius: "14px", minHeight: "480px" }}
        >
          {/* Foil */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(ellipse at ${pos.x * 100}% ${pos.y * 100}%, rgba(255,255,255,0.14) 0%, transparent 55%),
                linear-gradient(${foilAngle + 90}deg, transparent 20%, ${cfg.foilColors}, transparent 80%)`,
              mixBlendMode: "screen",
              zIndex: 10,
            }}
          />
          {/* Shine sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" style={{ zIndex: 11 }}>
            <div style={{ position: "absolute", top: "-50%", left: 0, right: 0, bottom: 0, opacity: hovered ? 0.6 : 0, transition: "opacity 0.3s" }}>
              <div style={{ position: "absolute", top: "-50%", left: 0, width: "30%", height: "200%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.09), transparent)", animation: hovered ? "shimmer 1.5s ease-in-out infinite" : "none" }} />
            </div>
          </div>
          {/* Edge wear */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: "inset 0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", zIndex: 9 }} />

          <div className="relative z-[12]">{children}</div>
          <div className="absolute bottom-4 right-4 opacity-[0.07]" style={{ fontFamily: "'Bungee', cursive", fontSize: "1.1rem", color: suitColor, transform: "rotate(180deg)" }}>
            {cardNum}{suit}
          </div>
        </div>
      </div>

      {/* Rarity badge */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={{ background: "var(--oah-bg2)", border: `1px solid ${cfg.color}50`, boxShadow: `0 0 20px ${cfg.color}30`, zIndex: 20 }}
      >
        <RarityIcon size={10} style={{ color: cfg.color }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", fontWeight: 700, color: cfg.color, letterSpacing: "0.12em" }}>
          {cfg.label}
        </span>
      </div>
    </motion.div>
  );
}

function DeckOpener({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"idle" | "shake" | "deal">("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("shake"), 100);
    const t2 = setTimeout(() => { setPhase("deal"); onDone(); }, 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== "deal" && (
        <motion.div exit={{ opacity: 0, scale: 1.2 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <motion.div
            animate={phase === "shake" ? { x: [-8, 8, -6, 6, -3, 3, 0], rotate: [-4, 4, -3, 3, 0] } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${-i * 4}px`,
                  left: `${-i * 2}px`,
                  width: "80px",
                  height: "112px",
                  borderRadius: "12px",
                  background: i === 0 ? "linear-gradient(145deg, #F8F1DC, #ede5cb)" : "linear-gradient(145deg, #0e1e2e, #07110D)",
                  border: i === 0 ? "1.5px solid rgba(255,255,255,0.4)" : "1.5px solid rgba(255,209,102,0.2)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i === 0 && (
                  <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.1rem", color: "#FFD166", textShadow: "0 0 15px rgba(255,209,102,0.5)" }}>OAH</span>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const projectsData = [
  {
    id: "A", suit: "♠", suitColor: "#FFD166",
    rarity: "LEGENDARY" as const,
    tech: ["React", "TypeScript", "Firebase", "Three.js", "Tailwind CSS"],
    liveUrl: "https://cobim-cloud.vercel.app/",
    githubUrl: "https://github.com/hissaneomaradam/cobim-v2",
    accentColor: "#FFD166",
    metrics: [
      { value: "250+", label: "Users" },
      { value: "99.9%", label: "Uptime" },
      { value: "5+", label: "Modules" },
    ],
  },
  {
    id: "K", suit: "♥", suitColor: "#7B2CBF",
    rarity: "EPIC" as const,
    tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://www.unibuddy.me/",
    githubUrl: "https://github.com/hissaneomaradam",
    accentColor: "#7B2CBF",
    metrics: [
      { value: "100+", label: "Students" },
      { value: "4", label: "Core Features" },
      { value: "Full", label: "Stack" },
    ],
  },
  {
    id: "Q", suit: "♦", suitColor: "#118AB2",
    rarity: "RARE" as const,
    tech: ["Laravel", "PHP", "MySQL", "MVC", "Auth", "CRUD"],
    liveUrl: null,
    githubUrl: "https://github.com/hissaneomaradam/megaShop",
    accentColor: "#118AB2",
    metrics: [
      { value: "6+", label: "Projects" },
      { value: "MVC", label: "Architecture" },
      { value: "REST", label: "APIs" },
    ],
  },
];

function ProjectCardContent({ project, tProject }: { project: typeof projectsData[0]; tProject: { id: string; name: string; tagline: string; description: string } }) {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ perspective: "800px", height: "460px" }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d", width: "100%", height: "100%", position: "relative" }}
      >
        {/* Front */}
        <div onClick={() => setFlipped(true)} className="absolute inset-0 p-6 flex flex-col cursor-pointer" style={{ backfaceVisibility: "hidden" }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.9rem", color: project.accentColor, lineHeight: 0.9, textShadow: `0 0 20px ${project.accentColor}60`, letterSpacing: "0.02em" }}>
                {tProject.id}
              </span>
              <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.1rem", color: project.suitColor, display: "block", lineHeight: 1, marginTop: 2 }}>{project.suit}</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'JetBrains Mono', monospace", color: project.accentColor, background: `${project.accentColor}10`, border: `1px solid ${project.accentColor}25` }}>
              #{String(projectsData.indexOf(project) + 1).padStart(3, "0")}
            </span>
          </div>

          {/* Art panel */}
          <div className="w-full rounded-xl mb-5 flex items-center justify-center relative overflow-hidden" style={{ height: "135px", background: `${project.accentColor}08`, border: `1px solid ${project.accentColor}15` }}>
            <span style={{ fontFamily: "serif", fontSize: "5rem", color: project.accentColor, opacity: 0.07, position: "absolute" }}>{project.suit}</span>
            <div className="absolute inset-0 grid grid-cols-3 gap-3 p-4 opacity-[0.05]" style={{ placeItems: "center" }}>
              {Array.from({ length: 9 }).map((_, i) => <span key={i} style={{ color: project.accentColor, fontSize: "0.8rem" }}>{project.suit}</span>)}
            </div>
          </div>

          <p className="text-xs mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: project.accentColor, letterSpacing: "0.1em" }}>{tProject.tagline}</p>
          <h3 style={{ fontFamily: "'Bungee', cursive", fontSize: "1.25rem", letterSpacing: "0.03em", color: "var(--oah-fg)" }}>{tProject.name}</h3>

          <div className="my-3 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${project.accentColor}30, transparent)` }} />

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-auto mb-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center py-2 rounded-xl"
                style={{ background: `${project.accentColor}08`, border: `1px solid ${project.accentColor}18` }}
              >
                <span style={{ fontFamily: "'Bungee', cursive", fontSize: "0.85rem", color: project.accentColor, lineHeight: 1 }}>{m.value}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.45rem", color: "var(--oah-muted)", letterSpacing: "0.08em", marginTop: "3px" }}>{m.label.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--oah-muted)", background: "var(--oah-surface2)", border: "1px solid var(--oah-border)" }}>{t}</span>
            ))}
            {project.tech.length > 3 && <span className="text-xs px-2 py-0.5 rounded-md" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--oah-muted)" }}>+{project.tech.length - 3}</span>}
          </div>

          <p className="mt-3 text-xs text-center" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--oah-muted)", opacity: 0.4 }}>{t("projects.tapInspect")}</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 p-6 flex flex-col" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "'Bungee', cursive", fontSize: "1.05rem", letterSpacing: "0.03em", color: "var(--oah-fg)" }}>{tProject.name}</h3>
            <button onClick={(e) => { e.stopPropagation(); setFlipped(false); }} className="text-xs px-3 py-1 rounded-lg transition-colors hover:bg-white/10" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--oah-muted)", border: "1px solid var(--oah-border)" }}>
              {t("projects.back")}
            </button>
          </div>
          <p className="text-sm leading-relaxed mb-4 flex-1" style={{ fontFamily: "'Inter', sans-serif", color: "var(--oah-fg2)", lineHeight: 1.75 }}>{tProject.description}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-lg" style={{ fontFamily: "'JetBrains Mono', monospace", color: project.accentColor, background: `${project.accentColor}0c`, border: `1px solid ${project.accentColor}20` }}>{t}</span>
            ))}
          </div>
          <div className="flex gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:scale-105" style={{ fontFamily: "'Bungee', cursive", fontSize: "0.75rem", letterSpacing: "0.03em", background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}aa)`, color: "#07111F", boxShadow: `0 0 20px ${project.accentColor}35` }}>
                <ExternalLink size={13} />{t("projects.playProject")}
              </a>
            )}
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:scale-105" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "var(--oah-fg)", background: "var(--oah-surface2)", border: "1px solid var(--oah-border)" }}>
              <Github size={13} />{t("projects.viewCode")}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();
  const [dealt, setDealt] = useState(false);

  useEffect(() => {
    if (inView && !dealt) {
      setTimeout(() => setDealt(true), 800);
    }
  }, [inView, dealt]);

  const tItems: Array<{ id: string; name: string; tagline: string; description: string }> =
    t("projects.items", { returnObjects: true }) as Array<{ id: string; name: string; tagline: string; description: string }>;

  return (
    <section id="projects" ref={ref} className="py-28 px-6 md:px-12 lg:px-20 relative" style={{ background: "var(--oah-section-alt)" }}>
      <style>{STYLES}</style>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-6">
          <span className="text-xs tracking-widest uppercase mb-3 block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--oah-gold)" }}>
            ♠ {t("projects.label")}
          </span>
          <div className="flex items-end justify-between">
            <h2 style={{ fontFamily: "'Bungee', cursive", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em", color: "var(--oah-fg)" }}>
              {t("projects.title")}
            </h2>
            <div className="hidden sm:flex items-center gap-3">
              {(["LEGENDARY", "EPIC", "RARE"] as const).map((r) => (
                <span key={r} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full" style={{ fontFamily: "'JetBrains Mono', monospace", color: RARITY[r].color, background: `${RARITY[r].color}10`, border: `1px solid ${RARITY[r].color}25` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: RARITY[r].color }} />
                  {r}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="mb-16 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--oah-muted)", opacity: 0.6 }}>
          // {t("projects.hint")}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-10 pt-6 relative min-h-[540px]">
          {!dealt && inView && <DeckOpener onDone={() => {}} />}
          {projectsData.map((project, i) => (
            <div key={project.id} className="pt-6">
              <HoloCard
                rarity={project.rarity}
                cardNum={project.id}
                suit={project.suit}
                suitColor={project.accentColor}
                dealDelay={dealt ? 0 : 0.9 + i * 0.25}
              >
                <ProjectCardContent project={project} tProject={tItems[i] || { id: project.id, name: project.id, tagline: "", description: "" }} />
              </HoloCard>
            </div>
          ))}
        </div>

        {/* Collection bar */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }} className="mt-14 flex justify-center">
          <div className="flex items-center gap-6 px-6 py-3 rounded-xl" style={{ background: "var(--oah-surface2)", border: "1px solid var(--oah-border)" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--oah-muted)" }}>{t("projects.collection")}</span>
            <span style={{ fontFamily: "'Bungee', cursive", color: "var(--oah-gold)", fontSize: "0.9rem" }}>3</span>
            <span style={{ fontFamily: "'Bungee', cursive", color: "var(--oah-muted)", fontSize: "0.9rem" }}>/ 10</span>
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-3 h-1.5 rounded-sm" style={{ background: i < 3 ? "var(--oah-gold)" : "var(--oah-surface2)" }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
