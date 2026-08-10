import { useCallback, useEffect, useMemo, useState } from "react";
import { apps } from "../data/apps";
import type { AppId, WindowState } from "../types/portfolio";

const windowStorageKey = "hissane-portfolio-os-v3-windows";
const windowPadding = 12;
const topBarHeight = 42;

const initialWindows: Record<AppId, WindowState> = apps.reduce(
  (acc, app, index) => ({
    ...acc,
    [app.id]: {
      id: app.id,
      status: "closed",
      z: 20 + index,
      x: 44 + index * 18,
      y: 82 + index * 14,
      maximized: false,
    },
  }),
  {} as Record<AppId, WindowState>,
);

function getWindowWidth(size: "sm" | "md" | "lg" | "xl") {
  switch (size) {
    case "sm":
      return 520;
    case "md":
      return 640;
    case "lg":
      return 830;
    case "xl":
      return 1040;
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeWindows(
  windows: Record<AppId, WindowState>,
  viewportWidth = window.innerWidth,
  viewportHeight = window.innerHeight,
) {
  const maxHeight = Math.max(320, viewportHeight - 128);
  return Object.fromEntries(
    Object.entries(windows).map(([id, state]) => {
      const app = apps.find((item) => item.id === id);
      const width = Math.min(getWindowWidth(app?.size ?? "md"), viewportWidth - windowPadding * 2);
      const x = clamp(state.x, windowPadding, Math.max(windowPadding, viewportWidth - width - windowPadding));
      const y = clamp(state.y, topBarHeight, Math.max(topBarHeight, maxHeight - windowPadding));
      return [id, { ...state, x, y }];
    }),
  ) as Record<AppId, WindowState>;
}

function readWindowState() {
  try {
    const saved = window.localStorage.getItem(windowStorageKey);
    if (!saved) return initialWindows;
    const restored = { ...initialWindows, ...JSON.parse(saved) } as Record<AppId, WindowState>;
    return Object.fromEntries(
      Object.entries(restored).map(([id, state]) => [id, { ...state, status: "closed", maximized: false }]),
    ) as Record<AppId, WindowState>;
  } catch {
    return initialWindows;
  }
}

export function useWindowManager() {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(() => normalizeWindows(readWindowState()));
  const [topZ, setTopZ] = useState(100);

  const persist = useCallback(() => {
    window.localStorage.setItem(windowStorageKey, JSON.stringify(windows));
  }, [windows]);

  useEffect(() => {
    const handleResize = () => {
      setWindows((current) => normalizeWindows(current));
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setWindows((current) => normalizeWindows({ ...current, [id]: { ...current[id], x, y } }));
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

  const resetWindows = useCallback(() => setWindows(normalizeWindows(initialWindows)), []);

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
