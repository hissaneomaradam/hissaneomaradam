import { motion, useSpring, useMotionValue } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react";

const typingText = "Ready to build something meaningful?";

const hand = [
  { value: "10", suit: "♠", suitColor: "#118AB2", label: "Logic" },
  { value: "J",  suit: "♥", suitColor: "#E63946", label: "Design" },
  { value: "Q",  suit: "♦", suitColor: "#FFD166", label: "Scale" },
  { value: "K",  suit: "♣", suitColor: "#0B5D45", label: "Product" },
  { value: "A",  suit: "♠", suitColor: "#F8F1DC", label: "Ship" },
];

function FinalCard({ card, index, inView }: { card: typeof hand[0]; index: number; inView: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPos({ x, y });
    rotateX.set((y - 0.5) * -20);
    rotateY.set((x - 0.5) * 20);
  };
  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
    setPos({ x: 0.5, y: 0.5 });
  };

  const isAce = card.value === "A";
  const foilAngle = Math.atan2(pos.y - 0.5, pos.x - 0.5) * (180 / Math.PI);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotate: (index - 2) * 6 }}
      animate={inView ? { opacity: 1, y: 0, rotate: (index - 2) * 3 } : {}}
      transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      whileHover={{ y: -20, rotate: 0, zIndex: 20, scale: 1.08 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 600,
        marginLeft: index === 0 ? 0 : "-20px",
        zIndex: hovered ? 20 : index,
        cursor: "pointer",
      }}
    >
      <div
        className="w-[70px] h-[105px] sm:w-20 sm:h-28 rounded-xl relative overflow-hidden"
        style={{
          background: isAce
            ? "linear-gradient(145deg, #F8F1DC, #ede5cb)"
            : "linear-gradient(145deg, #F4EDD6, #e6dcc0)",
          border: isAce ? "2px solid rgba(255,209,102,0.5)" : "1.5px solid rgba(255,255,255,0.25)",
          boxShadow: isAce
            ? `0 12px 40px rgba(0,0,0,0.7), 0 0 30px rgba(255,209,102,0.3)`
            : `0 8px 25px rgba(0,0,0,0.6), 0 0 12px ${card.suitColor}20`,
        }}
      >
        {/* Foil layer on hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-xl"
          style={{
            opacity: hovered ? 0.8 : 0,
            background: `
              radial-gradient(ellipse at ${pos.x * 100}% ${pos.y * 100}%, rgba(255,255,255,0.25) 0%, transparent 50%),
              linear-gradient(${foilAngle}deg, rgba(255,215,0,0.2), rgba(255,100,100,0.15), rgba(150,50,255,0.15), rgba(0,200,255,0.15))
            `,
            mixBlendMode: "overlay",
          }}
        />

        {/* Shine sweep */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: "-50%",
              width: "35%",
              height: "200%",
              background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.4), transparent)",
              opacity: hovered ? 0.8 : 0,
              animation: hovered ? "shimmer 1.2s ease-in-out infinite" : "none",
              transition: "opacity 0.2s",
            }}
          />
        </div>

        {/* Card content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full p-2">
          <div
            className="self-start"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: "0.9rem",
              color: isAce ? "#07111F" : card.suitColor === "#F8F1DC" ? "#07111F" : card.suitColor,
              lineHeight: 1,
            }}
          >
            {card.value}
            <span
              className="block text-[0.65rem]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: ["#E63946", "#F8F1DC"].includes(card.suitColor) ? card.suitColor === "#F8F1DC" ? "#07111F" : card.suitColor : card.suitColor,
              }}
            >
              {card.suit}
            </span>
          </div>

          <span
            className="text-[0.48rem] font-bold text-center uppercase tracking-widest"
            style={{ color: isAce ? "#5a6878" : "#8a7a6a", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {card.label}
          </span>

          <div
            className="self-end rotate-180"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: "0.9rem",
              color: isAce ? "#07111F" : card.suitColor === "#F8F1DC" ? "#07111F" : card.suitColor,
              lineHeight: 1,
            }}
          >
            {card.value}
            <span className="block text-[0.65rem]">{card.suit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView && !started) setStarted(true);
  }, [inView, started]);
  useEffect(() => {
    if (!started || displayed.length >= typingText.length) return;
    const t = setTimeout(() => setDisplayed(typingText.slice(0, displayed.length + 1)), 45);
    return () => clearTimeout(t);
  }, [started, displayed]);

  return (
    <section
      id="contact"
      ref={ref}
      className="py-28 px-6 md:px-12 lg:px-20 relative"
      style={{ background: "rgba(11,93,69,0.04)" }}
    >
      {/* Endgame glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(255,209,102,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-xs tracking-widest uppercase mb-3 block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FFD166" }}>
            ♣ Final Boss
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              letterSpacing: "-0.04em",
              color: "#F8F1DC",
              minHeight: "4rem",
            }}
          >
            {displayed}
            {displayed.length < typingText.length && (
              <span
                className="inline-block w-0.5 h-10 ml-1 align-middle"
                style={{ background: "#FFD166", animation: "shimmer 0.8s ease-in-out infinite" }}
              />
            )}
          </h2>
        </motion.div>

        {/* Royal flush hand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-center my-14"
          style={{ perspective: "800px" }}
        >
          {hand.map((card, i) => (
            <FinalCard key={i} card={card} index={i} inView={inView} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="text-sm mb-10"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#2a3a4a" }}
        >
          // hover the cards · choose your move
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="mailto:omaradamhissane@gmail.com"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 group"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #FFD166, #E63946)",
              color: "#07111F",
              boxShadow: "0 0 40px rgba(255,209,102,0.3)",
            }}
          >
            <Mail size={18} />
            Deal Me In
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com/hissaneomaradam"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl transition-all duration-200 hover:scale-105 hover:border-[rgba(248,241,220,0.2)]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#F8F1DC",
              background: "rgba(248,241,220,0.04)",
              border: "1px solid rgba(248,241,220,0.1)",
            }}
          >
            <Github size={18} />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/hissaneomaradam/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl transition-all duration-200 hover:scale-105"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#F8F1DC",
              background: "rgba(248,241,220,0.04)",
              border: "1px solid rgba(248,241,220,0.1)",
            }}
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </motion.div>

        {/* Footer */}
        <div
          className="mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: "1px solid rgba(248,241,220,0.05)", fontFamily: "'JetBrains Mono', monospace", color: "#1a2a3a" }}
        >
          <span>© 2026 — Omar Adam Hissane</span>
          <span style={{ color: "#2a3a4a" }}>♠ ♥ The Developer Deck ♦ ♣</span>
        </div>
      </div>
    </section>
  );
}
