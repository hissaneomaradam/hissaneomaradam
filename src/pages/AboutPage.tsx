import { Sparkles } from "lucide-react";
import { certifications } from "../data/certifications";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/I18nProvider";
import { getProfileCopy } from "../i18n/localizedData";
import type { AppId } from "../types/portfolio";

export default function AboutPage({ onOpen }: { onOpen: (id: AppId) => void }) {
  const { language, t } = useI18n();
  const profileCopy = getProfileCopy(language);
  const stats = [
    [t("about.projects"), "3+"],
    [t("about.certifications"), `${certifications.length}`],
    [t("about.hackathons"), "2"],
    [t("about.awards"), "2"],
    [t("about.technologies"), "20+"],
  ];

  return (
    <div className="about-app">
      <div className="profile-card about-this-mac">
        <div className={`avatar-orbit ${profile.photo ? "has-image" : ""}`}>
          {profile.photo ? <img src={profile.photo} alt={`${profile.name} profile`} /> : <span>OA</span>}
        </div>
        <div>
          <p className="label">{t("about.label")}</p>
          <h2>{profile.name}</h2>
          <p>{profileCopy.about}</p>
          <div className="quick-list">
            <span>{t("about.role")}: {profileCopy.title}</span>
            <span>{t("about.education")}</span>
            <span>{t("about.stack")}</span>
            <span>{t("about.goal")}</span>
          </div>
        </div>
      </div>
      <div className="stats-grid">
        {stats.map(([label, value]) => (
          <button key={label} onClick={() => onOpen(label === t("about.certifications") ? "certifications" : label === t("about.projects") ? "projects" : "awards")}>
            <Sparkles size={16} />
            <strong>{value}</strong>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
