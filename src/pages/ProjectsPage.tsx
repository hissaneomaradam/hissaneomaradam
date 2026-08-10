import {
  ExternalLink,
  FolderKanban,
  Info,
  Layers3,
  Lightbulb,
  Rocket,
  SearchCode,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {
  SiLaravel,
  SiMysql,
  SiReact,
  SiThreedotjs,
  SiTypescript,
} from "react-icons/si";
import { useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { getProjects } from "../i18n/localizedData";

const techIcons = {
  Laravel: SiLaravel,
  MySQL: SiMysql,
  React: SiReact,
  "Three.js": SiThreedotjs,
  TypeScript: SiTypescript,
};

export default function ProjectsPage() {
  const { language, t } = useI18n();
  const projects = getProjects(language);
  const [selectedName, setSelectedName] = useState(projects[0]?.name ?? "");
  const selected =
    projects.find((project) => project.name === selectedName) ?? projects[0];

  if (!selected) return null;

  return (
    <div className="project-finder">
      <aside
        className="project-finder-sidebar"
        aria-label={language === "fr" ? "Projets" : "Projects"}
      >
        <div className="finder-source-title">
          <FolderKanban size={15} />
          <span>
            {language === "fr" ? "Dossier Projets" : "Projects Folder"}
          </span>
        </div>
        {projects.map((project) => (
          <button
            className={selected.name === project.name ? "selected" : ""}
            key={project.name}
            onClick={() => setSelectedName(project.name)}
          >
            <span className={`project-file-icon ${project.tone}`}>
              <FolderKanban size={18} />
            </span>
            <span>
              <strong>{project.name}</strong>
              <em>{project.status}</em>
            </span>
          </button>
        ))}
      </aside>

      <section className="project-finder-main">
        <div className={`project-preview ${selected.tone}`}>
          <div className="project-browser">
            <span />
            <span />
            <span />
            <b>
              {selected.live
                ? selected.live.replace(/^https?:\/\//, "")
                : "Project"}
            </b>
          </div>
          <div className="project-preview-grid">
            <div>
              <p className="label">{selected.status}</p>
              <h2>{selected.name}</h2>
              <p>{selected.solution}</p>
            </div>
            <div className="project-mini-ui" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>

        <div className="project-meta-row">
          {selected.tech.map((tech) => {
            const TechIcon =
              techIcons[tech as keyof typeof techIcons] ?? SearchCode;
            return (
              <span key={tech}>
                <TechIcon size={16} /> {tech}
              </span>
            );
          })}
          <span>
            <Rocket size={16} /> {selected.timeline}
          </span>
        </div>

        <div className="project-detail-grid">
          <article>
            <h3>
              <Info size={16} /> {t("projects.problem")}
            </h3>
            <p>{selected.problem}</p>
          </article>
          <article>
            <h3>
              <Rocket size={16} /> {t("projects.solution")}
            </h3>
            <p>{selected.solution}</p>
          </article>
          <article>
            <h3>
              <Layers3 size={16} /> {t("projects.architecture")}
            </h3>
            <p>{selected.architecture}</p>
          </article>
          <article>
            <h3>
              <Lightbulb size={16} /> {t("projects.learned")}
            </h3>
            <p>{selected.learned}</p>
          </article>
        </div>

        <div className="feature-list">
          {selected.features.map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
        <div className="project-actions">
          {selected.live && (
            <a href={selected.live} target="_blank" rel="noreferrer">
              {t("projects.live")} <ExternalLink size={13} />
            </a>
          )}

          {selected.github && (
            <a href={selected.github} target="_blank" rel="noreferrer">
              GitHub <FaGithub size={13} />
            </a>
          )}

          {selected.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
