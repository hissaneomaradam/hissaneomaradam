import {
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Code2,
  Download,
  FolderKanban,
  GraduationCap,
  Mail,
  Music,
  Power,
  Settings,
  Sparkles,
  Terminal,
  UserRound,
  Zap,
} from "lucide-react";
import type { AppMeta } from "../types/portfolio";

export const apps: AppMeta[] = [
  { id: "about", title: "About.app", menuTitle: "About", icon: UserRound, preview: "Full-Stack Developer and Software Engineering Student", size: "lg", shortcut: "⌘1" },
  { id: "skills", title: "Skills.app", menuTitle: "Skills", icon: Code2, preview: "Laravel, React, MongoDB, MySQL, Git, APIs", size: "lg", shortcut: "⌘2" },
  { id: "projects", title: "Projects.app", menuTitle: "Projects", icon: FolderKanban, preview: "UniBuddy, CoBIM Cloud, Portfolio", size: "xl", shortcut: "⌘3" },
  { id: "experience", title: "Experience.app", menuTitle: "Experience", icon: BriefcaseBusiness, preview: "INNOV Engineering Consulting", size: "md", shortcut: "⌘4" },
  { id: "education", title: "Education.app", menuTitle: "Education", icon: GraduationCap, preview: "CMC Béni Mellal, ISGI Khouribga", size: "md", shortcut: "⌘5" },
  { id: "certifications", title: "Certificates.app", menuTitle: "Certificates", icon: BadgeCheck, preview: "MongoDB, GitHub Foundations, Cisco", size: "xl", shortcut: "⌘6" },
  { id: "awards", title: "Awards.app", menuTitle: "Awards", icon: Award, preview: "INJAZ and Aman Hackathon wins", size: "md", shortcut: "⌘7" },
  { id: "contact", title: "Contact.app", menuTitle: "Contact", icon: Mail, preview: "Email, GitHub, LinkedIn", size: "md", shortcut: "⌘8" },
  { id: "resume", title: "Resume.app", menuTitle: "Resume", icon: Download, preview: "View or download CV", size: "lg", shortcut: "⌘9" },
  { id: "terminal", title: "Terminal.app", menuTitle: "Terminal", icon: Terminal, preview: "Useful retro terminal commands", size: "md", shortcut: "⌘T" },
  { id: "music", title: "Music.app", menuTitle: "Music", icon: Music, preview: "Listen to my coding playlist", size: "md", shortcut: "⌘P" },
  { id: "settings", title: "Control Panel", menuTitle: "Settings", icon: Settings, preview: "Wallpaper, CRT, glass, dock, motion", size: "lg", shortcut: "⌘," },
  { id: "mac", title: "About This Mac", menuTitle: "About This Mac", icon: Power, preview: "Portfolio OS system profile", size: "sm" },
  { id: "help", title: "Help Center", menuTitle: "Help", icon: Sparkles, preview: "How to navigate this retro OS", size: "md" },
  { id: "whyhire", title: "Why Hire Me?", menuTitle: "Why Hire Me", icon: Zap, preview: "Hidden hiring argument", size: "md" },
];

export const dockApps = apps.filter((app) =>
  ["about", "skills", "projects", "experience", "education", "certifications", "awards", "contact", "resume", "music", "settings"].includes(app.id),
);
