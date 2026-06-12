import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "balatro" | "neocity";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: "balatro",
  setTheme: () => {},
  toggleTheme: () => {},
  isTransitioning: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>(() => {
    return (localStorage.getItem("oah-theme") as Theme) || "balatro";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    localStorage.setItem("oah-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    if (t === theme || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setThemeRaw(t);
      setTimeout(() => setIsTransitioning(false), 800);
    }, 400);
  };

  const toggleTheme = () => setTheme(theme === "balatro" ? "neocity" : "balatro");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
