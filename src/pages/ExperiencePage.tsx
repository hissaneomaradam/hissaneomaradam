import { useI18n } from "../i18n/I18nProvider";
import { BriefcaseBusiness, Code2, MapPinned, Sparkles } from "lucide-react";

export default function ExperiencePage() {
  const { language, t } = useI18n();

  const experiences = [
    {
      icon: BriefcaseBusiness,
      date: t("experience.date"),
      title: t("experience.title"),
      company: t("experience.company"),
      tasks: [
        t("experience.task1"),
        t("experience.task2"),
        t("experience.task3"),
        t("experience.task4"),
      ],
    },
    {
      icon: Code2,
      date: t("experience.date2"),
      title: t("experience.title2"),
      company: t("experience.company2"),
      tasks: [
        t("experience.task5"),
        t("experience.task6"),
        t("experience.task7"),
        t("experience.task8"),
      ],
    },
    {
      icon: MapPinned,
      date: t("experience.date3"),
      title: t("experience.title3"),
      company: t("experience.company3"),
      tasks: [
        t("experience.task9"),
        t("experience.task10"),
        t("experience.task11"),
        t("experience.task12"),
      ],
    },
  ];

  const totalTasks = experiences.reduce((count, experience) => count + experience.tasks.length, 0);

  return (
    <div className="experience-app">
      <section className="experience-hero">
        <div>
          <p className="label">{language === "fr" ? "Parcours" : "Experience"}</p>
          <h2>{language === "fr" ? "Timeline professionnelle" : "Professional timeline"}</h2>
          <p className="muted">
            {language === "fr"
              ? "Une vue claire de mes stages, bootcamp et travaux terrain, avec les compétences construites à chaque étape."
              : "A clear view of my internships, bootcamp, and field work, with the skills built at each step."}
          </p>
        </div>
        <div className="experience-summary">
          <span><Sparkles size={14} /> 3 roles</span>
          <span><BriefcaseBusiness size={14} /> {totalTasks} key contributions</span>
          <span><Code2 size={14} /> Full-stack + systems learning</span>
        </div>
      </section>

      <div className="experience-grid">
        {experiences.map((experience, index) => {
          const Icon = experience.icon;
          return (
            <article className="experience-card" key={index}>
              <div className="experience-card-top">
                <div className="experience-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="label">{experience.date}</p>
                  <h2>{experience.title}</h2>
                  <h3>{experience.company}</h3>
                </div>
              </div>

              <ol className="experience-list">
                {experience.tasks.map((task, taskIndex) => (
                  <li key={taskIndex}>{task}</li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </div>
  );
}