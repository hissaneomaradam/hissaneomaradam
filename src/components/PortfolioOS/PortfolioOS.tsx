import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Archive, BadgeCheck, BookOpenText, Bug, Check, FileText, Folder, Mail, Music, Moon, Printer, Power, RotateCcw, Search, Settings, Terminal, Trash2, Trophy, UserRound } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { MusicApp } from "../Music/MusicApp";
import { Dock } from "../Dock/Dock";
import { OsWindow } from "../Window/Window";
import { apps } from "../../data/apps";
import { certifications } from "../../data/certifications";
import { defaultPrefs } from "../../data/preferences";
import { profile } from "../../data/profile";
import { resumePdfUrl } from "../../data/resume";
import { useTypingRotator } from "../../hooks/useTypingAnimation";
import { useWindowManager } from "../../hooks/useWindowManager";
import { I18nProvider, useI18n } from "../../i18n/I18nProvider";
import { getApps, getDockApps, getProfileCopy, getProjects } from "../../i18n/localizedData";
import AboutPage from "../../pages/AboutPage";
import AwardsPage from "../../pages/AwardsPage";
import CertificationsPage from "../../pages/CertificationsPage";
import ContactPage from "../../pages/ContactPage";
import EducationPage from "../../pages/EducationPage";
import ExperiencePage from "../../pages/ExperiencePage";
import ProjectsPage from "../../pages/ProjectsPage";
import ResumePage from "../../pages/ResumePage";
import SkillsPage from "../../pages/SkillsPage";
import type { AppId, Preferences, ThemeName, Toast, WallpaperName } from "../../types/portfolio";

const prefStorageKey = "hissane-portfolio-os-v3-prefs";
const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const achievementStorageKey = "hissane-portfolio-os-v3-achievements";
const recentStorageKey = "hissane-portfolio-os-v3-recent";

const achievementCatalog = [
  { id: "projects", title: "Project Explorer", text: "Opened Projects.app" },
  { id: "resume", title: "CV Printed", text: "Downloaded the resume" },
  { id: "guestbook", title: "Guestbook Signed", text: "Left a guestbook note" },
  { id: "bugbin", title: "Bug Janitor", text: "Emptied the Bug Bin" },
  { id: "secret", title: "Secret Finder", text: "Found a hidden hiring shortcut" },
] as const;

export function PortfolioOS() {
  const [bootStage, setBootStage] = useState<"loading" | "desktop">("loading");
  const [prefs, setPrefs] = useState<Preferences>(() => readPreferences());
  const {
    windows,
    activeWindowState,
    persist: persistWindows,
    focusApp,
    openApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    moveApp,
    toggleFromDock,
    setAllWindows,
    resetWindows,
  } = useWindowManager();
  const [clock, setClock] = useState("");
  const [spotlight, setSpotlight] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [systemMode, setSystemMode] = useState<"normal" | "sleep" | "restart" | "shutdown" | "crash" | "screensaver">("normal");
  const [typed, setTyped] = useState("");
  const [konami, setKonami] = useState("");
  const [appleClicks, setAppleClicks] = useState(0);
  const [bouncingDock, setBouncingDock] = useState<AppId | null>(null);
  const [achievements, setAchievements] = useState<string[]>(() => readStringList(achievementStorageKey));
  const [recentApps, setRecentApps] = useState<AppId[]>(() => readStringList(recentStorageKey) as AppId[]);
  const [printer, setPrinter] = useState<{ active: boolean; progress: number }>({ active: false, progress: 0 });
  const [trashEmpties, setTrashEmpties] = useState(0);
  const localizedApps = useMemo(() => getApps(prefs.language), [prefs.language]);
  const localizedDockApps = useMemo(() => getDockApps(prefs.language), [prefs.language]);

  useEffect(() => {
    const loading = window.setTimeout(() => {
      setBootStage("desktop");
      pushToast(prefs.language === "fr" ? "Bienvenue, Omar Adam" : "Welcome, Omar Adam", prefs.language === "fr" ? "Finder chargé. Double-cliquez les apps ou appuyez sur Ctrl/Cmd+K." : "Finder loaded. Double-click apps or press Ctrl/Cmd+K.", "success");
    }, 1500);
    return () => {
      window.clearTimeout(loading);
    };
  }, []);

  useEffect(() => {
    persistWindows();
  }, [persistWindows, windows]);

  useEffect(() => {
    window.localStorage.setItem(prefStorageKey, JSON.stringify(prefs));
    document.documentElement.lang = prefs.language;
  }, [prefs]);

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", weekday: "short" }).format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const pushToast = useCallback((title: string, text: string, tone: Toast["tone"] = "info") => {
    const id = Date.now();
    setToasts((items) => [...items.slice(-2), { id, title, text, tone }]);
    window.setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 4200);
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      window.localStorage.setItem(achievementStorageKey, JSON.stringify(next));
      const unlocked = achievementCatalog.find((item) => item.id === id);
      if (unlocked) pushToast("Achievement unlocked", unlocked.title, "success");
      return next;
    });
  }, [pushToast]);

  const openTrackedApp = useCallback((id: AppId) => {
    openApp(id);
    setRecentApps((current) => {
      const next = [id, ...current.filter((item) => item !== id)].slice(0, 5);
      window.localStorage.setItem(recentStorageKey, JSON.stringify(next));
      return next;
    });
    if (id === "projects") unlockAchievement("projects");
  }, [openApp, unlockAchievement]);

  const dockClick = useCallback((id: AppId) => {
    setBouncingDock(id);
    window.setTimeout(() => setBouncingDock((current) => (current === id ? null : current)), 520);
    toggleFromDock(id);
  }, [toggleFromDock]);

  const windowAction = useCallback((action: "minimize" | "restore" | "close") => {
    setAllWindows(action);
    pushToast("Window Manager", prefs.language === "fr" ? (action === "restore" ? "Toutes les fenêtres sont restaurées." : action === "close" ? "Toutes les fenêtres sont fermées." : "Toutes les fenêtres sont réduites.") : (action === "restore" ? "All windows restored." : action === "close" ? "All windows closed." : "All windows minimized."));
  }, [prefs.language, pushToast, setAllWindows]);

  const downloadCv = useCallback(() => {
    setPrinter({ active: true, progress: 0 });
    let progress = 0;
    const timer = window.setInterval(() => {
      progress += 20;
      setPrinter({ active: true, progress });
      if (progress >= 100) {
        window.clearInterval(timer);
        const anchor = document.createElement("a");
        anchor.href = resumePdfUrl;
        anchor.download = "hissaneomaradamcv.pdf";
        anchor.rel = "noreferrer";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        unlockAchievement("resume");
        pushToast("Printer", "CV printed to downloads.", "success");
        window.setTimeout(() => setPrinter({ active: false, progress: 0 }), 900);
      }
    }, 180);
  }, [pushToast, unlockAchievement]);

  const setPreference = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs((current) => ({ ...current, [key]: value }));
  }, []);

  const triggerRestart = useCallback(() => {
    setSystemMode("restart");
    pushToast("Portfolio OS", "Restarting interface...", "warn");
    window.setTimeout(() => {
      resetWindows();
      setBootStage("loading");
      setSystemMode("normal");
      window.setTimeout(() => setBootStage("desktop"), 1400);
    }, 1200);
  }, [pushToast]);

  const runSystemMode = useCallback((mode: "sleep" | "shutdown" | "crash" | "screensaver") => {
    setSystemMode(mode);
    pushToast("System", mode === "sleep" ? "Entering sleep mode. Click to wake." : mode === "screensaver" ? "Screensaver started." : mode === "shutdown" ? "Portfolio is shutting down." : "Classic system crash simulated.", mode === "crash" ? "warn" : "info");
  }, [pushToast]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      if (mod && key === "k") {
        event.preventDefault();
        setSpotlight(true);
      }
      if (mod && key === "m") {
        event.preventDefault();
        windowAction("minimize");
      }
      if (mod && key === ",") {
        event.preventDefault();
        openTrackedApp("settings");
      }
      if (mod && key === "t") {
        event.preventDefault();
        openTrackedApp("terminal");
      }
      if (mod && key === "p") {
        event.preventDefault();
        openTrackedApp("music");
      }
      if (event.key === "Escape") {
        setSpotlight(false);
        setContextMenu(null);
        if (systemMode !== "normal") setSystemMode("normal");
      }
      if (mod && Number(event.key) >= 1 && Number(event.key) <= 9) {
        event.preventDefault();
        openTrackedApp(localizedDockApps[Number(event.key) - 1].id);
      }
      setTyped((current) => {
        const next = `${current}${key}`.slice(-16);
        if (next.includes("hire me")) {
          openTrackedApp("contact");
          openTrackedApp("whyhire");
          unlockAchievement("secret");
          pushToast("Secret achievement", "Typed 'hire me'. Contact.app opened.", "success");
        }
        if (next.includes("mongodb")) {
          openTrackedApp("certifications");
          pushToast("Shortcut found", "MongoDB credentials are open.", "success");
        }
        return next;
      });
      setKonami((current) => {
        const next = `${current} ${event.key}`.trim().slice(-70);
        if (next.endsWith("ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a")) {
          openTrackedApp("whyhire");
          unlockAchievement("secret");
          pushToast("Secret badge unlocked", "Konami Code: Builder Mode.", "success");
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [localizedDockApps, openTrackedApp, pushToast, systemMode, unlockAchievement, windowAction]);

  const activeWindow = useMemo(() => localizedApps.find((app) => app.id === activeWindowState?.id)?.title ?? "Finder", [activeWindowState, localizedApps]);

  const rootClass = [
    "os-root",
    `theme-${prefs.theme}`,
    `wallpaper-${prefs.wallpaper}`,
    prefs.crt ? "crt-mode" : "",
    prefs.minimal ? "minimal-mode" : "",
    prefs.reducedMotion ? "reduce-motion" : "",
    prefs.cursorTrail ? "cursor-trail" : "",
  ].filter(Boolean).join(" ");

  const cssVars = {
    "--dock-size": `${prefs.dock}px`,
    "--glass-alpha": `${Math.max(38, prefs.transparency) / 100}`,
    "--glass-blur": `${Math.round((prefs.glass / 100) * 18)}px`,
    "--motion-scale": `${prefs.reducedMotion ? 0 : prefs.animation / 100}`,
    "--retro-opacity": `${prefs.retro / 100}`,
  } as React.CSSProperties;

  return (
    <I18nProvider language={prefs.language} setLanguage={(language) => setPreference("language", language)}>
    <main
      className={rootClass}
      style={cssVars}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY });
      }}
      onClick={() => {
        if (contextMenu) setContextMenu(null);
        if (systemMode !== "normal" && systemMode !== "restart") setSystemMode("normal");
      }}
    >
      <BootScreen stage={bootStage} />
      <AmbientBackground disabled={prefs.reducedMotion || prefs.minimal} />
      <DynamicCursor enabled={prefs.cursorTrail && !prefs.reducedMotion} />
      <MenuBar
        activeWindow={activeWindow}
        clock={clock}
        appleClicks={appleClicks}
        onAppleClick={() => {
          const next = appleClicks + 1;
          setAppleClicks(next);
          if (next === 5) {
            openTrackedApp("terminal");
            openTrackedApp("whyhire");
            pushToast("Developer mode unlocked", "Apple logo clicked 5 times.", "success");
          }
        }}
        onOpen={openTrackedApp}
        onDownload={downloadCv}
        onPref={setPreference}
        prefs={prefs}
        onWindowAction={windowAction}
        onRestart={triggerRestart}
        onSleep={() => runSystemMode("sleep")}
        onScreensaver={() => runSystemMode("screensaver")}
        onHelp={() => openTrackedApp("help")}
      />

      <section className="desktop" aria-label="Interactive portfolio operating system">
        <DesktopIntro onOpen={openTrackedApp} />
        <DesktopIcons onOpen={openTrackedApp} onTrash={() => {
          openTrackedApp("bugbin");
          pushToast("Trash", "Recovered bugs moved to Bug Bin.", "info");
        }} />
        <AnimatePresence>
          {localizedApps.map((app) => {
            const state = windows[app.id];
            if (state.status !== "open") return null;
            return (
              <OsWindow
                key={app.id}
                app={app}
                state={state}
                reducedMotion={prefs.reducedMotion}
                onFocus={focusApp}
                onMove={moveApp}
                onClose={closeApp}
                onMinimize={minimizeApp}
                onMaximize={maximizeApp}
              >
                <WindowContent
                  id={app.id}
                  prefs={prefs}
                  onOpen={openTrackedApp}
                  onDownload={downloadCv}
                  onPref={setPreference}
                  onToast={pushToast}
                  achievements={achievements}
                  onUnlock={unlockAchievement}
                  trashEmpties={trashEmpties}
                  onEmptyTrash={() => {
                    const next = trashEmpties + 1;
                    setTrashEmpties(next);
                    unlockAchievement("bugbin");
                    pushToast("Bug Bin", next >= 3 ? "Secret hiring window unlocked." : "Recovered bugs removed.", "success");
                    if (next >= 3) openTrackedApp("whyhire");
                  }}
                />
              </OsWindow>
            );
          })}
        </AnimatePresence>
      </section>

      <Dock
        apps={localizedDockApps}
        windows={windows}
        activeId={activeWindowState?.id ?? null}
        bouncingId={bouncingDock}
        onDockClick={dockClick}
        dockSize={prefs.dock}
        reducedMotion={prefs.reducedMotion}
        github={profile.github}
        linkedin={profile.linkedin}
      />
      <PrinterOverlay printer={printer} />
      <Spotlight open={spotlight} onClose={() => setSpotlight(false)} onOpen={openTrackedApp} onDownload={downloadCv} onToast={pushToast} recentApps={recentApps} />
      <ContextMenu position={contextMenu} onOpen={openTrackedApp} onPref={setPreference} prefs={prefs} onRestart={triggerRestart} />
      <ToastStack toasts={toasts} />
      <SystemOverlay mode={systemMode} onRestart={triggerRestart} />
    </main>
    </I18nProvider>
  );
}

function readPreferences() {
  try {
    const saved = window.localStorage.getItem(prefStorageKey);
    if (!saved) return defaultPrefs;
    return { ...defaultPrefs, ...JSON.parse(saved) };
  } catch {
    return defaultPrefs;
  }
}

function readStringList(key: string) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function BootScreen({ stage }: { stage: "loading" | "desktop" }) {
  const { language } = useI18n();
  return (
    <AnimatePresence>
      {stage !== "desktop" && (
        <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <motion.div className="login-card" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="boot-logo">OA</div>
            <h1>{language === "fr" ? "Bienvenue, Omar Adam" : "Welcome, Omar Adam"}</h1>
            <p>{language === "fr" ? "Chargement de HISSANE Portfolio OS..." : "Loading HISSANE Portfolio OS..."}</p>
            <div className="boot-progress"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.25 }} /></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AmbientBackground({ disabled }: { disabled: boolean }) {
  if (disabled) return null;
  return <div className="ambient" aria-hidden="true">{Array.from({ length: 9 }).map((_, index) => <span key={index} className="particle" style={{ left: `${(index * 13) % 96}%`, top: `${(index * 19) % 88}%` }} />)}</div>;
}

function DynamicCursor({ enabled }: { enabled: boolean }) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 420, damping: 36 });
  const y = useSpring(mouseY, { stiffness: 420, damping: 36 });
  useEffect(() => {
    if (!enabled) return;
    const move = (event: MouseEvent) => {
      mouseX.set(event.clientX - 8);
      mouseY.set(event.clientY - 8);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, mouseX, mouseY]);
  if (!enabled) return null;
  return <motion.div className="cursor-dot" style={{ x, y }} aria-hidden="true" />;
}

function MenuBar({
  activeWindow,
  clock,
  appleClicks,
  onAppleClick,
  onOpen,
  onDownload,
  onPref,
  prefs,
  onWindowAction,
  onRestart,
  onSleep,
  onScreensaver,
  onHelp,
}: {
  activeWindow: string;
  clock: string;
  appleClicks: number;
  onAppleClick: () => void;
  onOpen: (id: AppId) => void;
  onDownload: () => void;
  onPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  prefs: Preferences;
  onWindowAction: (action: "minimize" | "restore" | "close") => void;
  onRestart: () => void;
  onSleep: () => void;
  onScreensaver: () => void;
  onHelp: () => void;
}) {
  const { language, t } = useI18n();
  return (
    <header className="menu-bar">
      <div className="menu-left">
        <div className="menu-group">
          <button className="menu-logo" onClick={onAppleClick} title={`Developer unlock ${appleClicks}/5`}>OA</button>
          <MenuPanel>
            <button onClick={() => onOpen("mac")}>{t("menu.aboutOmar")}</button>
            <button onClick={() => onOpen("settings")}>{t("menu.systemPrefs")}</button>
            <button onClick={onScreensaver}>{language === "fr" ? "Économiseur d'écran classique" : "Classic Screensaver"}</button>
            <button onClick={onRestart}>{t("menu.restart")}</button>
            <button onClick={onSleep}>{t("menu.sleep")}</button>
          </MenuPanel>
        </div>
        <strong>Finder</strong>
        <MenuLabel label={t("menu.file")}>
          <button onClick={() => onOpen("projects")}>{t("menu.openProjects")}</button>
          <button onClick={() => onOpen("resume")}>{t("menu.openResume")}</button>
          <button onClick={onDownload}>{t("menu.downloadCv")}</button>
        </MenuLabel>
        <MenuLabel label={t("menu.view")}>
          <button onClick={() => onPref("crt", !prefs.crt)}>{t("menu.toggleCrt")}</button>
          <button onClick={() => onPref("theme", prefs.theme === "glass" ? "system7" : "glass")}>{t("menu.toggleGlass")}</button>
          <button onClick={() => onPref("minimal", !prefs.minimal)}>{t("menu.toggleMinimal")}</button>
          <button onClick={() => onPref("theme", prefs.theme === "dark" ? "system7" : "dark")}>{t("menu.toggleDark")}</button>
        </MenuLabel>
        <MenuLabel label={t("menu.window")}>
          <button onClick={() => onWindowAction("minimize")}>{t("menu.minimizeAll")}</button>
          <button onClick={() => onWindowAction("restore")}>{t("menu.restoreAll")}</button>
          <button onClick={() => onWindowAction("close")}>{t("menu.closeAll")}</button>
        </MenuLabel>
        <MenuLabel label={t("menu.help")}>
          <button onClick={onHelp}>{t("menu.navigate")}</button>
          <button onClick={() => onOpen("contact")}>{t("menu.contact")}</button>
        </MenuLabel>
        <span className="active-app">{activeWindow}</span>
      </div>
      <div className="menu-right">
        <button onClick={() => onPref("language", prefs.language === "en" ? "fr" : "en")}>{prefs.language === "en" ? t("lang.fr") : t("lang.en")}</button>
        <button onClick={() => onOpen("terminal")}><Terminal size={13} /> {t("menu.terminal")}</button>
        <button onClick={() => onPref("theme", prefs.theme === "dark" ? "system7" : "dark")}><Moon size={13} /> {prefs.theme === "dark" ? t("menu.light") : t("menu.dark")}</button>
        <span>{clock}</span>
      </div>
    </header>
  );
}

function MenuLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="menu-group"><button className="menu-label">{label}</button><MenuPanel>{children}</MenuPanel></div>;
}

function MenuPanel({ children }: { children: React.ReactNode }) {
  return <div className="menu-panel">{children}</div>;
}

const DesktopIntro = memo(function DesktopIntro({ onOpen }: { onOpen: (id: AppId) => void }) {
  const { language, t } = useI18n();
  const profileCopy = getProfileCopy(language);
  const typedRole = useTypingRotator([
    t("typing.fullStack"),
    t("typing.student"),
    t("typing.laravel"),
    t("typing.react"),
    t("typing.mongodb"),
    t("typing.builder"),
  ]);

  return (
    <section className="desktop-intro">
      <motion.div className="hero-plaque" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="hero-layout">
          <HeroProfilePhoto />
          <div className="hero-copy">
            <p className="kicker">{t("hero.kicker")}</p>
            <h1>{profile.name}</h1>
            <p className="typing-line">
              <span>{profile.shortName} {t("hero.isA")} </span>
              <strong>{typedRole}</strong>
              <i aria-hidden="true" />
            </p>
            <p className="claim">{profileCopy.claim}</p>
            <div className="hero-meta">
              <span>{profileCopy.title}</span>
              <span>{profileCopy.subtitle}</span>
              <span>{profile.location}</span>
            </div>
            <div className="hero-actions">
              <button className="magnetic-button" onClick={() => onOpen("projects")}>{t("hero.launchProjects")}</button>
              <button className="magnetic-button ghost" onClick={() => onOpen("resume")}>{t("hero.openResume")}</button>
              <button className="magnetic-button ghost" onClick={() => onOpen("settings")}>{t("hero.controlPanel")}</button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
});

function HeroProfilePhoto() {
  const { t } = useI18n();
  const [imageFailed, setImageFailed] = useState(false);
  const hasPhoto = Boolean(profile.photo && !imageFailed);

  return (
    <motion.div
      className={`hero-photo ${hasPhoto ? "has-image" : ""}`}
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 16, delay: 0.08 }}
      whileHover={{ y: -5, rotate: 1.5 }}
    >
      <div className="hero-photo-screen">
        {hasPhoto ? (
          <img src={profile.photo} alt={`${profile.name} profile`} onError={() => setImageFailed(true)} />
        ) : (
          <div className="hero-photo-placeholder" aria-label="Profile image placeholder">
            <strong>OA</strong>
            <span>{t("hero.addImage")}</span>
          </div>
        )}
      </div>
      <div className="hero-photo-caption">profile.pic</div>
    </motion.div>
  );
}

function DesktopIcons({ onOpen, onTrash }: { onOpen: (id: AppId) => void; onTrash: () => void }) {
  const { t } = useI18n();
  const icons = [
    { id: "about" as AppId, label: t("desktop.about"), icon: UserRound },
    { id: "projects" as AppId, label: t("desktop.projects"), icon: Folder },
    { id: "certifications" as AppId, label: t("desktop.certificates"), icon: Archive },
    { id: "contact" as AppId, label: t("desktop.contact"), icon: Mail },
    { id: "resume" as AppId, label: t("desktop.documents"), icon: FileText },
    { id: "music" as AppId, label: t("desktop.music"), icon: Music },
    { id: "guestbook" as AppId, label: "Guestbook.app", icon: BookOpenText },
    { id: "achievements" as AppId, label: "Badges.app", icon: Trophy },
    { id: "settings" as AppId, label: t("desktop.settings"), icon: Settings },
  ];
  return (
    <div className="desktop-icons" aria-label="Desktop shortcuts">
      {icons.map((item, index) => {
        const Icon = item.icon;
        return <DesktopIcon key={item.label} label={item.label} icon={Icon} index={index} onOpen={() => onOpen(item.id)} />;
      })}
      <DesktopIcon label={t("desktop.trash")} icon={Trash2} index={icons.length} onOpen={onTrash} />
    </div>
  );
}

const DesktopIcon = memo(function DesktopIcon({ label, icon: Icon, index, onOpen }: { label: string; icon: LucideIcon; index: number; onOpen: () => void }) {
  return (
    <motion.button className="desktop-icon" onDoubleClick={onOpen} onClick={onOpen} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + index * 0.035 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
      <span className="icon-tile"><Icon size={25} /></span>
      <span>{label}</span>
    </motion.button>
  );
});

function WindowContent({
  id,
  prefs,
  onOpen,
  onDownload,
  onPref,
  onToast,
  achievements,
  onUnlock,
  trashEmpties,
  onEmptyTrash,
}: {
  id: AppId;
  prefs: Preferences;
  onOpen: (id: AppId) => void;
  onDownload: () => void;
  onPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  onToast: (title: string, text: string, tone?: Toast["tone"]) => void;
  achievements: string[];
  onUnlock: (id: string) => void;
  trashEmpties: number;
  onEmptyTrash: () => void;
}) {
  switch (id) {
    case "about": return <AboutPage onOpen={onOpen} />;
    case "skills": return <SkillsPage />;
    case "projects": return <ProjectsPage />;
    case "experience": return <ExperiencePage />;
    case "education": return <EducationPage />;
    case "certifications": return <CertificationsPage onToast={onToast} />;
    case "awards": return <AwardsPage />;
    case "contact": return <ContactPage onToast={onToast} />;
    case "resume": return <ResumePage onDownload={onDownload} />;
    case "terminal": return <TerminalApp onOpen={onOpen} onDownload={onDownload} onToast={onToast} onPref={onPref} />;
    case "music": return <MusicApp />;
    case "settings": return <SettingsApp prefs={prefs} onPref={onPref} />;
    case "mac": return <AboutMacApp />;
    case "help": return <HelpApp />;
    case "whyhire": return <WhyHireApp />;
    case "bugbin": return <BugBinApp empties={trashEmpties} onEmpty={onEmptyTrash} />;
    case "guestbook": return <GuestbookApp onToast={onToast} onUnlock={onUnlock} />;
    case "achievements": return <AchievementsApp unlocked={achievements} />;
    default: return null;
  }
}

function TerminalApp({ onOpen, onDownload, onToast, onPref }: { onOpen: (id: AppId) => void; onDownload: () => void; onToast: (title: string, text: string, tone?: Toast["tone"]) => void; onPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void }) {
  const { language } = useI18n();
  const [lines, setLines] = useState(["Portfolio OS terminal", "Type help. Try sudo hire-me, matrix, open projects."]);
  const [value, setValue] = useState("");
  const commandMap: Record<string, () => string | void> = {
    help: () => "Commands: whoami, about, skills, projects, certifications, education, experience, awards, contact, resume, music, open projects, open github, download cv, clear, theme retro, theme glass, theme dark, language en, language fr, matrix, sudo hire-me",
    whoami: () => profile.name,
    about: () => getProfileCopy(language).claim,
    skills: () => { onOpen("skills"); return "Opening Skills.app"; },
    projects: () => { onOpen("projects"); return "Opening Projects.app"; },
    certifications: () => { onOpen("certifications"); return "Opening Certificates.app"; },
    education: () => { onOpen("education"); return "Opening Education.app"; },
    experience: () => { onOpen("experience"); return "Opening Experience.app"; },
    awards: () => { onOpen("awards"); return "Opening Awards.app"; },
    contact: () => { onOpen("contact"); return "Opening Contact.app"; },
    resume: () => { onOpen("resume"); return "Opening Resume.app"; },
    music: () => { onOpen("music"); return "Opening Music.app"; },
    "open projects": () => { onOpen("projects"); return "Opening Projects.app"; },
    "open certifications": () => { onOpen("certifications"); return "Opening Certificates.app"; },
    "open github": () => { window.open(profile.github, "_blank", "noopener,noreferrer"); return "Opening GitHub"; },
    "open linkedin": () => { window.open(profile.linkedin, "_blank", "noopener,noreferrer"); return "Opening LinkedIn"; },
    "download cv": () => { onDownload(); return "Downloading CV"; },
    "theme retro": () => { onPref("theme", "system7"); return "Theme set to System 7"; },
    "theme glass": () => { onPref("theme", "glass"); return "Theme set to Liquid Glass"; },
    "theme dark": () => { onPref("theme", "dark"); return "Theme set to Dark Desktop"; },
    "language en": () => { onPref("language", "en"); return "Language set to English"; },
    "language fr": () => { onPref("language", "fr"); return "Langue réglée sur français"; },
    matrix: () => "01001111 01001101 01000001 01010010 :: builder mode online",
    "sudo daltons":()=>"A7LA TA7IA L A7LA DALTONS : MOAD CHOUKI, NIZAR SADIKI , ABDESSAMAD CHAHID",
    "girlfriend":()=>"npm install girlfriend                                           ERR! package not found",
    "sudo hire-me": () => { onOpen("whyhire"); onOpen("contact"); onToast("Hiring sequence", "Why Hire Me and Contact.app opened.", "success"); return "Permission granted. Strong candidate detected."; },
  };
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const command = value.trim().toLowerCase();
    if (command === "clear") {
      setLines([]);
      setValue("");
      return;
    }
    const result = commandMap[command]?.() ?? (command.startsWith("open ") && apps.some((app) => app.id === command.replace("open ", "")) ? (() => { onOpen(command.replace("open ", "") as AppId); return `Opening ${command.replace("open ", "")}.`; })() : "Unknown command. Type help.");
    setLines((current) => [...current, `$ ${value}`, String(result)].slice(-12));
    setValue("");
  }
  return <div className="terminal-app"><div className="terminal-lines">{lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div><form onSubmit={submit}><span>$</span><input value={value} onChange={(event) => setValue(event.target.value)} autoFocus /></form></div>;
}

function SettingsApp({ prefs, onPref }: { prefs: Preferences; onPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void }) {
  const { t } = useI18n();
  return (
    <div className="settings-app">
      <SettingSelect label={t("settings.language")} value={prefs.language} options={["en", "fr"]} onChange={(value) => onPref("language", value as Preferences["language"])} />
      <SettingSelect label={t("settings.wallpaper")} value={prefs.wallpaper} options={["aqua", "graphite", "bondi"]} onChange={(value) => onPref("wallpaper", value as WallpaperName)} />
      <SettingSelect label={t("settings.theme")} value={prefs.theme} options={["system7", "glass", "dark"]} onChange={(value) => onPref("theme", value as ThemeName)} />
      <SettingRange label={t("settings.retro")} value={prefs.retro} onChange={(value) => onPref("retro", value)} />
      <SettingRange label={t("settings.glass")} value={prefs.glass} onChange={(value) => onPref("glass", value)} />
      <SettingRange label={t("settings.animation")} value={prefs.animation} onChange={(value) => onPref("animation", value)} />
      <SettingRange label={t("settings.dock")} value={prefs.dock} min={42} max={68} onChange={(value) => onPref("dock", value)} />
      <SettingRange label={t("settings.transparency")} value={prefs.transparency} min={55} max={96} onChange={(value) => onPref("transparency", value)} />
      <SettingToggle label={t("settings.sound")} checked={prefs.sound} onChange={(value) => onPref("sound", value)} />
      <SettingToggle label={t("settings.crt")} checked={prefs.crt} onChange={(value) => onPref("crt", value)} />
      <SettingToggle label={t("settings.reduced")} checked={prefs.reducedMotion} onChange={(value) => onPref("reducedMotion", value)} />
      <SettingToggle label={t("settings.cursor")} checked={prefs.cursorTrail} onChange={(value) => onPref("cursorTrail", value)} />
      <SettingToggle label={t("settings.minimal")} checked={prefs.minimal} onChange={(value) => onPref("minimal", value)} />
    </div>
  );
}

function SettingRange({ label, value, min = 0, max = 100, onChange }: { label: string; value: number; min?: number; max?: number; onChange: (value: number) => void }) {
  return <label className="setting-row"><span>{label}</span><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /><b>{value}</b></label>;
}

function SettingToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  const { language } = useI18n();
  return <label className="setting-row"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><b>{checked ? (language === "fr" ? "Oui" : "On") : (language === "fr" ? "Non" : "Off")}</b></label>;
}

function SettingSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="setting-row"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function AboutMacApp() {
  const { language } = useI18n();
  return <div className="about-mac"><div className="boot-logo">OA</div><h2>HISSANE Portfolio OS</h2><p>{language === "fr" ? "Version 9.1. Créé avec React, TypeScript, Motion, Tailwind CSS et React Icons." : "Version 9.1. Built with React, TypeScript, Motion, Tailwind CSS, and React Icons."}</p><div className="quick-list"><span>CPU: Full-Stack Builder</span><span>Memory: Laravel / React / MongoDB / MySQL</span><span>Location: Khouribga, Morocco</span><span>{language === "fr" ? "Statut : ouvert aux opportunités" : "Status: Open to opportunities"}</span></div></div>;
}

function HelpApp() {
  const { t } = useI18n();
  return <div className="help-app"><h2>{t("help.title")}</h2><p>{t("help.body")}</p><ul><li>{t("help.1")}</li><li>{t("help.2")}</li><li>{t("help.3")}</li><li>{t("help.4")}</li></ul></div>;
}

function WhyHireApp() {
  const { language } = useI18n();
  return <div className="why-hire"><p className="label">{language === "fr" ? "Fenêtre secrète" : "Secret Window"}</p><h2>{language === "fr" ? "Pourquoi recruter Omar ?" : "Why hire Omar?"}</h2><p>{language === "fr" ? "Parce qu'il combine livraison full-stack, curiosité produit, apprentissage rapide, expérience entrepreneuriale et goût visuel solide. Ce portfolio est volontairement conçu comme un système fonctionnel, pas comme un template." : "Because he combines full-stack delivery, product curiosity, fast learning, entrepreneurship experience, and strong visual taste. This portfolio is intentionally built as a working system, not a template."}</p><div className="feature-list"><span>Builder mindset</span><span>Laravel + React</span><span>Product UX</span><span>{language === "fr" ? "Prêt pour stage" : "Internship ready"}</span></div></div>;
}

function BugBinApp({ empties, onEmpty }: { empties: number; onEmpty: () => void }) {
  const bugs = ["Contact layout overflow", "Missing email endpoint fallback", "Cramped link cards", "Untracked project visits"];
  return <div className="bug-bin"><p className="label">Recovered Bugs</p><h2>Bug Bin</h2><div className="bug-list">{bugs.map((bug, index) => <span key={bug}><Bug size={15} /> #{index + 1} {bug}</span>)}</div><button className="download-button" onClick={onEmpty}><Trash2 size={16} /> Empty Bug Bin</button><small>{empties}/3 empties toward a secret window</small></div>;
}

function GuestbookApp({ onToast, onUnlock }: { onToast: (title: string, text: string, tone?: Toast["tone"]) => void; onUnlock: (id: string) => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      onToast("Guestbook", "Add your name and note first.", "warn");
      return;
    }
    setSending(true);
    try {
      if (contactEndpoint) {
        await fetch(contactEndpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), message: message.trim(), subject: "Portfolio guestbook note", source: "Guestbook.app" }),
        });
      }
      setName("");
      setMessage("");
      onUnlock("guestbook");
      onToast("Guestbook signed", "Thanks for leaving a note.", "success");
    } catch {
      onToast("Guestbook", "Could not send the note right now.", "warn");
    } finally {
      setSending(false);
    }
  }
  return (
    <form className="guestbook-app" onSubmit={submit}>
      <section className="guestbook-cover">
        <div className="guestbook-badge"><BookOpenText size={30} /></div>
        <div>
          <p className="label">Guestbook</p>
          <h2>Sign the visitor log</h2>
          <p>Leave a short note, collaboration idea, or first impression.</p>
        </div>
      </section>
      <div className="guestbook-layout">
        <div className="guestbook-page">
          <label><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
          <label><span>Note</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What should Omar know?" maxLength={520} /></label>
          <div className="mail-status"><span>{contactEndpoint ? "Sends through the portfolio endpoint." : "Endpoint not configured."}</span><b>{message.length}/520</b></div>
          <button className={`download-button send-button ${sending ? "sending" : ""}`} disabled={sending}><BookOpenText size={16} /> {sending ? "Signing..." : "Sign Guestbook"}</button>
        </div>
        <aside className="guestbook-entries">
          <span>Recent notes</span>
          <article><strong>Portfolio OS</strong><p>Welcome, visitor. Leave your mark here.</p></article>
          <article><strong>Recruiter mode</strong><p>Best notes include role, timeline, and project context.</p></article>
        </aside>
      </div>
    </form>
  );
}

function AchievementsApp({ unlocked }: { unlocked: string[] }) {
  return <div className="achievements-app"><p className="label">Portfolio Badges</p><h2>{unlocked.length}/{achievementCatalog.length} unlocked</h2><div className="achievement-grid">{achievementCatalog.map((item) => <article className={unlocked.includes(item.id) ? "unlocked" : ""} key={item.id}><BadgeCheck size={18} /><strong>{item.title}</strong><span>{item.text}</span></article>)}</div></div>;
}

function PrinterOverlay({ printer }: { printer: { active: boolean; progress: number } }) {
  if (!printer.active) return null;
  return <div className="printer-overlay"><Printer size={22} /><div><strong>Printing CV...</strong><span><i style={{ width: `${printer.progress}%` }} /></span></div><b>{printer.progress}%</b></div>;
}

function Spotlight({ open, onClose, onOpen, onDownload, onToast, recentApps }: { open: boolean; onClose: () => void; onOpen: (id: AppId) => void; onDownload: () => void; onToast: (title: string, text: string, tone?: Toast["tone"]) => void; recentApps: AppId[] }) {
  const { language, t } = useI18n();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const localizedApps = getApps(language);
    const localizedProjects = getProjects(language);
    const recentResults = recentApps
      .map((id) => localizedApps.find((app) => app.id === id))
      .filter(Boolean)
      .map((app) => ({ title: `Recent: ${app!.title}`, detail: app!.shortcut ?? app!.preview, action: () => onOpen(app!.id), blob: `recent ${app!.title} ${app!.preview}` }));
    const appResults = localizedApps.map((app) => ({ title: app.title, detail: app.preview, action: () => onOpen(app.id), blob: `${app.title} ${app.preview}` }));
    const projectResults = localizedProjects.map((project) => ({ title: project.name, detail: project.labels.join(", "), action: () => onOpen("projects"), blob: `${project.name} ${project.labels.join(" ")} ${project.solution}` }));
    const certResults = certifications.map((cert) => ({ title: cert.title, detail: `${cert.issuer} ${cert.skills.join(", ")}`, action: () => onOpen("certifications"), blob: `${cert.title} ${cert.issuer} ${cert.skills.join(" ")}` }));
    const utilityResults = [
      { title: t("menu.downloadCv"), detail: "Printer shortcut", action: onDownload, blob: "cv resume download print" },
      { title: t("contact.copyEmail"), detail: profile.email, action: () => { navigator.clipboard?.writeText(profile.email); onToast(t("contact.copied"), profile.email, "success"); }, blob: "contact email copy" },
      { title: "Open Guestbook", detail: "Leave a note", action: () => onOpen("guestbook"), blob: "guestbook note sign" },
      { title: "Open Bug Bin", detail: "Recovered bugs", action: () => onOpen("bugbin"), blob: "trash bug bin recovered bugs" },
    ];
    return [...recentResults, ...appResults, ...projectResults, ...certResults, ...utilityResults].filter((item) => item.blob.toLowerCase().includes(query.toLowerCase())).slice(0, 9);
  }, [language, onDownload, onOpen, onToast, query, recentApps, t]);
  return (
    <AnimatePresence>
      {open && <motion.div className="spotlight-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="spotlight" initial={{ y: -20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -16, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
          <label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "fr" ? "Rechercher MongoDB, Laravel, UniBuddy, CV, Contact..." : "Search MongoDB, Laravel, UniBuddy, CV, Contact..."} autoFocus /></label>
          <div className="spotlight-results">
            {results.length > 0 ? results.map((item) => <button key={`${item.title}-${item.detail}`} onClick={() => { item.action(); onClose(); }}><strong>{item.title}</strong><span>{item.detail}</span></button>) : (
              <p className="spotlight-empty">{language === "fr" ? "Aucun résultat. Essayez projets, CV, contact ou MongoDB." : "No results. Try projects, resume, contact, or MongoDB."}</p>
            )}
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
}

function ContextMenu({ position, onOpen, onPref, prefs, onRestart }: { position: { x: number; y: number } | null; onOpen: (id: AppId) => void; onPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void; prefs: Preferences; onRestart: () => void }) {
  const { language } = useI18n();
  if (!position) return null;
  return <div className="context-menu" style={{ left: position.x, top: position.y }}><button onClick={() => onOpen("projects")}>{language === "fr" ? "Ouvrir le dossier Projets" : "Open Projects Folder"}</button><button onClick={() => onOpen("certifications")}>{language === "fr" ? "Ouvrir le dossier Certificats" : "Open Certifications Folder"}</button><button onClick={() => onOpen("settings")}>{language === "fr" ? "Préférences du bureau" : "Desktop Preferences"}</button><button onClick={() => onPref("crt", !prefs.crt)}>{language === "fr" ? "Activer/désactiver CRT" : "Toggle CRT"}</button><button onClick={onRestart}>{language === "fr" ? "Redémarrer le portfolio" : "Restart Portfolio"}</button></div>;
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return <div className="toast-stack">{toasts.map((toast) => <motion.div className={`toast ${toast.tone ?? "info"}`} key={toast.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}><Check size={16} /><div><strong>{toast.title}</strong><span>{toast.text}</span></div></motion.div>)}</div>;
}

function SystemOverlay({ mode, onRestart }: { mode: "normal" | "sleep" | "restart" | "shutdown" | "crash" | "screensaver"; onRestart: () => void }) {
  const { language } = useI18n();
  if (mode === "normal") return null;
  return <div className={`system-overlay ${mode}`}><div>{mode === "sleep" && <><Moon size={48} /><h2>{language === "fr" ? "En veille" : "Sleeping"}</h2><p>{language === "fr" ? "Cliquez pour réveiller." : "Click anywhere to wake."}</p></>}{mode === "restart" && <><RotateCcw size={48} /><h2>{language === "fr" ? "Redémarrage..." : "Restarting..."}</h2></>}{mode === "shutdown" && <><Power size={48} /><h2>{language === "fr" ? "Portfolio éteint" : "Portfolio shut down"}</h2><button onClick={onRestart}>{language === "fr" ? "Redémarrer" : "Restart"}</button></>}{mode === "crash" && <><AlertTriangle size={48} /><h2>System Error 404</h2><p>{language === "fr" ? "Simulation de crash Mac classique. Appuyez sur Esc ou cliquez pour récupérer." : "Classic Mac crash simulation. Press Esc or click to recover."}</p></>}{mode === "screensaver" && <><div className="screensaver-word">HISSANE OS</div><p>{language === "fr" ? "Cliquez pour revenir." : "Click anywhere to return."}</p></>}</div></div>;
}
