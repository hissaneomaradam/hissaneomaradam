import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { ExternalLink, Music2, Radio } from "lucide-react";

const PLAYLIST_URL = "https://open.spotify.com/playlist/5JwoZ2rS5LOyVMoLS26pB8?si=97f6ef47bea144fe";
const EMBED_URL = "https://open.spotify.com/embed/playlist/5JwoZ2rS5LOyVMoLS26pB8?utm_source=generator&theme=0";

const fakeArtists = [
  { name: "Radiohead", genre: "Alt-rock"  },
  { name: "System Of A Down", genre: "Rock" },
  { name: "Daft Punk", genre: "Electronic" },
  { name: "Pink Floyd", genre: "Progressive Rock"},
  { name: "Sade", genre: "Funk · Soul" },
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

function BalatroMusicCard({ isNeo }: { isNeo: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ perspective: "800px" }}
    >
      <div
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(145deg, #0e1e2e, #0B1320)",
          border: "1px solid rgba(255,209,102,0.15)",
          boxShadow: "0 0 60px rgba(255,209,102,0.06), 0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Gold top stripe */}
        <div className="h-1" style={{ backgroundImage: "linear-gradient(90deg, #0E5A47, #FFD166, #E63946, #7B2CBF)", backgroundSize: "200% 100%", animation: "legendary-rotate 4s ease infinite" }} />

        <div className="p-6 md:p-8">
          {/* Card header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontFamily: "'Bungee', cursive", fontSize: "1.6rem", color: "#FFD166", lineHeight: 1 }}>♪</span>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "var(--oah-muted)", letterSpacing: "0.15em" }}>CURRENT PLAYLIST</p>
                  <h3 style={{ fontFamily: "'Bungee', cursive", fontSize: "1rem", color: "var(--oah-fg)", letterSpacing: "0.04em" }}>CODING SESSIONS</h3>
                </div>
              </div>
            </div>
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:scale-105"
              style={{ background: "#1DB95415", border: "1px solid #1DB95440", color: "#1DB954", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.06em" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              OPEN SPOTIFY
              <ExternalLink size={9} />
            </a>
          </div>

          {/* Spotify embed */}
          <div className="rounded-2xl overflow-hidden mb-6" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
            <iframe
              src={EMBED_URL}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Coding Sessions Spotify Playlist"
              style={{ display: "block" }}
            />
          </div>

          {/* Artists row */}
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "var(--oah-muted)", letterSpacing: "0.12em", marginBottom: "12px" }}>
              ♣ FAVORITE ARTISTS
            </p>
            <div className="flex flex-wrap gap-2">
              {fakeArtists.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(255,209,102,0.04)", border: "1px solid rgba(255,209,102,0.1)" }}
                >
                  <span style={{ fontSize: "0.9rem" }}>{a.emoji}</span>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "var(--oah-fg)", fontWeight: 600 }}>{a.name}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)" }}>{a.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NeoAudioTerminal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(145deg, rgba(0,217,255,0.04), rgba(6,8,15,0.95))",
          border: "1px solid rgba(0,217,255,0.2)",
          boxShadow: "0 0 60px rgba(0,217,255,0.06), 0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Neon top stripe */}
        <div className="h-px" style={{ backgroundImage: "linear-gradient(90deg, transparent, #00D9FF, #FF2D95, #7A5FFF, transparent)" }} />

        <div className="p-6 md:p-8">
          {/* Terminal header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,217,255,0.08)", border: "1px solid rgba(0,217,255,0.2)" }}>
                <Radio size={16} style={{ color: "#00D9FF" }} />
              </div>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(0,217,255,0.5)", letterSpacing: "0.15em" }}>// AUDIO_FEED.SYS</p>
                <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem", color: "#F4F7FA", letterSpacing: "0.1em", fontWeight: 600 }}>AUDIO TERMINAL</p>
              </div>
            </div>
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:scale-105"
              style={{ background: "#1DB95415", border: "1px solid #1DB95440", color: "#1DB954", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.06em" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              ACCESS
              <ExternalLink size={9} />
            </a>
          </div>

          {/* Spotify embed */}
          <div className="rounded-2xl overflow-hidden mb-6" style={{ border: "1px solid rgba(0,217,255,0.12)", boxShadow: "0 0 30px rgba(0,217,255,0.06)" }}>
            <iframe
              src={EMBED_URL}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Coding Sessions Spotify Playlist"
              style={{ display: "block" }}
            />
          </div>

          {/* Artists */}
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(0,217,255,0.4)", letterSpacing: "0.14em", marginBottom: "12px" }}>
              ◈ SIGNAL_SOURCES
            </p>
            <div className="flex flex-wrap gap-2">
              {fakeArtists.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(0,217,255,0.04)", border: "1px solid rgba(0,217,255,0.1)" }}
                >
                  <span style={{ fontSize: "0.9rem" }}>{a.emoji}</span>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "var(--oah-fg)", fontWeight: 600 }}>{a.name}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "var(--oah-muted)" }}>{a.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Spotify() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isNeo = theme === "neocity";
  const isRTL = i18n.language === "ar";

  const displayFont = isNeo ? "'Orbitron', sans-serif" : "'Bungee', cursive";

  return (
    <section id="soundtrack" className="relative py-24 px-6 md:px-12 lg:px-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <SectionLabel label="SOUNDTRACK" isNeo={isNeo} />
          <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--oah-fg)", letterSpacing: isNeo ? "0.08em" : "0.02em" }}>
            {isNeo ? "AUDIO FEED" : "CURRENT SOUNDTRACK"}
          </h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "var(--oah-fg2)", marginTop: "0.5rem" }}>
            The music powering my coding sessions.
          </p>
        </motion.div>

        {isNeo ? <NeoAudioTerminal /> : <BalatroMusicCard isNeo={isNeo} />}
      </div>
    </section>
  );
}
