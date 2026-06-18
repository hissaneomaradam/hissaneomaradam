import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useI18n } from "../i18n/I18nProvider";
import { getProjects } from "../i18n/localizedData";

export default function ProjectsPage() {
  const { language, t } = useI18n();
  const projects = getProjects(language);
  return (
    <div className="case-study-board">
      {projects.map((project) => (
        <article className={`case-study ${project.tone}`} key={project.name}>
          <div className="project-shot"><span /><strong>{project.name}</strong><em>{project.status}</em></div>
          <div className="case-content">
            <div className="tech-row">{project.labels.map((label) => <b key={label}>{label}</b>)}</div>
            <h2>{project.name}</h2>
            <dl>
              <dt>{t("projects.problem")}</dt><dd>{project.problem}</dd>
              <dt>{t("projects.solution")}</dt><dd>{project.solution}</dd>
              <dt>{t("projects.architecture")}</dt><dd>{project.architecture}</dd>
              <dt>{t("projects.learned")}</dt><dd>{project.learned}</dd>
            </dl>
            <div className="feature-list">{project.features.map((feature) => <span key={feature}>{feature}</span>)}</div>
            <div className="project-actions">
              <a href={project.live} target="_blank" rel="noreferrer">{t("projects.live")} <ExternalLink size={13} /></a>
              <a href={project.github} target="_blank" rel="noreferrer">GitHub <FaGithub size={13} /></a>
              <span>{project.timeline}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
