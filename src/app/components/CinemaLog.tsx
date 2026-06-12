import { motion, AnimatePresence } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { ExternalLink, Film, Star, Eye } from "lucide-react";

const LETTERBOXD_URL = "https://boxd.it/d6wDf";

const favorites = [
  { title: "Blade Runner 2049", year: 2017, rating: 5, director: "Denis Villeneuve", genre: "Sci-Fi", emoji: "🌧️" },
  { title: "Dune: Part Two",    year: 2024, rating: 5, director: "Denis Villeneuve", genre: "Sci-Fi", emoji: "🏜️" },
  { title: "Interstellar",      year: 2014, rating: 5, director: "Christopher Nolan", genre: "Sci-Fi", emoji: "🌌" },
  { title: "Her",               year: 2013, rating: 5, director: "Spike Jonze",      genre: "Drama",  emoji: "🤖" },
  { title: "Ex Machina",        year: 2014, rating: 4, director: "Alex Garland",     genre: "Sci-Fi", emoji: "⚡" },
  { title: "The Social Network",year: 2010, rating: 5, director: "David Fincher",    genre: "Drama",  emoji: "💻" },
];

const recentlyWatched = [
  { title: "Arrival",           year: 2016, emoji: "🛸" },
  { title: "2001: A Space Odyssey", year: 1968, emoji: "🪐" },
  { title: "Tron: Legacy",      year: 2010, emoji: "🔷" },
  { title: "Moon",              year: 2009, emoji: "🌙" },
];

const directors = ["Denis Villeneuve", "Christopher Nolan", "David Fincher", "Alex Garland", "Ridley Scott"];
const genres    = [
  { name: "Sci-Fi",   pct: 48, color: "#00D9FF" },
  { name: "Drama",    pct: 24, color: "#7A5FFF" },
  { name: "Thriller", pct: 16, color: "#FF2D95" },
  { name: "Mystery",  pct: 12, color: "#FF7A00" },
];

const quotes = [
  { text: "All those moments will be lost in time, like tears in rain.", film: "Blade Runner", year: 1982 },
  { text: "I don't want to survive. I want to live.", film: "12 Years a Slave", year: 2013 },
  { text: "Some things are not meant to be touched, but exist only to be glimpsed.", film: "Arrival", year: 2016 },
];

function SectionLabel({ label, isNeo }: { label: string; isNeo: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, var(--oah-border))" }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--oah-muted)", letterSpacing: "0.2em" }}>
        {isNeo ? "◈" : "♦"} {label} {isNeo ? "◈" : "♦"}
      </span>
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, var(--oah-border), transparent)" }} />
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={9} fill={i <= n ? "#FFD166" : "transparent"} style={{ color: i <= n ? "#FFD166" : "rgba(255,209,102,0.2)" }} />
      ))}
    </div>
  );
}

function BalatroMovieCard({ movie, index }: { movie: typeof favorites[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const SUITS = ["♠","♥","♦","♣"];
  const suit = SUITS[index % 4];
  const rankLabels = ["A","K","Q","J","10","9"];
  const rank = rankLabels[index] || "J";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: (index % 2 === 0 ? -1 : 1) * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setFlipped(!flipped)}
      style={{ perspective: "800px", cursor: "pointer" }}
      data-cursor="open"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d", position: "relative", height: "220px" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-4 flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            background: hovered
              ? "linear-gradient(145deg, #1a2e3f, #0d1f2e)"
              : "linear-gradient(145deg, #0e1e2e, #0B1320)",
            border: `1px solid ${hovered ? "rgba(255,209,102,0.3)" : "rgba(255,209,102,0.1)"}`,
            boxShadow: hovered ? "0 0 30px rgba(255,209,102,0.08), 0 20px 50px rgba(0,0,0,0.5)" : "none",
            transition: "all 0.25s",
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.1rem", color: "#FFD166", lineHeight: 0.9 }}>
              {rank}<span className="block text-xs mt-0.5">{suit}</span>
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)", letterSpacing: "0.08em" }}>
              {movie.year}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{movie.emoji}</span>
          </div>

          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.45rem", color: "var(--oah-muted)", letterSpacing: "0.1em", marginBottom: "3px" }}>
              {movie.genre.toUpperCase()}
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "var(--oah-fg)", lineHeight: 1.2, marginBottom: "5px" }}>
              {movie.title}
            </p>
            <Stars n={movie.rating} />
          </div>

          <div className="rotate-180 mt-2 self-end" style={{ fontFamily: "'Bungee', cursive", fontSize: "1.1rem", color: "#FFD166", lineHeight: 0.9 }}>
            {rank}<span className="block text-xs mt-0.5">{suit}</span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-4 flex flex-col justify-center gap-2"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(145deg, #0B1320, #07111F)",
            border: "1px solid rgba(255,209,102,0.15)",
          }}
        >
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.45rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>DIRECTOR</p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#FFD166" }}>{movie.director}</p>
          <div className="h-px" style={{ background: "var(--oah-border)" }} />
          <Stars n={movie.rating} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.45rem", color: "var(--oah-muted)", letterSpacing: "0.08em", marginTop: "4px" }}>
            ← CLICK TO FLIP
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NeoFileDossier({ movie, index }: { movie: typeof favorites[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [scanPct, setScanPct] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={() => { setHovered(true); setScanPct(0); }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setScanPct(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: hovered
          ? "linear-gradient(135deg, rgba(0,217,255,0.06), rgba(6,8,15,0.95))"
          : "linear-gradient(135deg, rgba(0,217,255,0.02), rgba(6,8,15,0.9))",
        border: `1px solid ${hovered ? "rgba(0,217,255,0.3)" : "rgba(0,217,255,0.1)"}`,
        boxShadow: hovered ? "0 0 30px rgba(0,217,255,0.08), 0 20px 50px rgba(0,0,0,0.5)" : "none",
        transition: "all 0.25s",
        padding: "16px",
        cursor: "default",
      }}
      data-cursor="open"
    >
      {/* Scan line on hover */}
      {hovered && (
        <div className="absolute left-0 right-0 h-px pointer-events-none" style={{
          top: `${scanPct}%`,
          background: "linear-gradient(90deg, transparent, rgba(0,217,255,0.4), transparent)",
          boxShadow: "0 0 6px rgba(0,217,255,0.3)",
        }} />
      )}

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,217,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.02) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s",
      }} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.45rem", color: "rgba(0,217,255,0.5)", letterSpacing: "0.12em" }}>
            FILE_{String(index + 1).padStart(3, "0")}
          </span>
          <span style={{ fontSize: "1.4rem" }}>{movie.emoji}</span>
        </div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.45rem", color: "rgba(0,217,255,0.4)", letterSpacing: "0.1em", marginBottom: "3px" }}>
          {movie.genre.toUpperCase()} · {movie.year}
        </p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "var(--oah-fg)", lineHeight: 1.2, marginBottom: "6px" }}>
          {movie.title}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)", marginBottom: "6px" }}>
          {movie.director}
        </p>
        <Stars n={movie.rating} />
      </div>
    </motion.div>
  );
}

export function CinemaLog() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isNeo = theme === "neocity";
  const [quoteIdx, setQuoteIdx] = useState(0);

  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";

  return (
    <section id="cinema" className="relative py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <SectionLabel label="CINEMA LOG" isNeo={isNeo} />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em" }}>
                {isNeo ? "FILM ARCHIVE" : "CINEMA LOG"}
              </h2>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "var(--oah-fg2)", marginTop: "0.5rem" }}>
                {isNeo ? "Visual data logs from the archive." : "Movies that shaped how I see the world."}
              </p>
            </div>
            <a
              href={LETTERBOXD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105"
              style={{
                fontFamily: isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive",
                fontSize: isNeo ? "0.55rem" : "0.7rem",
                letterSpacing: isNeo ? "0.1em" : "0.04em",
                color: "#00C030",
                background: "rgba(0,192,48,0.08)",
                border: "1px solid rgba(0,192,48,0.25)",
              }}
              data-cursor="explore"
            >
              <Film size={14} />
              VIEW MY LETTERBOXD
              <ExternalLink size={11} />
            </a>
          </div>
        </motion.div>

        {/* Favorite movies grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--oah-muted)", letterSpacing: "0.12em", marginBottom: "16px" }}>
            {isNeo ? "◈ FAVORITES" : "★ FAVORITE FILMS"}
          </p>
          {isNeo ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {favorites.map((m, i) => <NeoFileDossier key={m.title} movie={m} index={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {favorites.map((m, i) => <BalatroMovieCard key={m.title} movie={m} index={i} />)}
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Recently watched */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: isNeo ? "rgba(10,14,26,0.8)" : "var(--oah-card-bg)", border: "1px solid var(--oah-card-border)" }}
          >
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--oah-border)" }}>
              <Eye size={13} style={{ color: "var(--oah-gold)" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>
                RECENTLY WATCHED
              </span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {recentlyWatched.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background: "var(--oah-surface2)" }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{m.emoji}</span>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "var(--oah-fg)" }}>{m.title}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)" }}>{m.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top genres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: isNeo ? "rgba(10,14,26,0.8)" : "var(--oah-card-bg)", border: "1px solid var(--oah-card-border)" }}
          >
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--oah-border)" }}>
              <Film size={13} style={{ color: "var(--oah-gold)" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>
                TOP GENRES
              </span>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {genres.map((g) => (
                <div key={g.name}>
                  <div className="flex justify-between mb-1.5">
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: "var(--oah-fg2)" }}>{g.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: g.color }}>{g.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--oah-surface2)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${g.pct}%` } : {}}
                      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${g.color}, ${g.color}70)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Directors + Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl overflow-hidden flex-1" style={{ background: isNeo ? "rgba(10,14,26,0.8)" : "var(--oah-card-bg)", border: "1px solid var(--oah-card-border)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--oah-border)" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>TOP DIRECTORS</span>
              </div>
              <div className="p-3 flex flex-col gap-1.5">
                {directors.map((d, i) => (
                  <div key={d} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--oah-surface2)" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-gold)", minWidth: "16px" }}>#{i + 1}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "var(--oah-fg2)" }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rotating quote */}
            <div
              className="rounded-2xl p-5 cursor-pointer"
              style={{ background: isNeo ? "rgba(0,217,255,0.03)" : "rgba(255,209,102,0.03)", border: `1px solid ${isNeo ? "rgba(0,217,255,0.12)" : "rgba(255,209,102,0.12)"}` }}
              onClick={() => setQuoteIdx((v) => (v + 1) % quotes.length)}
              title="Click for next quote"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: "var(--oah-fg2)", lineHeight: 1.6, fontStyle: "italic", marginBottom: "8px" }}>
                    "{quotes[quoteIdx].text}"
                  </p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)" }}>
                    — {quotes[quoteIdx].film} ({quotes[quoteIdx].year})
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
