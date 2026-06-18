import { BookOpen } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

function Milestone({ title, meta, date, note }: { title: string; meta: string; date: string; note: string }) {
  return (
    <article className="milestone">
      <BookOpen size={19} />
      <div>
        <p className="label">{date}</p>
        <h2>{title}</h2>
        <h3>{meta}</h3>
        <p>{note}</p>
      </div>
    </article>
  );
}

export default function EducationPage() {
  const { t } = useI18n();
  return (
    <div className="education-map">
      <Milestone title="Développement Web Full Stack" meta="CMC Béni Mellal - OFPPT" date="Sep 2025 - Present" note={t("education.fullStack.note")} />
      <Milestone title="Développement Digital" meta="ISGI Khouribga" date="Sep 2024 - Jul 2025" note={t("education.digital.note")} />
    </div>
  );
}
