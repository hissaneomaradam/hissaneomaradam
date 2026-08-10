import { memo, useMemo, useState } from "react";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useI18n } from "../../i18n/I18nProvider";
import type { AppId } from "../../types/portfolio";

type DockProps = {
  apps: Array<{
    id: string;
    title: string;
    preview: string;
    icon: React.ComponentType<{ size?: number }>;
  }>;
  windows: Record<string, { status: "open" | "closed" | "minimized" }>;
  activeId: string | null;
  bouncingId: string | null;
  dockSize: number;
  reducedMotion: boolean;
  github: string;
  linkedin: string;
  onDockClick: (id: AppId) => void;
};

export const Dock = memo(function Dock({
  apps,
  windows,
  activeId,
  bouncingId,
  dockSize,
  reducedMotion,
  github,
  linkedin,
  onDockClick,
}: DockProps) {
  const { language } = useI18n();
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const dockItems = useMemo(
    () => [
      ...apps.map((app) => ({ kind: "app" as const, id: app.id, title: app.title, preview: app.preview, icon: app.icon })),
      { kind: "external" as const, id: "github", title: "GitHub", preview: language === "fr" ? "Ouvrir le profil GitHub" : "Open GitHub profile", href: github, icon: FaGithub },
      { kind: "external" as const, id: "linkedin", title: "LinkedIn", preview: language === "fr" ? "Ouvrir le profil LinkedIn" : "Open LinkedIn profile", href: linkedin, icon: FaLinkedin },
    ],
    [apps, github, linkedin, language],
  );

  const getDockMotion = (index: number, isActive: boolean) => {
    if (reducedMotion) return { y: 0, scale: isActive ? 1.1 : 0.94 };
    const distance = focusIndex == null ? 0 : Math.abs(index - focusIndex);
    const proximity = focusIndex == null ? (isActive ? 1 : 0.35) : Math.max(0, 1 - distance / 3.3);
    return {
      y: -proximity * 10,
      scale: isActive ? 1.1 : Math.max(0.88, 0.92 + proximity * 0.12),
    };
  };

  return (
    <nav className="dock" aria-label="Application dock" style={{ "--dock-size": `${dockSize}px` } as React.CSSProperties} onPointerLeave={() => setFocusIndex(null)}>
      {dockItems.map((item, index) => {
        const Icon = item.icon;
        const status = item.kind === "app" ? windows[item.id]?.status ?? "closed" : "closed";
        const isActive = item.kind === "app" && activeId === item.id && status === "open";
        const motionState = getDockMotion(index, isActive);
        const className = `dock-item ${isActive ? "active" : ""} ${status === "open" && !isActive ? "open" : ""} ${status === "minimized" ? "minimized" : ""} ${bouncingId === item.id ? "bouncing" : ""}`;
        const animate = {
          y: bouncingId === item.id && !reducedMotion ? [0, -18, 0, -10, 0] : motionState.y,
          scale: motionState.scale,
          opacity: 1,
        };
        const transition = {
          delay: 0,
          duration: bouncingId === item.id ? 0.42 : 0.26,
          type: "spring",
          stiffness: 260,
          damping: 30,
          mass: 0.95,
        };

        return item.kind === "app" ? (
          <motion.button
            className={className}
            key={item.id}
            aria-label={`${item.title}: ${item.preview}`}
            title={item.title}
            initial={{ y: 0, opacity: 1 }}
            animate={animate}
            transition={transition}
            whileTap={{ scale: Math.max(0.9, motionState.scale - 0.06) }}
            onClick={() => onDockClick(item.id)}
            onPointerEnter={() => setFocusIndex(index)}
          >
            <span className="dock-preview">{item.preview}</span>
            <Icon size={Math.max(20, dockSize * 0.44)} />
          </motion.button>
        ) : (
          <motion.a
            className={className}
            key={item.id}
            aria-label={`${item.title}: ${item.preview}`}
            title={item.title}
            initial={{ y: 0, opacity: 1 }}
            animate={animate}
            transition={transition}
            whileTap={{ scale: Math.max(0.9, motionState.scale - 0.06) }}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            onPointerEnter={() => setFocusIndex(index)}
          >
            <span className="dock-preview">{item.preview}</span>
            <Icon size={24} />
          </motion.a>
        );
      })}
    </nav>
  );
});
