import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const CARD_SUITS = ["♠", "♥", "♦", "♣", "♠", "♥", "♦"];

interface DeckCard {
  id: number;
  suit: string;
  value: string;
  delay: number;
}

const deckCards: DeckCard[] = [
  { id: 0, suit: "♠", value: "A", delay: 0 },
  { id: 1, suit: "♥", value: "K", delay: 0.05 },
  { id: 2, suit: "♦", value: "Q", delay: 0.1 },
  { id: 3, suit: "♣", value: "J", delay: 0.15 },
  { id: 4, suit: "♠", value: "10", delay: 0.2 },
];

const LOADING_MESSAGES = [
  "Shuffling deck...",
  "Dealing cards...",
  "Preparing the table...",
  "Ready to play!",
];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [explode, setExplode] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = 2400;
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const p = Math.min(100, Math.round((step / steps) * 100));
      setProgress(p);
      setMsgIndex(Math.min(3, Math.floor((p / 100) * 4)));

      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setExplode(true);
          setTimeout(() => {
            setDone(true);
            onComplete();
          }, 900);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#07110D" }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(11,93,69,0.15) 0%, transparent 60%)",
            }}
          />

          {/* CRT grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />

          {/* Floating suit symbols */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CARD_SUITS.map((suit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: [0, 0.05, 0.05, 0], y: [80, -120] }}
                transition={{ duration: 4 + i * 0.5, delay: i * 0.4, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  left: `${10 + i * 13}%`,
                  bottom: 0,
                  fontFamily: "serif",
                  fontSize: `${2 + (i % 3)}rem`,
                  color: "#F8F1DC",
                }}
              >
                {suit}
              </motion.div>
            ))}
          </div>

          {/* Deck of cards */}
          <div className="relative mb-16" style={{ height: "180px", width: "120px" }}>
            {deckCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ y: 0, x: 0, rotate: 0, opacity: 1, scale: 1 }}
                animate={
                  explode
                    ? {
                        x: [(i - 2) * 160],
                        y: [i % 2 === 0 ? -200 : 200],
                        rotate: [(i - 2) * 25],
                        opacity: [0],
                        scale: [0.7],
                      }
                    : {
                        y: [0, -4, 0],
                        rotate: [-(i * 2), -(i * 2) + 2, -(i * 2)],
                      }
                }
                transition={
                  explode
                    ? { duration: 0.6, ease: "easeOut" }
                    : {
                        duration: 1.5 + i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: card.delay,
                      }
                }
                style={{
                  position: "absolute",
                  top: `${i * 3}px`,
                  left: `${i * 1}px`,
                  zIndex: deckCards.length - i,
                }}
              >
                <div
                  className="w-20 h-28 rounded-xl flex flex-col items-center justify-between p-2.5 relative overflow-hidden"
                  style={{
                    background: i === 0
                      ? "linear-gradient(145deg, #F8F1DC, #ede5cb)"
                      : `linear-gradient(145deg, #0e1e2e, #07110D)`,
                    border: i === 0
                      ? "1.5px solid rgba(255,255,255,0.4)"
                      : "1.5px solid rgba(255,209,102,0.2)",
                    boxShadow:
                      i === 0
                        ? "0 8px 30px rgba(0,0,0,0.7), 0 0 20px rgba(255,209,102,0.2)"
                        : "0 4px 15px rgba(0,0,0,0.5)",
                  }}
                >
                  {i === 0 ? (
                    <>
                      <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1rem", color: "#E63946", alignSelf: "flex-start" }}>
                        {card.value}
                      </span>
                      <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.5rem", color: "#FFD166", textShadow: "0 0 20px rgba(255,209,102,0.5)" }}>
                        OAH
                      </span>
                      <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1rem", color: "#E63946", alignSelf: "flex-end", transform: "rotate(180deg)" }}>
                        {card.value}
                      </span>
                    </>
                  ) : (
                    <div
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{
                        background: "repeating-linear-gradient(45deg, rgba(255,209,102,0.04) 0px, rgba(255,209,102,0.04) 1px, transparent 1px, transparent 6px)",
                      }}
                    >
                      <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.5rem", color: "rgba(255,209,102,0.15)" }}>
                        {card.suit}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <div
              style={{
                fontFamily: "'Bungee', cursive",
                fontSize: "2.5rem",
                color: "#F8F1DC",
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
            >
              <span style={{ color: "#FFD166" }}>♠</span> OAH
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                color: "#4a5a6a",
                letterSpacing: "0.2em",
                marginTop: "6px",
              }}
            >
              THE DEVELOPER DECK
            </div>
          </motion.div>

          {/* Progress */}
          <div className="w-64 flex flex-col items-center gap-3">
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(248,241,220,0.06)" }}
            >
              <motion.div
                style={{ width: `${progress}%` }}
                className="h-full rounded-full"
                transition={{ ease: "linear" }}
                css={{
                  background: "linear-gradient(90deg, #0B5D45, #FFD166, #E63946)",
                  boxShadow: "0 0 10px rgba(255,209,102,0.5)",
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #0B5D45, #FFD166, #E63946)",
                    boxShadow: "0 0 10px rgba(255,209,102,0.5)",
                    width: "100%",
                  }}
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between w-full">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#4a5a6a",
                }}
              >
                {LOADING_MESSAGES[msgIndex]}
              </span>
              <span
                style={{
                  fontFamily: "'Bungee', cursive",
                  fontSize: "0.85rem",
                  color: "#FFD166",
                  textShadow: "0 0 12px rgba(255,209,102,0.5)",
                }}
              >
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
