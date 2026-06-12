import { motion } from "motion/react";
import { useState, useEffect } from "react";

const codeLines = [
  { indent: 0, text: "const adam = {", color: "#D8DEE9" },
  { indent: 1, text: 'role: "Full-Stack Developer",', color: "#A3FF12" },
  { indent: 1, text: 'location: "Morocco 🇲🇦",', color: "#00E5FF" },
  { indent: 1, text: "skills: [", color: "#D8DEE9" },
  { indent: 2, text: '"React", "Laravel",', color: "#8B5CF6" },
  { indent: 2, text: '"Node.js", "TypeScript",', color: "#8B5CF6" },
  { indent: 2, text: '"MongoDB", "MySQL"', color: "#8B5CF6" },
  { indent: 1, text: "],", color: "#D8DEE9" },
  { indent: 1, text: 'status: "Open to work ✨",', color: "#A3FF12" },
  { indent: 0, text: "};", color: "#D8DEE9" },
];

export function IMacMockup() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= codeLines.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 180);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, #00E5FF 0%, #8B5CF6 50%, transparent 80%)",
          transform: "scale(1.2)",
        }}
      />

      {/* iMac shell */}
      <div
        className="relative rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)",
          padding: "10px",
        }}
      >
        {/* Screen bezel */}
        <div
          className="rounded-[20px] overflow-hidden"
          style={{
            background: "#050810",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Menu bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span
              className="ml-auto text-[10px] opacity-30"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#D8DEE9" }}
            >
              adam.js
            </span>
          </div>

          {/* Code area */}
          <div className="p-5 min-h-[200px]" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", lineHeight: "1.8" }}>
            {codeLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="flex">
                <span className="opacity-20 mr-4 select-none" style={{ color: "#D8DEE9", minWidth: "1.5rem", textAlign: "right" }}>
                  {i + 1}
                </span>
                <span style={{ color: line.color, paddingLeft: `${line.indent * 16}px` }}>
                  {line.text}
                </span>
              </div>
            ))}
            {visibleLines < codeLines.length && (
              <div className="flex">
                <span className="opacity-20 mr-4" style={{ color: "#D8DEE9", minWidth: "1.5rem", textAlign: "right" }}>
                  {visibleLines + 1}
                </span>
                <span
                  className="inline-block w-2 h-4 animate-pulse"
                  style={{ background: "#00E5FF", verticalAlign: "middle" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stand neck */}
      <div
        className="mx-auto mt-0"
        style={{
          width: "40px",
          height: "20px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.04))",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      {/* Stand base */}
      <div
        className="mx-auto rounded-full"
        style={{
          width: "100px",
          height: "8px",
          background: "linear-gradient(to right, rgba(255,255,255,0.03), rgba(255,255,255,0.1), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
    </motion.div>
  );
}
