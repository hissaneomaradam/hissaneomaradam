import { memo } from "react";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useI18n } from "../../i18n/I18nProvider";

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
  onDockClick: (id: any) => void;
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
  return (
    <nav className="dock" aria-label="Application dock" style={{ "--dock-size": `${dockSize}px` } as React.CSSProperties}>
      {apps.map((app, index) => {
        const Icon = app.icon;
        const status = windows[app.id]?.status ?? "closed";
        const isActive = activeId === app.id && status === "open";
        return (
          <motion.button
            className={`dock-item ${isActive ? "active" : ""} ${status === "open" && !isActive ? "open" : ""} ${status === "minimized" ? "minimized" : ""} ${bouncingId === app.id ? "bouncing" : ""}`}
            key={app.id}
            onClick={() => onDockClick(app.id)}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: bouncingId === app.id && !reducedMotion ? [0, -16, 0, -8, 0] : 0, opacity: 1 }}
            transition={{ delay: bouncingId === app.id ? 0 : 0.025 * index, duration: bouncingId === app.id ? 0.48 : 0.22, type: "spring", stiffness: 420, damping: 24 }}
            whileHover={reducedMotion ? undefined : { y: -10, scale: 1.14 }}
            whileTap={{ scale: 0.94 }}
          >
            <span className="dock-preview">{app.preview}</span>
            <Icon size={Math.max(20, dockSize * 0.46)} />
          </motion.button>
        );
      })}
      <a className="dock-item external" href={github} target="_blank" rel="noreferrer">
        <span className="dock-preview">{language === "fr" ? "Ouvrir le profil GitHub" : "Open GitHub profile"}</span>
        <FaGithub size={24} />
      </a>
      <a className="dock-item external" href={linkedin} target="_blank" rel="noreferrer">
        <span className="dock-preview">{language === "fr" ? "Ouvrir le profil LinkedIn" : "Open LinkedIn profile"}</span>
        <FaLinkedin size={24} />
      </a>
    </nav>
  );
});
