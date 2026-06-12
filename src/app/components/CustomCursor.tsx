import { useEffect, useState, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";

type CursorContext = "default" | "button" | "project" | "spotify" | "connect" | "explore" | "open" | "legendary";

interface CursorState {
  context: CursorContext;
  label: string;
  color: string;
  scale: number;
}

const CONTEXT_MAP: Record<CursorContext, Omit<CursorState, "context">> = {
  default:  { label: "",         color: "#F4F7FA",  scale: 1    },
  button:   { label: "",         color: "#FFD166",  scale: 1.4  },
  project:  { label: "OPEN",     color: "#3A86FF",  scale: 1.6  },
  spotify:  { label: "♪",        color: "#1DB954",  scale: 1.5  },
  connect:  { label: "CONNECT",  color: "#00D9FF",  scale: 1.7  },
  explore:  { label: "EXPLORE",  color: "#7A5FFF",  scale: 1.6  },
  open:     { label: "OPEN",     color: "#FFD166",  scale: 1.5  },
  legendary:{ label: "★",        color: "#FFD166",  scale: 2    },
};

function detectContext(el: HTMLElement | null): CursorContext {
  if (!el) return "default";
  if (el.closest("[data-cursor='legendary']") || el.closest("[data-legendary]")) return "legendary";
  if (el.closest("[data-cursor='project']"))  return "project";
  if (el.closest("[data-cursor='spotify']"))  return "spotify";
  if (el.closest("[data-cursor='connect']"))  return "connect";
  if (el.closest("[data-cursor='explore']"))  return "explore";
  if (el.closest("[data-cursor='open']"))     return "open";
  if (el.closest("a, button, [role='button']")) return "button";
  return "default";
}

export function CustomCursor() {
  const { theme } = useTheme();
  const isNeo = theme === "neocity";

  const [ctx, setCtx] = useState<CursorContext>("default");
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Precise dot — no spring
  const dotX = useRef(0);
  const dotY = useRef(0);
  const dotRef = useRef<HTMLDivElement>(null);

  // Ring — medium spring
  const ringX = useSpring(0, { stiffness: 220, damping: 28 });
  const ringY = useSpring(0, { stiffness: 220, damping: 28 });

  // Glow — heavy spring
  const glowX = useSpring(0, { stiffness: 80, damping: 22 });
  const glowY = useSpring(0, { stiffness: 80, damping: 22 });

  // Trail positions
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const trailRef = useRef<Array<{ x: number; y: number; id: number }>>([]);
  const trailCounter = useRef(0);

  useEffect(() => {
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;

      // Instant dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }
      ringX.set(x); ringY.set(y);
      glowX.set(x); glowY.set(y);

      // Trail (every 3rd frame)
      trailCounter.current++;
      if (trailCounter.current % 3 === 0) {
        const id = Date.now();
        trailRef.current = [{ x, y, id }, ...trailRef.current.slice(0, 5)];
        setTrail([...trailRef.current]);
      }

      if (!visible) setVisible(true);
    };

    const onDetect = (e: MouseEvent) => {
      setCtx(detectContext(e.target as HTMLElement));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousemove", onDetect, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("click", onClick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onDetect);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("click", onClick);
    };
  }, []);

  const cfg = CONTEXT_MAP[ctx];
  const color = isNeo && ctx === "button" ? "#00D9FF" : cfg.color;
  const dotSize = 6;
  const ringSize = 32 * cfg.scale;
  const glowSize = ringSize * 3.5;
  const hasLabel = cfg.label !== "";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.25s" }}
      aria-hidden="true"
    >
      {/* Motion trail */}
      {trail.map((pt, i) => (
        <div
          key={pt.id}
          className="fixed rounded-full"
          style={{
            width: "4px", height: "4px",
            left: pt.x - 2, top: pt.y - 2,
            background: color,
            opacity: ((trail.length - i) / trail.length) * 0.15,
            transform: `scale(${1 - i * 0.12})`,
            transition: "none",
          }}
        />
      ))}

      {/* Glow blob */}
      <motion.div
        style={{
          x: glowX, y: glowY,
          translateX: "-50%", translateY: "-50%",
          position: "fixed",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          filter: "blur(6px)",
          transition: "width 0.3s, height 0.3s, background 0.3s",
        }}
      />

      {/* Outer ring */}
      <motion.div
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          position: "fixed",
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          opacity: ctx === "default" ? 0.3 : 0.6,
          scale: clicked ? 0.7 : 1,
          transition: "width 0.25s, height 0.25s, border-color 0.2s, opacity 0.2s",
        }}
      />

      {/* Click ripple */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            key="ripple"
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              x: ringX, y: ringY,
              translateX: "-50%", translateY: "-50%",
              position: "fixed",
              width: ringSize,
              height: ringSize,
              borderRadius: "50%",
              border: `1px solid ${color}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Core dot (instant — moved via DOM for performance) */}
      <div
        ref={dotRef}
        className="fixed rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          background: color,
          boxShadow: `0 0 ${dotSize * 2}px ${color}80`,
          transition: "background 0.2s, box-shadow 0.2s",
          willChange: "transform",
        }}
      />

      {/* Contextual label */}
      <AnimatePresence>
        {hasLabel && (
          <motion.div
            key={cfg.label}
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              x: ringX, y: ringY,
              translateX: "14px",
              translateY: "-18px",
              position: "fixed",
              fontFamily: isNeo ? "'Orbitron', sans-serif" : "'JetBrains Mono', monospace",
              fontSize: ctx === "legendary" ? "0.6rem" : "0.5rem",
              fontWeight: 700,
              color,
              letterSpacing: "0.1em",
              textShadow: `0 0 10px ${color}80`,
              whiteSpace: "nowrap",
            }}
          >
            {cfg.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight (only in Neo City on hover) */}
      {isNeo && ctx !== "default" && (
        <motion.div
          style={{
            x: glowX, y: glowY,
            translateX: "-50%", translateY: "-50%",
            position: "fixed",
            width: glowSize * 2,
            height: glowSize * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}06 0%, transparent 60%)`,
            transition: "width 0.3s, height 0.3s",
          }}
        />
      )}
    </div>
  );
}
