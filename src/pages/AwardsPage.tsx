import { Award } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { getAchievements } from "../i18n/localizedData";

export default function AwardsPage() {
  const { language } = useI18n();
  const achievements = getAchievements(language);
  return (
    <div className="trophy-room">
      {achievements.map((achievement) => (
        <article key={achievement.title} className="trophy-card">
          <div className="trophy-icon"><Award size={34} /></div>
          <p className="label">{achievement.rank}</p>
          <h2>{achievement.title}</h2>
          <p>{achievement.detail}</p>
        </article>
      ))}
    </div>
  );
}
