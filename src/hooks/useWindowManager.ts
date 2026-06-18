import { useCallback, useMemo, useState } from "react";
import { apps } from "../data/apps";
import type { AppId, WindowState } from "../types/portfolio";

const windowStorageKey = "hissane-portfolio-os-v3-windows";

const initialWindows: Record<AppId, WindowState> = apps.reduce(
  (acc, app, index) => ({
    ...acc,
    [app.id]: {
      id: app.id,
      status: ["about", "projects"].includes(app.id) ? "open" : "closed",
      z: 20 + index,
      x: 44 + index * 18,
      y: 82 + index * 14,
      maximized: false,
    },
  }),
  {} as Record<AppId, WindowState>,
);

function readWindowState() {
  try {
    const saved = window.localStorage.getItem(windowStorageKey);
    if (!saved) return initialWindows;
    return { ...initialWindows, ...JSON.parse(saved) };
  } catch {
    return initialWindows;
  }
}

export function useWindowManager() {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(() => readWindowState());
  const [topZ, setTopZ] = useState(100);

  const persist = useCallback(() => {
    window.localStorage.setItem(windowStorageKey, JSON.stringify(windows));
  }, [windows]);

  const focusApp = useCallback((id: AppId) => {
    setTopZ((z) => {
      const nextZ = z + 1;
      setWindows((current) => ({ ...current, [id]: { ...current[id], z: nextZ } }));
      return nextZ;
    });
  }, []);

  const openApp = useCallback((id: AppId) => {
    setTopZ((z) => {
      const nextZ = z + 1;
      setWindows((current) => ({ ...current, [id]: { ...current[id], status: "open", z: nextZ, maximized: false } }));
      return nextZ;
    });
  }, []);

  const closeApp = useCallback((id: AppId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], status: "closed", maximized: false } }));
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], status: "minimized" } }));
  }, []);

  const maximizeApp = useCallback((id: AppId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], status: "open", maximized: !current[id].maximized } }));
    focusApp(id);
  }, [focusApp]);

  const moveApp = useCallback((id: AppId, x: number, y: number) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], x, y } }));
  }, []);

  const toggleFromDock = useCallback((id: AppId) => {
    setTopZ((z) => {
      const nextZ = z + 1;
      setWindows((current) => {
        const target = current[id];
        const active = Object.values(current).filter((state) => state.status === "open").sort((a, b) => b.z - a.z)[0];
        if (target.status === "open" && active?.id === id) {
          return { ...current, [id]: { ...target, status: "minimized" } };
        }
        return { ...current, [id]: { ...target, status: "open", z: nextZ, maximized: false } };
      });
      return nextZ;
    });
  }, []);

  const setAllWindows = useCallback((action: "minimize" | "restore" | "close") => {
    setWindows((current) =>
      Object.fromEntries(
        Object.entries(current).map(([id, state]) => [
          id,
          { ...state, status: action === "restore" ? "open" : action === "close" ? "closed" : "minimized", maximized: action === "restore" ? state.maximized : false },
        ]),
      ) as Record<AppId, WindowState>,
    );
  }, []);

  const resetWindows = useCallback(() => setWindows(initialWindows), []);

  const activeWindowState = useMemo(() => {
    return Object.values(windows).filter((state) => state.status === "open").sort((a, b) => b.z - a.z)[0] ?? null;
  }, [windows]);

  return {
    windows,
    activeWindowState,
    persist,
    focusApp,
    openApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    moveApp,
    toggleFromDock,
    setAllWindows,
    resetWindows,
  };
}
