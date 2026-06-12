import "../styles/fonts.css";
import "./i18n/index";
import { useState, useCallback } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { LoadingScreen } from "./components/LoadingScreen";
import { CustomCursor } from "./components/CustomCursor";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Achievements } from "./components/Achievements";
import { Experience } from "./components/Experience";
import { Interests } from "./components/Interests";
import { Spotify } from "./components/Spotify";
import { Dashboard } from "./components/Dashboard";
import { Contact } from "./components/Contact";
import { ThemeTransition } from "./components/ThemeTransition";
import { GlobalStyles } from "./components/GlobalStyles";
import { EasterEggPopup, useEasterEgg } from "./components/EasterEgg";

function Portfolio() {
  const { theme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const { achievement, visible, dismiss, handleLogoClick } = useEasterEgg();

  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "var(--oah-bg)",
        color: "var(--oah-fg)",
        overflowX: "hidden",
        transition: "background 0.8s ease, color 0.8s ease",
      }}
    >
      <GlobalStyles />
      <LoadingScreen onComplete={handleLoadComplete} />
      <CustomCursor />
      <ThemeTransition />
      <EasterEggPopup achievement={achievement} visible={visible} onDismiss={dismiss} />

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: loaded ? "auto" : "none",
        }}
      >
        <AnimatedBackground />
        <div className="relative z-10">
          <Navbar onLogoClick={handleLogoClick} />
          <Hero />
          <Dashboard />
          <About />
          <Projects />
          <Skills />
          <Experience />
          <Achievements />
          <Interests />
          <Spotify />
          <Contact />

          {/* Footer */}
          <footer
            className="py-8 px-6 text-center flex flex-col items-center gap-4"
            style={{ borderTop: "1px solid var(--oah-border)" }}
          >
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--oah-muted)", letterSpacing: "0.1em" }}>
              {theme === "neocity" ? "◈" : "♠"} OMAR ADAM HISSANE · {new Date().getFullYear()} · FULL-STACK DEVELOPER {theme === "neocity" ? "◈" : "♠"}
            </p>
            <a
              href="https://open.spotify.com/playlist/5JwoZ2rS5LOyVMoLS26pB8?si=97f6ef47bea144fe"
              target="_blank"
              rel="noopener noreferrer"
              title="My Spotify Playlist"
              data-cursor="spotify"
              style={{ display: "inline-flex", alignItems: "center", opacity: 0.5, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Portfolio />
    </ThemeProvider>
  );
}
