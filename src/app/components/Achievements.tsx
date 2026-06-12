import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Trophy, Star, Award, Zap, Shield } from "lucide-react";

const achievements = [
  {
    hand: "GOLD HAND",
    suit: "♠",
    icon: Star,
    title: "Classe d'Excellence",
    org: "CMC Béni Mellal — First Edition",
    year: "2024",
    color: "#FFD166",
    chips: 4,
  },
  {
    hand: "FLUSH",
    suit: "♥",
    icon: Trophy,
    title: "3rd Place — Regional Final",
    org: "INJAZ Al-Maghrib Student Company Program",
    year: "2025",
    color: "#E63946",
    chips: 3,
  },
  {
    hand: "STRAIGHT",
    suit: "♦",
    icon: Award,
    title: "MongoDB Certifications",
    org: "MongoDB University",
    year: "2025",
    color: "#118AB2",
    chips: 3,
  },
  {
    hand: "PAIR",
    suit: "♣",
    icon: Zap,
    title: "Hackathon Participant",
    org: "Innovation & Startup Programs",
    year: "2025",
    color: "#0B5D45",
    chips: 2,
  },
];

const certs = [
  { name: "MongoDB Aggregation", issuer: "MongoDB", suit: "♦", color: "#FFD166" },
  { name: "MongoDB with Node.js", issuer: "MongoDB", suit: "♦", color: "#FFD166" },
  { name: "Python Essentials 1", issuer: "Cisco NetAcad", suit: "♠", color: "#118AB2" },
  { name: "Intro to Modern AI", issuer: "Cisco NetAcad", suit: "♥", color: "#8B5CF6" },
  { name: "Intro to Cybersecurity", issuer: "Cisco NetAcad", suit: "♥", color: "#E63946" },
  { name: "Computer Hardware Basics", issuer: "Cisco NetAcad", suit: "♣", color: "#5a6878" },
];

function PokerChips({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full"
          style={{
            background: i < count ? color : "rgba(248,241,220,0.06)",
            border: `1px solid ${i < count ? color + "60" : "rgba(248,241,220,0.06)"}`,
            boxShadow: i < count ? `0 0 6px ${color}50` : "none",
          }}
        />
      ))}
    </div>
  );
}

export function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const certRef = useRef(null);
  const certInView = useInView(certRef, { once: true, margin: "-80px" });

  return (
    <>
      <section
        id="achievements"
        ref={ref}
        className="py-28 px-6 md:px-12 lg:px-20"
        style={{ background: "rgba(11,93,69,0.03)" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <span className="text-xs tracking-widest uppercase mb-3 block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FFD166" }}>
              ♥ Winning Hands
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                color: "#F8F1DC",
              }}
            >
              Achievements
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {achievements.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="rounded-2xl p-6 relative overflow-hidden cursor-default"
                  style={{
                    background: "linear-gradient(145deg, #0d1f2e, #07111F)",
                    border: `1px solid ${item.color}20`,
                    boxShadow: `0 0 0 rgba(0,0,0,0)`,
                    transition: "all 0.25s ease",
                  }}
                >
                  {/* Background suit */}
                  <div
                    className="absolute -bottom-4 -right-4 text-8xl opacity-[0.04] select-none"
                    style={{ color: item.color, fontFamily: "serif" }}
                  >
                    {item.suit}
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: `${item.color}15`,
                          border: `1px solid ${item.color}30`,
                          boxShadow: `0 0 20px ${item.color}20`,
                        }}
                      >
                        <Icon size={18} style={{ color: item.color }} />
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: item.color,
                          background: `${item.color}10`,
                          border: `1px solid ${item.color}25`,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {item.hand}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#2a3a4a" }}>
                        {item.year}
                      </span>
                      <PokerChips count={item.chips} color={item.color} />
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "#F8F1DC",
                      letterSpacing: "-0.01em",
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: item.color }}>
                    {item.org}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section ref={certRef} className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={certInView ? { opacity: 1, y: 0 } : {}}
            className="mb-12"
          >
            <span className="text-xs tracking-widest uppercase mb-3 block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FFD166" }}>
              ♦ Power-Ups
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                letterSpacing: "-0.03em",
                color: "#F8F1DC",
              }}
            >
              Certifications
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={certInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.04, y: -4 }}
                className="rounded-xl p-5 flex items-center gap-4 relative overflow-hidden cursor-default"
                style={{
                  background: "linear-gradient(145deg, #0d1f2e, #07111F)",
                  border: `1px solid ${cert.color}15`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm"
                  style={{
                    background: `${cert.color}12`,
                    border: `1px solid ${cert.color}25`,
                    color: cert.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    boxShadow: `0 0 12px ${cert.color}25`,
                  }}
                >
                  {cert.suit}
                </div>
                <div className="min-w-0">
                  <h4
                    className="truncate"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#F8F1DC" }}
                  >
                    {cert.name}
                  </h4>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: cert.color }}>
                    {cert.issuer}
                  </p>
                </div>
                {/* Power-up gem */}
                <Shield size={12} className="ml-auto shrink-0 opacity-20" style={{ color: cert.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
