import { useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { getSkillGroups } from "../i18n/localizedData";

export default function SkillsPage() {
  const { language, t } = useI18n();
  const skillGroups = getSkillGroups(language);
  const [active, setActive] = useState(skillGroups[0]);
  const current = skillGroups.find((group) => group.title === active.title) ?? skillGroups[0];

  return (
    <div className="skills-app">
      <aside className="skill-sidebar">
        {skillGroups.map((group) => (
          <button className={current.title === group.title ? "selected" : ""} key={group.title} onClick={() => setActive(group)}>
            {group.title}
          </button>
        ))}
      </aside>
      <section className="skill-panel">
        <p className="label">{t("skills.explorer")}</p>
        <h2>{current.title}</h2>
        <p>{current.note}</p>
        <div className="badge-cloud">{current.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
      </section>
    </div>
  );
}
