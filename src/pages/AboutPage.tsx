import { BadgeCheck, Code2, FolderKanban, Mail, MapPin, Rocket, Trophy, UserRound, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { certifications } from "../data/certifications";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/I18nProvider";
import { getProfileCopy } from "../i18n/localizedData";
import type { AppId } from "../types/portfolio";

export default function AboutPage({ onOpen }: { onOpen: (id: AppId) => void }) {
  const { language, t } = useI18n();
  const profileCopy = getProfileCopy(language);
  const highlights = language === "fr" ? [
    { title: "Produit", text: "Je pense en parcours utilisateur, pas seulement en pages." },
    { title: "Full-stack", text: "React côté interface, Laravel/API côté logique métier." },
    { title: "Progression", text: "Projets réels, certifications, itération et livraison." },
  ] : [
    { title: "Product Mindset", text: "I think in user flows, not just screens." },
    { title: "Full-stack Build", text: "React for interfaces, Laravel/API for product logic." },
    { title: "Progression", text: "Real projects, certifications, iteration, and shipping." },
  ];
  const shortcuts: { label: string; value: string; app: AppId; icon: LucideIcon; tone: string }[] = [
    { label: t("about.projects"), value: "3+", app: "projects", icon: FolderKanban, tone: "blue" },
    { label: t("about.certifications"), value: `${certifications.length}`, app: "certifications", icon: BadgeCheck, tone: "green" },
    { label: t("about.hackathons"), value: "2", app: "awards", icon: Zap, tone: "purple" },
    { label: t("about.awards"), value: "2", app: "awards", icon: Trophy, tone: "gold" },
    { label: t("about.technologies"), value: "20+", app: "skills", icon: Code2, tone: "gray" },
  ];

  return (
    <div className="about-app">
      <section className="about-mac-card">
        <div className="about-mac-left">
          <div className={`about-portrait ${profile.photo ? "has-image" : ""}`}>
            {profile.photo ? <img src={profile.photo} alt={`${profile.name} profile`} /> : <span>OA</span>}
          </div>
          <div className="about-online"><span /> {language === "fr" ? "Disponible" : "Available"}</div>
        </div>
        <div className="about-mac-main">
          <p className="label">HISSANE OS PROFILE</p>
          <h2>{profile.name}</h2>
          <p className="about-role-line">{profileCopy.title} / {profileCopy.subtitle}</p>
          <p>{profileCopy.about}</p>
          <div className="about-specs">
            <span><UserRound size={14} /> {profileCopy.title}</span>
            <span><MapPin size={14} /> {profile.location}</span>
            <span><Rocket size={14} /> {language === "fr" ? "Ouvert aux opportunités" : "Open to opportunities"}</span>
          </div>
          <div className="about-actions">
            <button className="magnetic-button" onClick={() => onOpen("projects")}><FolderKanban size={16} /> {t("about.projects")}</button>
            <button className="magnetic-button ghost" onClick={() => onOpen("skills")}><Code2 size={16} /> {t("about.technologies")}</button>
            <button className="magnetic-button ghost" onClick={() => onOpen("contact")}><Mail size={16} /> Contact</button>
          </div>
        </div>
      </section>

      <section className="about-highlight-row">
        {highlights.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </article>
        ))}
      </section>

      <div className="about-shortcuts" aria-label={language === "fr" ? "Raccourcis profil" : "Profile shortcuts"}>
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
          <button className={`about-shortcut ${item.tone}`} key={item.label} onClick={() => onOpen(item.app)}>
            <span className="about-shortcut-icon"><Icon size={18} /></span>
            <span className="about-shortcut-copy">
              <strong>{item.label}</strong>
              <em>{item.app}.app</em>
            </span>
            <b>{item.value}</b>
          </button>
          );
        })}
      </div>
    </div>
  );
}
