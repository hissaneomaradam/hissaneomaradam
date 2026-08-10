import { memo, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Maximize2, Minus, X } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import type { AppId } from "../../types/portfolio";

type OsWindowProps = {
  app: {
    id: string;
    title: string;
    size: "sm" | "md" | "lg" | "xl";
    shortcut?: string;
    icon: React.ComponentType<{ size?: number }>;
  };
  state: {
    x: number;
    y: number;
    z: number;
    maximized: boolean;
  };
  reducedMotion: boolean;
  children: React.ReactNode;
  onFocus: (id: AppId) => void;
  onMove: (id: AppId, x: number, y: number) => void;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onMaximize: (id: AppId) => void;
};

export const OsWindow = memo(function OsWindow({
  app,
  state,
  reducedMotion,
  children,
  onFocus,
  onMove,
  onClose,
  onMinimize,
  onMaximize,
}: OsWindowProps) {
  const { language } = useI18n();
  const Icon = app.icon;
  const maxed = state.maximized;
  const [stacked, setStacked] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 780px)");
    const update = () => setStacked(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <motion.section
      className={`os-window window-${app.size} ${maxed ? "maximized" : ""}`}
      style={{ zIndex: state.z }}
      drag={!stacked && !maxed && !reducedMotion}
      dragElastic={0.04}
      dragMomentum={false}
      initial={stacked ? { opacity: 0, scale: 0.98, x: 0, y: 16 } : { opacity: 0, scale: 0.92, x: state.x, y: 360 }}
      animate={stacked ? { opacity: 1, scale: 1, x: 0, y: 0 } : maxed ? { opacity: 1, scale: 1, x: 18, y: 52 } : { opacity: 1, scale: 1, x: state.x, y: state.y }}
      exit={{ opacity: 0, scale: 0.92, y: 720, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 360, damping: 34 }}
      onMouseDown={() => onFocus(app.id)}
      onDragEnd={(_, info) => {
        if (!stacked) onMove(app.id, Math.max(8, state.x + info.offset.x), Math.max(42, state.y + info.offset.y));
      }}
    >
      <div className="window-bar">
        <div className="traffic">
          <button className="close" onClick={() => onClose(app.id)} aria-label={`${language === "fr" ? "Fermer" : "Close"} ${app.title}`}>
            <X size={12} />
          </button>
          <button className="minimize" onClick={() => onMinimize(app.id)} aria-label={`${language === "fr" ? "Réduire" : "Minimize"} ${app.title}`}>
            <Minus size={12} />
          </button>
          <button className="zoom" onClick={() => onMaximize(app.id)} aria-label={`${language === "fr" ? "Agrandir" : "Maximize"} ${app.title}`}>
            <Maximize2 size={11} />
          </button>
        </div>
        <div className="window-title">
          <Icon size={15} /> {app.title}
        </div>
        <div className="window-shortcut">{app.shortcut}</div>
      </div>
      <div className="window-content">{children}</div>
    </motion.section>
  );
});
