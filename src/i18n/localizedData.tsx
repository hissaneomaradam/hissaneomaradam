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
import type { AppMeta, Language } from "../types/portfolio";
import { profile } from "../data/profile";

const appCopy: Record<Language, Record<string, Pick<AppMeta, "title" | "menuTitle" | "preview">>> = {
  en: {
    about: { title: "About.app", menuTitle: "About", preview: "Full-Stack Developer and Software Engineering Student" },
    skills: { title: "Skills.app", menuTitle: "Skills", preview: "Laravel, React, MongoDB, MySQL, Git, APIs" },
    projects: { title: "Projects.app", menuTitle: "Projects", preview: "UniBuddy, CoBIM Cloud, Portfolio" },
    experience: { title: "Experience.app", menuTitle: "Experience", preview: "INNOV Engineering Consulting" },
    education: { title: "Education.app", menuTitle: "Education", preview: "CMC Béni Mellal, ISGI Khouribga" },
    certifications: { title: "Certificates.app", menuTitle: "Certificates", preview: "MongoDB, GitHub Foundations, Cisco" },
    awards: { title: "Awards.app", menuTitle: "Awards", preview: "INJAZ and Aman Hackathon wins" },
    contact: { title: "Contact.app", menuTitle: "Contact", preview: "Email, GitHub, LinkedIn" },
    resume: { title: "Resume.app", menuTitle: "Resume", preview: "View or download CV" },
    terminal: { title: "Terminal.app", menuTitle: "Terminal", preview: "Useful retro terminal commands" },
    music: { title: "Music.app", menuTitle: "Music", preview: "Listen to my coding playlist" },
    settings: { title: "Control Panel", menuTitle: "Settings", preview: "Wallpaper, CRT, glass, dock, motion" },
    mac: { title: "About This Mac", menuTitle: "About This Mac", preview: "Portfolio OS system profile" },
    help: { title: "Help Center", menuTitle: "Help", preview: "How to navigate this retro OS" },
    whyhire: { title: "Why Hire Me?", menuTitle: "Why Hire Me", preview: "Hidden hiring argument" },
  },
  fr: {
    about: { title: "À propos.app", menuTitle: "À propos", preview: "Développeur Full-Stack et étudiant en génie logiciel" },
    skills: { title: "Compétences.app", menuTitle: "Compétences", preview: "Laravel, React, MongoDB, MySQL, Git, APIs" },
    projects: { title: "Projets.app", menuTitle: "Projets", preview: "UniBuddy, CoBIM Cloud, Portfolio" },
    experience: { title: "Expérience.app", menuTitle: "Expérience", preview: "INNOV Engineering Consulting" },
    education: { title: "Formation.app", menuTitle: "Formation", preview: "CMC Béni Mellal, ISGI Khouribga" },
    certifications: { title: "Certificats.app", menuTitle: "Certificats", preview: "MongoDB, GitHub Foundations, Cisco" },
    awards: { title: "Prix.app", menuTitle: "Prix", preview: "Réussites INJAZ et Aman Hackathon" },
    contact: { title: "Contact.app", menuTitle: "Contact", preview: "Email, GitHub, LinkedIn" },
    resume: { title: "CV.app", menuTitle: "CV", preview: "Voir ou télécharger le CV" },
    terminal: { title: "Terminal.app", menuTitle: "Terminal", preview: "Commandes rétro utiles" },
    music: { title: "Musique.app", menuTitle: "Musique", preview: "Écouter ma playlist de code" },
    settings: { title: "Panneau de contrôle", menuTitle: "Réglages", preview: "Fond d'écran, CRT, verre, dock, motion" },
    mac: { title: "À propos de ce Mac", menuTitle: "À propos de ce Mac", preview: "Profil système du Portfolio OS" },
    help: { title: "Centre d'aide", menuTitle: "Aide", preview: "Comment naviguer dans ce rétro OS" },
    whyhire: { title: "Pourquoi me recruter ?", menuTitle: "Pourquoi moi", preview: "Argument de recrutement caché" },
  },
};

const baseApps = [
  { id: "about", icon: UserRound, size: "lg", shortcut: "⌘1" },
  { id: "skills", icon: Code2, size: "lg", shortcut: "⌘2" },
  { id: "projects", icon: FolderKanban, size: "xl", shortcut: "⌘3" },
  { id: "experience", icon: BriefcaseBusiness, size: "md", shortcut: "⌘4" },
  { id: "education", icon: GraduationCap, size: "md", shortcut: "⌘5" },
  { id: "certifications", icon: BadgeCheck, size: "xl", shortcut: "⌘6" },
  { id: "awards", icon: Award, size: "md", shortcut: "⌘7" },
  { id: "contact", icon: Mail, size: "md", shortcut: "⌘8" },
  { id: "resume", icon: Download, size: "lg", shortcut: "⌘9" },
  { id: "terminal", icon: Terminal, size: "md", shortcut: "⌘T" },
  { id: "music", icon: Music, size: "md", shortcut: "⌘P" },
  { id: "settings", icon: Settings, size: "lg", shortcut: "⌘," },
  { id: "mac", icon: Power, size: "sm" },
  { id: "help", icon: Sparkles, size: "md" },
  { id: "whyhire", icon: Zap, size: "md" },
] as const;

export function getApps(language: Language): AppMeta[] {
  return baseApps.map((app) => ({ ...app, ...appCopy[language][app.id] })) as AppMeta[];
}

export function getDockApps(language: Language) {
  return getApps(language).filter((app) =>
    ["about", "skills", "projects", "experience", "education", "certifications", "awards", "contact", "resume", "music", "settings"].includes(app.id),
  );
}

export function getProfileCopy(language: Language) {
  return {
    about:
      language === "fr"
        ? "Développeur Web Full-Stack et étudiant en génie logiciel, je construis des produits réels avec Laravel, PHP, React, JavaScript, MySQL et MongoDB. Expérimenté avec les APIs REST, Agile, Scrum, Kanban, les workflows Git et l'architecture full-stack."
        : profile.about,
    claim:
      language === "fr"
        ? "Développeur Full-Stack, créateur, problem solver, futur ingénieur logiciel."
        : profile.claim,
    title: language === "fr" ? "Développeur Web Full-Stack" : profile.title,
    subtitle: language === "fr" ? "Étudiant en Génie Logiciel" : profile.subtitle,
  };
}

export function getSkillGroups(language: Language) {
  return [
  {
    title: language === "fr" ? "Stack Principal" : "Core Stack",
    skills: [
      "Laravel",
      "React",
      "PHP",
      "JavaScript",
      "TypeScript",
      "MySQL",
      "MongoDB",
      "Git",
      "GitHub"
    ],
    note:
      language === "fr"
        ? "Les technologies que j'utilise le plus pour développer des applications web full-stack modernes."
        : "The technologies I use most frequently to build modern full-stack web applications."
  },

  {
    title: language === "fr" ? "Langages" : "Languages",
    skills: [
      "PHP",
      "JavaScript",
      "TypeScript",
      "Python",
      "SQL"
    ],
    note:
      language === "fr"
        ? "Langages utilisés pour le développement backend, frontend, bases de données et automatisation."
        : "Languages used for backend development, frontend logic, databases, and automation."
  },

  {
    title: "Frontend",
    skills: [
      "HTML5",
      "CSS3",
      "React",
      "Bootstrap",
      "Tailwind CSS",
      "Three.js",
      "Ifc.js",
      "Responsive Design",
      "UI/UX"
    ],
    note:
      language === "fr"
        ? "Création d'interfaces modernes, responsives, accessibles et interactives."
        : "Building responsive, accessible, and interactive user interfaces."
  },

  {
    title: "Backend",
    skills: [
      "Laravel",
      "REST APIs",
      "MVC",
      "Authentication",
      "Authorization",
      "CRUD Operations",
      "API Integration",
      "Validation"
    ],
    note:
      language === "fr"
        ? "Conception d'API sécurisées, authentification, architecture MVC et logique métier."
        : "Secure API design, authentication flows, MVC architecture, and business logic."
  },

  {
    title: language === "fr" ? "Bases de données" : "Databases",
    skills: [
      "MySQL",
      "MongoDB",
      "Database Design",
      "Data Modeling",
      "MongoDB Aggregation",
      "Relationships",
      "Query Optimization"
    ],
    note:
      language === "fr"
        ? "Conception de bases relationnelles et NoSQL, agrégation MongoDB et optimisation des requêtes."
        : "Relational and NoSQL database design, MongoDB aggregation, and query optimization."
  },

  {
    title: language === "fr" ? "Outils & DevOps" : "Tools & DevOps",
    skills: [
      "Git",
      "GitHub",
      "Docker",
      "Postman",
      "VS Code",
      "Figma",
      "Jira",
      "Vercel"
    ],
    note:
      language === "fr"
        ? "Contrôle de version, collaboration, déploiement, prototypage et productivité."
        : "Version control, collaboration, deployment, prototyping, and productivity tools."
  },

  {
    title: language === "fr" ? "BIM & 3D" : "BIM & 3D",
    skills: [
      "BIM Workflows",
      "IFC Models",
      "Three.js",
      "Ifc.js",
      "3D Visualization",
      "Digital Construction"
    ],
    note:
      language === "fr"
        ? "Développement d'applications BIM et visualisation 3D interactive pour le web."
        : "Building BIM-focused applications and interactive 3D web visualizations."
  },

  {
    title: language === "fr" ? "Méthodologies" : "Methodologies",
    skills: [
      "Agile",
      "Scrum",
      "Kanban",
      "Sprint Planning",
      "Team Collaboration",
      "Technical Documentation"
    ],
    note:
      language === "fr"
        ? "Méthodes de travail agiles, collaboration d'équipe et amélioration continue."
        : "Agile workflows, team collaboration, planning, and continuous improvement."
  },

  {
    title: language === "fr" ? "Certifications" : "Certifications",
    skills: [
      "GitHub Foundations",
      "MongoDB CRUD",
      "MongoDB Aggregation",
      "Python Essentials",
      "Cybersecurity",
      "Modern AI",
      "IoT Fundamentals"
    ],
    note:
      language === "fr"
        ? "Compétences validées par des certifications MongoDB, Cisco et DataCamp."
        : "Skills validated through MongoDB, Cisco, and DataCamp certifications."
  },

  {
    title: language === "fr" ? "En Apprentissage" : "Currently Learning",
    skills: [
      "Redux Toolkit",
      "System Design",
      "Software Engineering",
      "Advanced MongoDB",
      "AI Fundamentals",
      "Clean Architecture"
    ],
    note:
      language === "fr"
        ? "Technologies et concepts que j'explore actuellement à travers des projets et certifications."
        : "Technologies and concepts I am currently exploring through projects and certifications."
  }
];
}

export function getProjects(language: Language) {
  const fr = language === "fr";
  return [
    {
      name: "UniBuddy",
      labels: ["Full Stack", "Laravel", "React", "MySQL", fr ? "Déployé" : "Deployed"],
      tech: ["React", "Laravel", "MySQL"],
      live: "https://unibuddy.me",
      github: profile.github,
      status: fr ? "Produit live" : "Live product",
      timeline: "2025 - 2026",
      problem: fr ? "Les étudiants ont besoin d'un espace clair pour collaborer, réseauter et gérer les workflows campus." : "Students need a focused place to collaborate, network, and manage campus workflows.",
      solution: fr ? "Une plateforme étudiante responsive avec authentification, rôles, APIs REST et backend MVC scalable." : "A responsive student platform with authentication, roles, REST APIs, and a scalable MVC backend.",
      features: fr ? ["Authentification", "Accès par rôles", "UI responsive", "Backend REST/MVC"] : ["Authentication", "Role-based access", "Responsive UI", "REST/MVC backend"],
      architecture: fr ? "Interface React, couche API Laravel, persistance MySQL et routage selon les rôles." : "React interface, Laravel API layer, MySQL persistence, role-aware routing.",
      learned: fr ? "Flux d'authentification solides, modélisation relationnelle, structure API et UX produit." : "Strong authentication flows, relational modeling, API structure, and product UX.",
      tone: "blue",
    },
    {
      name: "CoBIM Cloud",
      labels: ["Full Stack", "Laravel", "React", "Three.js", fr ? "Déployé" : "Deployed"],
      tech: ["Laravel", "React", "Three.js"],
      live: "https://cobim-cloud.vercel.app",
      github: profile.github,
      status: "Prototype",
      timeline: "2026",
      problem: fr ? "Les workflows BIM sont techniques, visuels et difficiles à rendre accessibles dans un produit web." : "BIM workflows are technical, visual, and difficult to make approachable in a browser product.",
      solution: fr ? "Une interface cloud orientée BIM avec UX responsive et frontend prêt pour les workflows 3D." : "A cloud BIM-focused interface with responsive UX and a frontend ready for 3D workflows.",
      features: fr ? ["Workflows BIM", "Interface responsive", "Frontend prêt 3D", "UX produit cloud"] : ["BIM workflows", "Responsive interface", "3D-ready frontend", "Cloud product UX"],
      architecture: fr ? "Couche service Laravel, UI React et surface de visualisation Three.js." : "Laravel service layer, React UI, Three.js visualization surface.",
      learned: fr ? "Associer des workflows métier spécifiques avec un design produit full-stack moderne." : "How to pair domain-specific workflows with modern full-stack product design.",
      tone: "green",
    },
    {
      name: "Personal Portfolio",
      labels: ["React", "TypeScript", "Motion", fr ? "Système d'exploitation" : "Operating System"],
      tech: ["React", "TypeScript", "Motion"],
      live: profile.portfolio,
      github: profile.github,
      status: fr ? "Actif" : "Active",
      timeline: "2026",
      problem: fr ? "Un portfolio classique ne montre pas assez le goût produit, l'interaction design et la personnalité." : "A normal portfolio cannot fully show engineering taste, interaction design, and personality.",
      solution: fr ? "Un système d'exploitation inspiré Macintosh avec fenêtres, recherche, terminal, dock et préférences." : "A Macintosh-inspired operating system with windows, search, terminal, dock, and system preferences.",
      features: fr ? ["Window manager", "Recherche Spotlight", "Musée des certificats", "Terminal caché"] : ["Window manager", "Spotlight search", "Certification museum", "Hidden terminal"],
      architecture: fr ? "Registre d'apps React, état de fenêtres persistant, contenu JSON et UI animée." : "React app registry, persistent window state, JSON-backed content, motion-based UI.",
      learned: fr ? "Animations performantes, interaction design et création d'une expérience de marque personnelle." : "Performance-aware animation, interaction design, and building an experience as a personal brand.",
      tone: "purple",
    },
  ];
}

export function getAchievements(language: Language) {
  return [
    { rank: language === "fr" ? "3e Place" : "3rd Place", title: "INJAZ Al-Maghrib Entrepreneurship Competition", detail: language === "fr" ? "Reconnaissance régionale en entrepreneuriat pour la vision produit et l'exécution en équipe." : "Regional entrepreneurship recognition for product thinking and team execution." },
    { rank: language === "fr" ? "1re Place" : "1st Place", title: "Aman Hackathon Core x Loga Sprint ESTBm", detail: language === "fr" ? "Victoire en hackathon grâce à la résolution rapide, la collaboration et la livraison sous pression." : "Hackathon win for fast problem solving, collaboration, and shipping under pressure." },
  ];
}
