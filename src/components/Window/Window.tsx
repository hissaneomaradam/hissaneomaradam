import { memo } from "react";
import { motion } from "motion/react";
import { Maximize2, Minus, X } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

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
  onFocus: (id: any) => void;
  onMove: (id: any, x: number, y: number) => void;
  onClose: (id: any) => void;
  onMinimize: (id: any) => void;
  onMaximize: (id: any) => void;
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
  return (
    <motion.section
      className={`os-window window-${app.size} ${maxed ? "maximized" : ""}`}
      style={{ zIndex: state.z }}
      drag={!maxed && !reducedMotion}
      dragElastic={0.04}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.92, x: state.x, y: 360 }}
      animate={maxed ? { opacity: 1, scale: 1, x: 18, y: 52 } : { opacity: 1, scale: 1, x: state.x, y: state.y }}
      exit={{ opacity: 0, scale: 0.92, y: 720, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 360, damping: 34 }}
      onMouseDown={() => onFocus(app.id)}
      onDragEnd={(_, info) => onMove(app.id, Math.max(8, state.x + info.offset.x), Math.max(42, state.y + info.offset.y))}
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
