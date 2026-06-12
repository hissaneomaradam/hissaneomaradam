import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

export function AnimatedBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight || window.innerHeight * 5;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── BALATRO particles ─────────────────────────────────────── */
    const B_COLORS = ["#FFD166", "#E63946", "#0E5A47", "#3A86FF", "#F8F1DC"];
    const bParticles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.2 - 0.05,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.25 + 0.05,
      color: B_COLORS[Math.floor(Math.random() * B_COLORS.length)],
    }));
    const SUITS = ["♠", "♥", "♦", "♣"];
    const bSuits = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 2,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -Math.random() * 0.1 - 0.03,
      size: Math.random() * 28 + 16,
      opacity: Math.random() * 0.04 + 0.015,
      suit: SUITS[i % 4],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.003,
    }));
    const bStreaks = Array.from({ length: 3 }, () => ({
      y: Math.random() * window.innerHeight,
      opacity: 0, width: Math.random() * 200 + 100,
      speed: Math.random() * 3 + 2, x: -300, active: false,
      timer: Math.random() * 300 + 200,
    }));

    /* ── NEO CITY: rain drops (two layers for parallax) ──────── */
    const makeDrop = (fg: boolean) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 3,
      length: fg ? Math.random() * 55 + 20 : Math.random() * 25 + 8,
      speed: fg ? Math.random() * 9 + 6 : Math.random() * 4 + 2,
      opacity: fg ? Math.random() * 0.28 + 0.08 : Math.random() * 0.12 + 0.03,
      width: fg ? Math.random() * 0.9 + 0.3 : Math.random() * 0.4 + 0.1,
      color: ["#00D9FF", "#00D9FF", "#FF2D95", "#7A5FFF", "#00D9FF"][Math.floor(Math.random() * 5)],
      splash: 0,
      splashActive: false,
    });
    const rainFG = Array.from({ length: 80 }, () => makeDrop(true));
    const rainBG = Array.from({ length: 120 }, () => makeDrop(false));

    /* ── NEO CITY: city lights (background, barely move) ─────── */
    const cityLights = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight * (0.3 + Math.random() * 0.5),
      size: Math.random() * 2 + 0.5,
      color: ["#00D9FF", "#FF2D95", "#7A5FFF", "#FF7A00", "#FFD166"][Math.floor(Math.random() * 5)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      baseOpacity: Math.random() * 0.3 + 0.1,
    }));

    /* ── NEO CITY: neon nodes ─────────────────────────────────── */
    const neonNodes = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 2.5 + 1,
      color: ["#00D9FF", "#FF2D95", "#7A5FFF", "#FF7A00"][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.35 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    /* ── NEO CITY: horizontal scan line ──────────────────────── */
    const scanLine = { y: -100, speed: 0.4 };

    /* ── NEO CITY: volumetric vertical beams ─────────────────── */
    const beams = Array.from({ length: 5 }, () => ({
      x: Math.random() * window.innerWidth,
      width: Math.random() * 80 + 30,
      opacity: Math.random() * 0.04 + 0.01,
      color: ["#00D9FF", "#FF2D95", "#7A5FFF"][Math.floor(Math.random() * 3)],
      drift: (Math.random() - 0.5) * 0.08,
    }));

    /* ── NEO CITY: data stream (subtle falling chars) ─────────── */
    const DATA_CHARS = "01◈◆▸░▒▓⌖⌗⎔⌘↯⚡";
    const dataStreams = Array.from({ length: 15 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 3,
      speed: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.06 + 0.02,
      char: DATA_CHARS[Math.floor(Math.random() * DATA_CHARS.length)],
      color: "#00D9FF",
      timer: Math.random() * 60,
    }));

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      const t = themeRef.current;

      if (t === "balatro") {
        /* ── BALATRO RENDER ────────────────────────────── */
        for (const p of bParticles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * (0.7 + Math.sin(frame * 0.02 + p.x) * 0.3);
          ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
          if (p.x < -20) p.x = canvas.width + 20;
          if (p.x > canvas.width + 20) p.x = -20;
        }
        for (const s of bSuits) {
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rotation);
          ctx.font = `${s.size}px serif`;
          ctx.fillStyle = "#F8F1DC";
          ctx.globalAlpha = s.opacity * (0.6 + Math.sin(frame * 0.015 + s.x) * 0.4);
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(s.suit, 0, 0);
          ctx.restore();
          s.x += s.vx; s.y += s.vy; s.rotation += s.rotSpeed;
          if (s.y < -60) { s.y = canvas.height + 60; s.x = Math.random() * canvas.width; }
          if (s.x < -60) s.x = canvas.width + 60;
          if (s.x > canvas.width + 60) s.x = -60;
        }
        for (const streak of bStreaks) {
          streak.timer--;
          if (streak.timer <= 0 && !streak.active) {
            streak.active = true; streak.x = -streak.width;
            streak.y = Math.random() * canvas.height; streak.opacity = 0.12;
            streak.timer = Math.random() * 400 + 300;
          }
          if (streak.active) {
            const g = ctx.createLinearGradient(streak.x, 0, streak.x + streak.width, 0);
            g.addColorStop(0, "transparent");
            g.addColorStop(0.5, `rgba(255,209,102,${streak.opacity})`);
            g.addColorStop(1, "transparent");
            ctx.fillStyle = g; ctx.globalAlpha = 1;
            ctx.fillRect(streak.x, streak.y - 1, streak.width, 2);
            streak.x += streak.speed;
            if (streak.x > canvas.width + streak.width) streak.active = false;
          }
        }
      } else {
        /* ── NEO CITY RENDER ────────────────────────────── */

        // Background city lights (faint, distant)
        for (const light of cityLights) {
          light.pulse += light.pulseSpeed;
          const a = light.baseOpacity * (0.6 + Math.sin(light.pulse) * 0.4);
          const glow = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.size * 5);
          glow.addColorStop(0, light.color + "60");
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.globalAlpha = a * 0.5;
          ctx.beginPath();
          ctx.arc(light.x, light.y, light.size * 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(light.x, light.y, light.size, 0, Math.PI * 2);
          ctx.fillStyle = light.color;
          ctx.globalAlpha = a;
          ctx.fill();
        }

        // Volumetric vertical beams
        for (const beam of beams) {
          const g = ctx.createLinearGradient(beam.x, 0, beam.x, canvas.height * 0.7);
          g.addColorStop(0, "transparent");
          g.addColorStop(0.3, beam.color + "15");
          g.addColorStop(0.6, beam.color + "08");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.globalAlpha = 1;
          ctx.fillRect(beam.x - beam.width / 2, 0, beam.width, canvas.height * 0.7);
          beam.x += beam.drift;
          if (beam.x < -beam.width) beam.x = canvas.width + beam.width;
          if (beam.x > canvas.width + beam.width) beam.x = -beam.width;
        }

        // Background rain (slower, fainter)
        for (const drop of rainBG) {
          const g = ctx.createLinearGradient(drop.x, drop.y, drop.x + drop.length * 0.08, drop.y + drop.length);
          g.addColorStop(0, "transparent");
          g.addColorStop(1, drop.color + "30");
          ctx.strokeStyle = g;
          ctx.lineWidth = drop.width;
          ctx.globalAlpha = drop.opacity;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.length * 0.08, drop.y + drop.length);
          ctx.stroke();
          drop.y += drop.speed;
          if (drop.y > canvas.height + 60) { drop.y = -drop.length; drop.x = Math.random() * canvas.width; }
        }

        // Foreground rain (faster, brighter, with splash)
        for (const drop of rainFG) {
          const g = ctx.createLinearGradient(drop.x, drop.y, drop.x + drop.length * 0.1, drop.y + drop.length);
          g.addColorStop(0, "transparent");
          g.addColorStop(0.7, drop.color + "50");
          g.addColorStop(1, drop.color + "90");
          ctx.strokeStyle = g;
          ctx.lineWidth = drop.width;
          ctx.globalAlpha = drop.opacity;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.length * 0.1, drop.y + drop.length);
          ctx.stroke();

          // Splash at bottom of screen
          if (drop.splashActive) {
            drop.splash += 0.15;
            ctx.beginPath();
            ctx.arc(drop.x, canvas.height * 0.92, drop.splash * 4, 0, Math.PI * 2);
            ctx.strokeStyle = drop.color;
            ctx.globalAlpha = Math.max(0, 0.3 - drop.splash * 0.12);
            ctx.lineWidth = 0.5;
            ctx.stroke();
            if (drop.splash > 3) { drop.splashActive = false; drop.splash = 0; }
          }

          drop.y += drop.speed;
          if (drop.y > canvas.height + 60) {
            if (drop.y > canvas.height * 0.88) { drop.splashActive = true; drop.splash = 0; }
            drop.y = -drop.length;
            drop.x = Math.random() * canvas.width;
          }
        }

        // Neon nodes (floating particles with glow)
        for (const node of neonNodes) {
          node.pulse += 0.025;
          const pO = node.opacity * (0.5 + Math.sin(node.pulse) * 0.5);
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = pO;
          ctx.fill();
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 8);
          glow.addColorStop(0, node.color + "40");
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.globalAlpha = pO * 0.3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * 8, 0, Math.PI * 2);
          ctx.fill();
          node.x += node.vx; node.y += node.vy;
          if (node.x < -20) node.x = canvas.width + 20;
          if (node.x > canvas.width + 20) node.x = -20;
          if (node.y < -20) node.y = canvas.height + 20;
          if (node.y > canvas.height + 20) node.y = -20;
        }

        // Data stream characters
        for (const ds of dataStreams) {
          ds.timer--;
          if (ds.timer <= 0) {
            ds.char = DATA_CHARS[Math.floor(Math.random() * DATA_CHARS.length)];
            ds.timer = Math.random() * 60 + 20;
          }
          ctx.font = `${8 + Math.random() * 2}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = ds.color;
          ctx.globalAlpha = ds.opacity * (0.5 + Math.sin(frame * 0.04 + ds.x) * 0.5);
          ctx.textAlign = "center";
          ctx.fillText(ds.char, ds.x, ds.y);
          ds.y += ds.speed;
          if (ds.y > canvas.height + 20) { ds.y = -20; ds.x = Math.random() * canvas.width; }
        }

        // Slow horizontal scan line
        scanLine.y += scanLine.speed;
        if (scanLine.y > canvas.height) scanLine.y = -4;
        const scanGrad = ctx.createLinearGradient(0, scanLine.y, 0, scanLine.y + 4);
        scanGrad.addColorStop(0, "transparent");
        scanGrad.addColorStop(0.5, "rgba(0,217,255,0.04)");
        scanGrad.addColorStop(1, "transparent");
        ctx.fillStyle = scanGrad;
        ctx.globalAlpha = 1;
        ctx.fillRect(0, scanLine.y, canvas.width, 4);
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  const isNeo = theme === "neocity";

  return (
    <>
      {/* Film grain */}
      <div className="pointer-events-none fixed inset-0 z-[1]" style={{
        opacity: isNeo ? 0.025 : 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        animation: "grain 0.4s steps(1) infinite",
      }} />

      {/* CRT scanlines */}
      <div className="pointer-events-none fixed inset-0 z-[2]" style={{
        opacity: isNeo ? 0.012 : 0.022,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
      }} />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-[3]" style={{
        background: isNeo
          ? "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(0,0,0,0.75) 100%)"
          : "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)",
      }} />

      {/* NEO CITY specific overlays */}
      {isNeo && (
        <>
          {/* Horizon city glow */}
          <div className="pointer-events-none fixed z-0" style={{
            bottom: 0, left: 0, right: 0, height: "40vh",
            background: "linear-gradient(to top, rgba(0,217,255,0.03) 0%, rgba(122,95,255,0.02) 30%, transparent 100%)",
          }} />
          {/* Left corner pink accent */}
          <div className="pointer-events-none fixed z-0" style={{
            bottom: 0, left: 0, width: "35vw", height: "50vh",
            background: "radial-gradient(ellipse at bottom left, rgba(255,45,149,0.05) 0%, transparent 70%)",
            filter: "blur(20px)",
          }} />
          {/* Right purple accent */}
          <div className="pointer-events-none fixed z-0" style={{
            top: "30%", right: 0, width: "25vw", height: "50vh",
            background: "radial-gradient(ellipse at right, rgba(122,95,255,0.04) 0%, transparent 70%)",
            filter: "blur(20px)",
          }} />
          {/* Fog layer 1 */}
          <div className="pointer-events-none fixed inset-0 z-0" style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,217,255,0.015) 50%, transparent 100%)",
            animation: "fogDrift1 18s ease-in-out infinite alternate",
          }} />
          {/* Fog layer 2 */}
          <div className="pointer-events-none fixed inset-0 z-0" style={{
            background: "linear-gradient(180deg, transparent 20%, rgba(122,95,255,0.01) 60%, transparent 100%)",
            animation: "fogDrift2 25s ease-in-out infinite alternate",
          }} />
          {/* Glass rain reflection at very bottom */}
          <div className="pointer-events-none fixed z-0" style={{
            bottom: 0, left: 0, right: 0, height: "120px",
            background: "linear-gradient(to top, rgba(0,217,255,0.04), transparent)",
            filter: "blur(2px)",
          }} />
        </>
      )}

      {/* Primary ambient glow */}
      <div className="pointer-events-none fixed z-0 transition-all duration-1000" style={{
        top: "15%", left: "50%", transform: "translateX(-50%)",
        width: "70vw", height: "50vh",
        background: isNeo
          ? "radial-gradient(ellipse at center, rgba(0,217,255,0.04) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, rgba(14,90,71,0.07) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 0.95 }} />
    </>
  );
}
