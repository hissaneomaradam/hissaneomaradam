import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

type EggType = "konami" | "logo";

interface Achievement {
  type: EggType;
  title: string;
  subtitle: string;
  icon: string;
}

const ACHIEVEMENTS: Record<EggType, Achievement> = {
  konami: {
    type: "konami",
    title: "CHEAT CODE ACTIVATED",
    subtitle: "You found the Konami Code. Respect.",
    icon: "🎮",
  },
  logo: {
    type: "logo",
    title: "PERSISTENCE UNLOCKED",
    subtitle: "You clicked the logo 5 times. You are genuinely curious.",
    icon: "🃏",
  },
};

export function useEasterEgg() {
  const logoClickCount = useRef(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout>>();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [visible, setVisible] = useState(false);
  const konamiIdx = useRef(0);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => setAchievement(null), 400);
  };

  const trigger = (egg: EggType) => {
    setAchievement(ACHIEVEMENTS[egg]);
    setVisible(true);
    setTimeout(dismiss, 5000);
  };

  // Konami code listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIdx.current]) {
        konamiIdx.current++;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          trigger("konami");
        }
      } else {
        konamiIdx.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Logo click tracker
  const handleLogoClick = () => {
    logoClickCount.current++;
    clearTimeout(logoTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      trigger("logo");
    } else {
      logoTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
    }
  };

  return { achievement, visible, dismiss, handleLogoClick };
}

export function EasterEggPopup({ achievement, visible, onDismiss }: {
  achievement: { title: string; subtitle: string; icon: string } | null;
  visible: boolean;
  onDismiss: () => void;
}) {
  const { theme } = useTheme();
  const isNeo = theme === "neocity";

  return (
    <AnimatePresence>
      {visible && achievement && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-8 left-1/2 z-[998] cursor-pointer"
          style={{ translateX: "-50%" }}
          onClick={onDismiss}
        >
          <div
            className="flex items-center gap-4 px-6 py-4 rounded-2xl"
            style={{
              background: isNeo
                ? "rgba(6,8,15,0.96)"
                : "rgba(11,19,32,0.96)",
              border: isNeo
                ? "1px solid rgba(0,217,255,0.3)"
                : "1px solid rgba(255,209,102,0.3)",
              boxShadow: isNeo
                ? "0 0 40px rgba(0,217,255,0.15), 0 20px 60px rgba(0,0,0,0.6)"
                : "0 0 40px rgba(255,209,102,0.12), 0 20px 60px rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
              maxWidth: "420px",
            }}
          >
            {/* Shimmer top */}
            <div
              className="absolute top-0 left-4 right-4 h-px"
              style={{
                background: isNeo
                  ? "linear-gradient(90deg, transparent, rgba(0,217,255,0.5), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,209,102,0.5), transparent)",
              }}
            />

            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: "2rem", lineHeight: 1 }}
            >
              {achievement.icon}
            </motion.div>

            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)", letterSpacing: "0.12em", marginBottom: "3px" }}>
                🏆 ACHIEVEMENT UNLOCKED
              </p>
              <p style={{
                fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive",
                fontSize: isNeo ? "0.7rem" : "0.85rem",
                letterSpacing: isNeo ? "0.08em" : "0.04em",
                color: isNeo ? "#00D9FF" : "#FFD166",
              }}>
                {achievement.title}
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: "var(--oah-fg2)", marginTop: "3px" }}>
                {achievement.subtitle}
              </p>
            </div>

            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)", marginLeft: "auto", whiteSpace: "nowrap" }}>
              tap to close
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
