import { useI18n } from "../i18n/I18nProvider";

export default function ExperiencePage() {
  const { t } = useI18n();
  return (
    <div className="timeline-app">
      <div className="timeline-node" />
      <article>
        <p className="label">{t("experience.date")}</p>
        <h2>{t("experience.title")}</h2>
        <h3>{t("experience.company")}</h3>
        <ul>
          <li>{t("experience.task1")}</li>
          <li>{t("experience.task2")}</li>
          <li>{t("experience.task3")}</li>
          <li>{t("experience.task4")}</li>
        </ul>
      </article>
    </div>
  );
}
