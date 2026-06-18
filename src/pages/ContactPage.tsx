import { motion } from "motion/react";
import { Copy, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/I18nProvider";
import type { Toast } from "../types/portfolio";

export default function ContactPage({ onToast }: { onToast: (title: string, text: string, tone?: Toast["tone"]) => void }) {
  const { language, t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(t("contact.defaultSubject"));
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    { label: "GitHub", value: profile.github, href: profile.github, icon: FaGithub },
    { label: "LinkedIn", value: profile.linkedin, href: profile.linkedin, icon: FaLinkedin },
  ];

  useEffect(() => {
    setSubject(t("contact.defaultSubject"));
  }, [language]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      onToast(t("contact.notReady"), t("contact.notReadyText"), "warn");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      onToast(t("contact.invalid"), t("contact.invalidText"), "warn");
      return;
    }
    setSending(true);
    const body = [
      `${t("contact.name")}: ${name.trim()}`,
      `${t("contact.email")}: ${email.trim()}`,
      "",
      `${t("contact.message")}:`,
      message.trim(),
      "",
      "Sent from HISSANE Portfolio OS Contact.app",
    ].join("\n");
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => {
      window.location.href = mailto;
      setSending(false);
      onToast(t("contact.prepared"), t("contact.preparedText"), "success");
    }, 520);
  }

  return (
    <div className="contact-suite">
      <div className="mail-hero">
        <motion.div className="mail-envelope" animate={sending ? { y: [-2, -14, -2], rotate: [0, -3, 3, 0] } : { y: 0 }} transition={{ duration: 0.52 }}>
          <Mail size={44} />
        </motion.div>
        <h2>{t("contact.open")}</h2>
        <button onClick={() => { navigator.clipboard?.writeText(profile.email); onToast(t("contact.copied"), profile.email, "success"); }}><Copy size={15} /> {t("contact.copyEmail")}</button>
      </div>
      <div className="contact-app">
        {links.map((link) => {
          const Icon = link.icon;
          return <a key={link.label} href={link.href} target={link.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"><Icon size={20} /><span>{link.label}</span><strong>{link.value}</strong></a>;
        })}
      </div>
      <form className="retro-form mail-window" onSubmit={submit}>
        <div className="mail-toolbar"><span /><strong>{t("contact.newMessage")}</strong><small>{t("contact.mailto")}</small></div>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder={t("contact.name")} />
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("contact.email")} />
        <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder={t("contact.subject")} />
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t("contact.message")} />
        <button className={`download-button send-button ${sending ? "sending" : ""}`} disabled={sending}>
          <Mail size={17} /> {sending ? t("contact.preparing") : t("contact.send")}
        </button>
      </form>
    </div>
  );
}
