import { motion, useMotionValue, useSpring } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

function AnimatedCounter({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{value}</span>;
}

const stats = [
  { label: "Frontend", value: 90, suit: "♠", color: "#118AB2" },
  { label: "Backend", value: 85, suit: "♥", color: "#E63946" },
  { label: "Databases", value: 80, suit: "♦", color: "#FFD166" },
  { label: "UI / UX", value: 75, suit: "♣", color: "#0B5D45" },
  { label: "Problem Solving", value: 92, suit: "♠", color: "#8B5CF6" },
];

const playerCards = [
  { label: "Level", value: "DEVOWFS", sub: "2nd Year", color: "#FFD166" },
  { label: "Status", value: "OPEN", sub: "For Work", color: "#A3FF12" },
  { label: "Location", value: "MA", sub: "Khouribga / Béni Mellal", color: "#118AB2" },
  { label: "Class", value: "EXC", sub: "Excellence", color: "#E63946" },
];

function PlayerChip({ label, value, sub, color }: typeof playerCards[0]) {
  return (
    <div
      className="flex flex-col items-center justify-center p-4 rounded-xl relative overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${color}0a, ${color}04)`,
        border: `1px solid ${color}25`,
        minWidth: "80px",
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}20 0%, transparent 60%)`,
        }}
      />
      <span
        className="relative text-xs tracking-widest mb-1"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4a5a6a" }}
      >
        {label}
      </span>
      <span
        className="relative"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          fontSize: "1.2rem",
          color,
          textShadow: `0 0 15px ${color}60`,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      <span className="relative text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: "#4a5a6a" }}>
        {sub}
      </span>
    </div>
  );
}

const terminal = [
  { prompt: "$", cmd: "whoami", out: "Omar Adam Hissane" },
  { prompt: "$", cmd: "cat class.txt", out: "Classe d'Excellence " },
  { prompt: "$", cmd: "echo $STACK", out: "React · Laravel · Node.js · MongoDB · TypeScript · MySQL" },
  { prompt: "$", cmd: "ls passions/", out: "products/  startups/  clean-ui/  backend-logic/  real-apps/  cooking/  music/" },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="py-28 px-6 md:px-12 lg:px-20 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span
            className="text-xs tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--oah-gold)" }}
          >
            ♦ Player Profile
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--oah-fg)",
            }}
          >
            The Developer
          </h2>
        </motion.div>

        {/* Player chips row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {playerCards.map((chip, i) => (
            <motion.div
              key={chip.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <PlayerChip {...chip} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              className="rounded-2xl p-7 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0d1f2e, #07111F)",
                border: "1px solid rgba(248,241,220,0.07)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]"
                style={{ fontFamily: "serif", fontSize: "8rem", color: "#F8F1DC", lineHeight: 1, userSelect: "none" }}
              >
                ♣
              </div>

              <div className="flex items-center justify-between mb-6">
                <p className="text-xs tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4a5a6a" }}>
                  Player Stats
                </p>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#FFD166" }}>
                    SCORE: <AnimatedCounter target={8420} />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {stats.map((stat, i) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span style={{ color: stat.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>{stat.suit}</span>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#F8F1DC" }}>
                          {stat.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: stat.color }}>
                          <AnimatedCounter target={stat.value} />
                        </span>
                        {/* Mini card pips */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div
                              key={j}
                              className="w-2 h-2 rounded-sm"
                              style={{
                                background: j < Math.floor(stat.value / 20) ? stat.color : `${stat.color}20`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(248,241,220,0.05)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${stat.value}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                          boxShadow: `0 0 8px ${stat.color}60`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Terminal card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0a1825, #07111F)",
                border: "1px solid rgba(248,241,220,0.07)",
              }}
            >
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ borderBottom: "1px solid rgba(248,241,220,0.05)", background: "rgba(248,241,220,0.02)" }}
              >
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-auto text-xs opacity-20" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F8F1DC" }}>
                  developer.sh
                </span>
              </div>
              <div className="p-6 flex flex-col gap-4" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
                {terminal.map((line, i) => (
                  <div key={i}>
                    <div className="flex gap-2">
                      <span style={{ color: "#FFD166" }}>{line.prompt}</span>
                      <span style={{ color: "#F8F1DC" }}>{line.cmd}</span>
                    </div>
                    <div className="ml-4 mt-1" style={{ color: "#5a6878" }}>{line.out}</div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span style={{ color: "#FFD166" }}>$</span>
                  <span className="inline-block w-2 h-4 animate-pulse" style={{ background: "#FFD166" }} />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-5 flex flex-col gap-3">
              {[
                { year: "2024", label: "Started OFPPT / CMC Béni Mellal", color: "#118AB2" },
                { year: "2024", label: "Classe d'Excellence — First Edition", color: "#FFD166" },
                { year: "2025", label: "3rd Place — INJAZ Al-Maghrib Regional", color: "#E63946" },
                { year: "2026", label: "Open for new opportunities", color: "#0B5D45" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace", color: item.color, minWidth: "2.8rem" }}>
                    {item.year}
                  </span>
                  <div className="shrink-0 w-2 h-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                  <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "#5a6878" }}>{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
