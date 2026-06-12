import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { Building2, Calendar, Award, MapPin } from "lucide-react";

function SectionLabel({ label, isNeo }: { label: string; isNeo: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, var(--oah-border))` }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--oah-muted)", letterSpacing: "0.2em" }}>
        {isNeo ? "◈" : "♦"} {label} {isNeo ? "◈" : "♦"}
      </span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, var(--oah-border), transparent)` }} />
    </div>
  );
}

export function Experience() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isNeo = theme === "neocity";
  const isRTL = i18n.language === "ar";

  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";
  const accent = "var(--oah-gold)";
  const secondary = "var(--oah-green)";

  return (
    <section id="experience" className="relative py-24 px-6 md:px-12 lg:px-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel label="EXPERIENCE" isNeo={isNeo} />
          <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em", marginBottom: "3rem" }}>
            {isNeo ? "FIELD RECORD" : "EXP LOG"}
          </h2>
        </motion.div>

        {/* Internship card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: isNeo
              ? "linear-gradient(135deg, rgba(0,217,255,0.04), rgba(10,14,26,0.9))"
              : "var(--oah-card-bg)",
            border: `1px solid ${isNeo ? "rgba(0,217,255,0.15)" : "var(--oah-card-border)"}`,
            boxShadow: isNeo
              ? "0 0 40px rgba(0,217,255,0.05), 0 20px 60px rgba(0,0,0,0.5)"
              : "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header stripe */}
          <div className="h-1" style={{ background: isNeo ? "linear-gradient(90deg, #00D9FF, #7A5FFF, #FF2D95)" : "linear-gradient(90deg, #FFD166, #E63946, #7B2CBF)" }} />

          <div className="p-8 md:p-10">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
              <div>
                {/* Company */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: isNeo ? "rgba(0,217,255,0.08)" : "rgba(255,209,102,0.08)", border: `1px solid ${isNeo ? "rgba(0,217,255,0.2)" : "rgba(255,209,102,0.2)"}` }}>
                    <Building2 size={18} style={{ color: accent }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: displayFont, fontSize: isNeo ? "0.85rem" : "1.1rem", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em" }}>
                      Innov Engineering &amp; Consulting
                    </h3>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>
                      INTERNSHIP
                    </p>
                  </div>
                </div>

                {/* Role */}
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", color: accent, marginBottom: "0.75rem", fontWeight: 600 }}>
                  Full-Stack Web Developer Intern
                </h4>

                {/* Description */}
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: "var(--oah-fg2)", lineHeight: 1.7 }}>
                  Completed a 20-day professional internship focused on web development. Contributed to real-world projects using modern frameworks, collaborated with engineering teams, and gained hands-on experience with production-level development workflows and best practices.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Laravel", "React", "MySQL", "REST API", "Agile"].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--oah-muted)", background: "var(--oah-surface2)", border: "1px solid var(--oah-border)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-3 text-right md:text-right">
                <div className="flex items-center gap-2 justify-end" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--oah-muted)" }}>
                  <Calendar size={12} />
                  <span>2025 · 20 Days</span>
                </div>
                <div className="flex items-center gap-2 justify-end" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--oah-muted)" }}>
                  <MapPin size={12} />
                  <span>Morocco</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg text-xs text-center" style={{ fontFamily: "'JetBrains Mono', monospace", color: secondary, background: isNeo ? "rgba(255,45,149,0.08)" : "rgba(14,90,71,0.1)", border: `1px solid ${isNeo ? "rgba(255,45,149,0.2)" : "rgba(14,90,71,0.25)"}` }}>
                  COMPLETED ✓
                </div>
              </div>
            </div>

            {/* Certificate placeholder */}
            <div className="mt-8 rounded-xl overflow-hidden" style={{ border: `1px dashed ${isNeo ? "rgba(0,217,255,0.2)" : "rgba(255,209,102,0.2)"}` }}>
              <div className="p-6 text-center" style={{ background: isNeo ? "rgba(0,217,255,0.02)" : "rgba(255,209,102,0.02)" }}>
                <Award size={28} style={{ color: accent, margin: "0 auto 0.75rem" }} />
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>
                  [ INTERNSHIP CERTIFICATE — PLACEHOLDER ]
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "var(--oah-fg2)", marginTop: "0.5rem" }}>
                  Certificate from Innov Engineering &amp; Consulting · 2025
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 rounded-2xl overflow-hidden"
          style={{
            background: isNeo ? "linear-gradient(135deg, rgba(122,95,255,0.04), rgba(10,14,26,0.9))" : "var(--oah-card-bg)",
            border: `1px solid ${isNeo ? "rgba(122,95,255,0.15)" : "var(--oah-card-border)"}`,
          }}
        >
          <div className="h-1" style={{ background: isNeo ? "linear-gradient(90deg, #7A5FFF, #00D9FF)" : "linear-gradient(90deg, #7B2CBF, #3A86FF)" }} />
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isNeo ? "rgba(122,95,255,0.08)" : "rgba(123,44,191,0.08)", border: `1px solid ${isNeo ? "rgba(122,95,255,0.2)" : "rgba(123,44,191,0.2)"}` }}>
                <Award size={18} style={{ color: isNeo ? "#7A5FFF" : "#7B2CBF" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: displayFont, fontSize: isNeo ? "0.85rem" : "1.1rem", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em" }}>
                  CMC Béni Mellal — OFPPT
                </h3>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>
                  EDUCATION · 2024–PRESENT
                </p>
              </div>
            </div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", color: isNeo ? "#7A5FFF" : "#7B2CBF", fontWeight: 600, marginBottom: "0.5rem" }}>
              Full-Stack Web Development — Classe d'Excellence
            </h4>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: "var(--oah-fg2)", lineHeight: 1.7 }}>
              Member of the inaugural Classe d'Excellence cohort at CMC Béni Mellal. A rigorous program combining full-stack development, project-based learning, and industry mentorship — designed for top-tier students with startup and product ambitions.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: isNeo ? "#7A5FFF" : "#7B2CBF", background: isNeo ? "rgba(122,95,255,0.08)" : "rgba(123,44,191,0.08)", border: `1px solid ${isNeo ? "rgba(122,95,255,0.2)" : "rgba(123,44,191,0.2)"}` }}>
              ★ CLASSE D'EXCELLENCE — FIRST EDITION
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
