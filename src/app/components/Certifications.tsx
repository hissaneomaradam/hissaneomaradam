import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { FileText, Award, ExternalLink } from "lucide-react";

const certs = [
  { name: "MongoDB Aggregation", issuer: "MongoDB University", year: "2024", color: "#00ED64", icon: "🍃" },
  { name: "MongoDB Aggregation with Node.js", issuer: "MongoDB University", year: "2024", color: "#00ED64", icon: "🍃" },
  { name: "Python Essentials 1", issuer: "Cisco NetAcad", year: "2024", color: "#3B82F6", icon: "🐍" },
  { name: "Introduction to Modern AI", issuer: "Cisco NetAcad", year: "2024", color: "#8B5CF6", icon: "🤖" },
  { name: "Introduction to Cybersecurity", issuer: "Cisco NetAcad", year: "2024", color: "#EF4444", icon: "🛡️" },
  { name: "Computer Hardware Basics", issuer: "Cisco NetAcad", year: "2024", color: "#F59E0B", icon: "💻" },
  { name: "Introduction to IoT", issuer: "Cisco NetAcad", year: "2024", color: "#10B981", icon: "📡" },
];

function SectionLabel({ label, isNeo }: { label: string; isNeo: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, var(--oah-border))" }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--oah-muted)", letterSpacing: "0.2em" }}>
        {isNeo ? "◈" : "♦"} {label} {isNeo ? "◈" : "♦"}
      </span>
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, var(--oah-border), transparent)" }} />
    </div>
  );
}

function CertCard({ cert, index, isNeo }: { cert: typeof certs[0]; index: number; isNeo: boolean }) {
  const [hovered, setHovered] = useState(false);
  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden flex flex-col relative cursor-pointer"
      style={{
        background: isNeo
          ? `linear-gradient(135deg, rgba(${hexToRgb(cert.color)},0.04), rgba(10,14,26,0.9))`
          : "var(--oah-card-bg)",
        border: `1px solid ${hovered ? cert.color + "40" : isNeo ? "rgba(0,217,255,0.1)" : "var(--oah-card-border)"}`,
        boxShadow: hovered ? `0 0 30px ${cert.color}15, 0 20px 50px rgba(0,0,0,0.4)` : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Color stripe */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.color}60)` }} />

      {/* Placeholder image area */}
      <div
        className="flex flex-col items-center justify-center gap-2 py-8"
        style={{ background: `${cert.color}06`, borderBottom: `1px solid ${cert.color}15` }}
      >
        <span style={{ fontSize: "2rem" }}>{cert.icon}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}>
          <Award size={16} style={{ color: cert.color }} />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: cert.color + "80", letterSpacing: "0.12em" }}>
          [ CERTIFICATE PLACEHOLDER ]
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h4 style={{ fontFamily: displayFont, fontSize: isNeo ? "0.6rem" : "0.75rem", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em", lineHeight: 1.4 }}>
            {cert.name}
          </h4>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "var(--oah-muted)", marginTop: "0.35rem", letterSpacing: "0.06em" }}>
            {cert.issuer}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: `1px solid var(--oah-border)` }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "var(--oah-muted)" }}>
            {cert.year}
          </span>
          <div className="flex items-center gap-1.5">
            <FileText size={10} style={{ color: cert.color }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: cert.color, letterSpacing: "0.06em" }}>
              PDF
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export function Certifications() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isNeo = theme === "neocity";
  const isRTL = i18n.language === "ar";

  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";

  return (
    <section id="certifications" className="relative py-24 px-6 md:px-12 lg:px-20" dir={isRTL ? "rtl" : "ltr"}>
      {/* Alt background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--oah-section-alt)" }} />

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <SectionLabel label="POWER-UPS" isNeo={isNeo} />
          <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em" }}>
            {isNeo ? "CLEARANCES" : "CERTIFICATIONS"}
          </h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "var(--oah-fg2)", marginTop: "0.75rem", maxWidth: "480px" }}>
            {isNeo
              ? "Verified clearances from authorized institutions."
              : "Collected power-ups from leading platforms."}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {certs.map((cert, i) => (
            <CertCard key={cert.name} cert={cert} index={i} isNeo={isNeo} />
          ))}
        </div>

        {/* Add more certs CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-6 flex items-center justify-center gap-2"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--oah-muted)" }}
        >
          <ExternalLink size={12} />
          <span>More certifications coming soon</span>
        </motion.div>
      </div>
    </section>
  );
}
