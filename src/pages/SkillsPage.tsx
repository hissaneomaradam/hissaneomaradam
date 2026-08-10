import { useState } from "react";
import {
  BadgeCheck,
  Blocks,
  Bot,
  Box,
  Brain,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Kanban,
  KeyRound,
  Layers3,
  Layout,
  MonitorSmartphone,
  Network,
  PackageCheck,
  PenTool,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  SiBootstrap,
  SiCss,
  SiC,
  SiDocker,
  SiFigma,
  SiGithub,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJira,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiPhp,
  SiPostman,
  SiPython,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { useI18n } from "../i18n/I18nProvider";
import { getSkillGroups } from "../i18n/localizedData";

type SkillIcon = LucideIcon | IconType;

const groupIcons: Record<string, SkillIcon> = {
  "Core Stack": Blocks,
  "Stack Principal": Blocks,
  Languages: Code2,
  Langages: Code2,
  Frontend: Layout,
  Backend: TerminalSquare,
  Databases: Database,
  "Bases de Données": Database,
  "Tools & DevOps": Rocket,
  "Outils & DevOps": Rocket,
  "BIM & 3D": Box,
  Methodologies: Kanban,
  "Méthodologies": Kanban,
  Certifications: BadgeCheck,
  "Currently Learning": Brain,
  "En Apprentissage": Brain,
};

const skillIcons: Record<string, SkillIcon> = {
  laravel: SiLaravel,
  c: SiC,
  react: SiReact,
  php: SiPhp,
  javascript: SiJavascript,
  typescript: SiTypescript,
  python: SiPython,
  sql: Database,
  mysql: SiMysql,
  mongodb: SiMongodb,
  "advanced mongodb": SiMongodb,
  "mongodb crud": SiMongodb,
  "mongodb aggregation": SiMongodb,
  git: SiGit,
  github: SiGithub,
  "github foundations": SiGithub,
  html5: SiHtml5,
  css3: SiCss,
  "tailwind css": SiTailwindcss,
  bootstrap: SiBootstrap,
  "three.js": SiThreedotjs,
  "ifc.js": Box,
  "responsive design": MonitorSmartphone,
  "ui/ux design": PenTool,
  "rest apis": Network,
  "mvc architecture": Layers3,
  authentication: KeyRound,
  authorization: ShieldCheck,
  "crud operations": PackageCheck,
  "api integration": Network,
  validation: ShieldCheck,
  "database design": Database,
  "data modeling": Workflow,
  relationships: Route,
  "query optimization": Rocket,
  docker: SiDocker,
  postman: SiPostman,
  "vs code": Code2,
  figma: SiFigma,
  jira: SiJira,
  vercel: SiVercel,
  "bim workflows": Workflow,
  "ifc models": Box,
  "3d visualization": Cpu,
  "digital construction": Layers3,
  agile: Workflow,
  scrum: Kanban,
  kanban: Kanban,
  "sprint planning": Route,
  "team collaboration": Network,
  "technical documentation": FileCode2,
  "python essentials": Code2,
  cybersecurity: ShieldCheck,
  "modern ai": Bot,
  "iot fundamentals": Cpu,
  "redux toolkit": SiRedux,
  "system design": Layers3,
  "software engineering": Workflow,
  "ai fundamentals": Bot,
  "clean architecture": Layers3,
};

function getSkillIcon(skill: string) {
  return skillIcons[skill.toLowerCase()] ?? Code2;
}

export default function SkillsPage() {
  const { language, t } = useI18n();
  const skillGroups = getSkillGroups(language);
  const [active, setActive] = useState(skillGroups[0]);
  const current = skillGroups.find((group) => group.title === active.title) ?? skillGroups[0];
  const CurrentIcon = groupIcons[current.title] ?? Blocks;

  return (
    <div className="skills-app">
      <aside className="skill-sidebar">
        {skillGroups.map((group) => {
          const GroupIcon = groupIcons[group.title] ?? Blocks;
          return (
            <button className={current.title === group.title ? "selected" : ""} key={group.title} onClick={() => setActive(group)}>
              <GroupIcon size={17} />
              <span>{group.title}</span>
            </button>
          );
        })}
      </aside>
      <section className="skill-panel">
        <p className="label"><CurrentIcon size={14} /> {t("skills.explorer")}</p>
        <h2>{current.title}</h2>
        <p>{current.note}</p>
        <div className="badge-cloud">
          {current.skills.map((skill) => {
            const SkillIcon = getSkillIcon(skill);
            return (
              <span key={skill}>
                <SkillIcon size={15} />
                {skill}
              </span>
            );
          })}
        </div>
      </section>
    </div>
  );
}
