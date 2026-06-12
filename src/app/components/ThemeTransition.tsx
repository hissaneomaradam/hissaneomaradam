import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeTransition() {
  const { isTransitioning, theme } = useTheme();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center"
          style={{
            background: theme === "neocity"
              ? "radial-gradient(ellipse at center, rgba(0,217,255,0.15) 0%, rgba(6,8,15,0.95) 60%)"
              : "radial-gradient(ellipse at center, rgba(255,209,102,0.15) 0%, rgba(11,19,32,0.95) 60%)",
          }}
        >
          {/* Particle burst */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 360;
            const dist = 120 + Math.random() * 80;
            const x = Math.cos((angle * Math.PI) / 180) * dist;
            const y = Math.sin((angle * Math.PI) / 180) * dist;
            const color = theme === "neocity"
              ? ["#00D9FF", "#FF2D95", "#7A5FFF", "#FF7A00"][i % 4]
              : ["#FFD166", "#E63946", "#7B2CBF", "#3A86FF"][i % 4];

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x, y, opacity: 0, scale: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full"
                style={{ background: color, boxShadow: `0 0 10px ${color}` }}
              />
            );
          })}

          {/* Center flash */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-12 h-12 rounded-full absolute"
            style={{
              background: theme === "neocity" ? "rgba(0,217,255,0.3)" : "rgba(255,209,102,0.3)",
            }}
          />

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 text-center"
          >
            <p style={{
              fontFamily: theme === "neocity" ? "'Orbitron', sans-serif" : "'Bungee', cursive",
              fontSize: theme === "neocity" ? "0.8rem" : "1rem",
              color: theme === "neocity" ? "#00D9FF" : "#FFD166",
              letterSpacing: theme === "neocity" ? "0.2em" : "0.08em",
              textShadow: `0 0 20px ${theme === "neocity" ? "#00D9FF" : "#FFD166"}`,
            }}>
              {theme === "neocity" ? "ENTERING NEO CITY" : "SHUFFLING DECK..."}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
