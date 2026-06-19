import type { LucideIcon } from "lucide-react";

export type AppId =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "awards"
  | "contact"
  | "resume"
  | "terminal"
  | "music"
  | "settings"
  | "mac"
  | "help"
  | "whyhire"
  | "bugbin"
  | "guestbook"
  | "achievements";

export type WindowStatus = "open" | "closed" | "minimized";
export type ThemeName = "system7" | "glass" | "dark";
export type WallpaperName = "aqua" | "graphite" | "bondi";
export type Language = "en" | "fr";

export type WindowState = {
  id: AppId;
  status: WindowStatus;
  z: number;
  x: number;
  y: number;
  maximized: boolean;
};

export type Preferences = {
  theme: ThemeName;
  wallpaper: WallpaperName;
  retro: number;
  glass: number;
  animation: number;
  sound: boolean;
  crt: boolean;
  minimal: boolean;
  dock: number;
  transparency: number;
  reducedMotion: boolean;
  cursorTrail: boolean;
  language: Language;
};

export type AppMeta = {
  id: AppId;
  title: string;
  menuTitle: string;
  icon: LucideIcon;
  preview: string;
  size: "sm" | "md" | "lg" | "xl";
  shortcut?: string;
};

export type Certification = {
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
  skills: string[];
  url: string;
  logo: string;
  category: string;
};

export type Toast = {
  id: number;
  title: string;
  text: string;
  tone?: "info" | "success" | "warn";
};
