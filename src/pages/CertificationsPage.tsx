import { AnimatePresence, motion } from "motion/react";
import { Award, Copy, Layers3, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { certifications } from "../data/certifications";
import { useI18n } from "../i18n/I18nProvider";
import type { Certification, Toast } from "../types/portfolio";

function CertificationModal({ item, onClose, onToast }: { item: Certification; onClose: () => void; onToast: (title: string, text: string, tone?: Toast["tone"]) => void }) {
  const { t } = useI18n();
  return (
    <motion.aside className="credential-drawer" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}>
      <button className="drawer-close" onClick={onClose}><X size={15} /></button>
      <span className="cert-logo">{item.logo}</span>
      <p className="label">{item.issued}</p>
      <h2>{item.title}</h2>
      <p>{item.issuer}</p>
      <div className="cert-skills">{item.skills.map((tag) => <b key={tag}>{tag}</b>)}</div>
      <button className="download-button" onClick={() => {
        navigator.clipboard?.writeText(item.credentialId || "Credential URL pending");
        onToast(t("cert.copied"), t("cert.copiedText"), "success");
      }}><Copy size={15} /> {t("cert.copy")}</button>
      {item.url ? <a className="download-button" href={item.url} target="_blank" rel="noreferrer">{t("cert.verify")}</a> : <p className="muted">{t("cert.placeholder")}</p>}
    </motion.aside>
  );
}

export default function CertificationsPage({ onToast }: { onToast: (title: string, text: string, tone?: Toast["tone"]) => void }) {
  const { language, t } = useI18n();
  const [query, setQuery] = useState("");
  const [issuer, setIssuer] = useState("all");
  const [skill, setSkill] = useState("all");
  const [selected, setSelected] = useState<Certification | null>(null);
  const issuers = useMemo(() => ["all", ...Array.from(new Set(certifications.map((item) => item.issuer)))], []);
  const skills = useMemo(() => ["all", ...Array.from(new Set(certifications.flatMap((item) => item.skills)))], []);
  const categories = useMemo(() => Array.from(new Set(certifications.map((item) => item.category))), []);
  const issuedDates = useMemo(() => Array.from(new Set(certifications.map((item) => item.issued))), []);
  const verifiedCount = useMemo(() => certifications.filter((item) => item.url).length, []);
  const filtered = useMemo(() => certifications.filter((item) =>
    (issuer === "all" || item.issuer === issuer) &&
    (skill === "all" || item.skills.includes(skill)) &&
    `${item.title} ${item.issuer} ${item.category} ${item.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  ), [issuer, query, skill]);

  return (
    <div className="museum">
      <section className="cert-hero">
        <div>
          <p className="label"><Award size={14} /> {language === "fr" ? "Musée des certificats" : "Certificate Museum"}</p>
          <h2>{language === "fr" ? "Preuves vérifiables de progression" : "Verified Proof of Progress"}</h2>
          <p>{language === "fr" ? "Certifications, badges et réalisations filtrés par organisme et compétence." : "Certifications, badges, and achievements organized by issuer and skill."}</p>
        </div>
        <div className="cert-scoreboard">
          <span><strong>{certifications.length}</strong>{language === "fr" ? "Certificats" : "Certificates"}</span>
          <span><strong>{verifiedCount}</strong>{language === "fr" ? "Vérifiables" : "Verified"}</span>
          <span><strong>{issuers.length - 1}</strong>{language === "fr" ? "Organismes" : "Issuers"}</span>
        </div>
      </section>

      <div className="cert-category-strip">
        {categories.map((category) => <span key={category}><Layers3 size={13} /> {category}</span>)}
      </div>

      <div className="museum-toolbar">
        <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("cert.search")} /></label>
        <select value={issuer} onChange={(event) => setIssuer(event.target.value)}>{issuers.map((item) => <option key={item} value={item}>{item === "all" ? t("cert.all") : item}</option>)}</select>
        <select value={skill} onChange={(event) => setSkill(event.target.value)}>{skills.map((item) => <option key={item} value={item}>{item === "all" ? t("cert.all") : item}</option>)}</select>
      </div>
      <div className="cert-timeline">{issuedDates.map((date) => <span key={date}>{date}</span>)}</div>
      <div className="cert-wall">
        {filtered.map((item) => (
          <button className={`cert-frame ${item.url ? "verified-link" : ""}`} key={`${item.title}-${item.issuer}`} onClick={() => setSelected(item)}>
            <span className="shine" />
            <span className="cert-card-top">
              <span className="cert-logo">{item.logo}</span>
              <span className="verify-badge"><ShieldCheck size={13} /> {item.url ? t("cert.verified") : t("cert.pending")}</span>
            </span>
            <span className="label">{item.category} / {item.issued}</span>
            <h3>{item.title}</h3>
            <p>{item.issuer}</p>
            <small>{item.credentialId ? `${t("cert.credentialId")}: ${item.credentialId}` : t("cert.addUrl")}</small>
            <div className="cert-skills">{item.skills.map((tag) => <b key={tag}>{tag}</b>)}</div>
            <span className="cert-open"><Sparkles size={13} /> {language === "fr" ? "Voir le détail" : "View details"}</span>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="cert-empty">
          <ShieldCheck size={26} />
          <strong>{language === "fr" ? "Aucun certificat trouvé" : "No certificates found"}</strong>
          <span>{language === "fr" ? "Essayez un autre organisme, compétence ou mot-clé." : "Try another issuer, skill, or keyword."}</span>
        </div>
      )}
      <AnimatePresence>
        {selected && <CertificationModal item={selected} onClose={() => setSelected(null)} onToast={onToast} />}
      </AnimatePresence>
    </div>
  );
}
