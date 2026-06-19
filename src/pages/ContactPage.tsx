import { motion } from "motion/react";
import { Copy, Mail, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/I18nProvider";
import type { Toast } from "../types/portfolio";
import { contactEndpoint } from "../config/contact";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage({ onToast }: { onToast: (title: string, text: string, tone?: Toast["tone"]) => void }) {
  const { language, t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(t("contact.defaultSubject"));
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [sending, setSending] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [largeMessage, setLargeMessage] = useState(false);
  const deliveryMode = contactEndpoint ? t("contact.direct") : t("contact.mailto");
  const subjectChips = [
    t("contact.defaultSubject"),
    t("contact.subjectInternship"),
    t("contact.subjectProject"),
    t("contact.subjectFreelance"),
  ];
  const links = [
    { label: "Email", value: profile.email, display: profile.email, action: t("contact.emailAction"), href: `mailto:${profile.email}`, icon: Mail },
    { label: "GitHub", value: profile.github, display: "OmarAdamHissane", action: t("contact.githubAction"), href: profile.github, icon: FaGithub },
    { label: "LinkedIn", value: profile.linkedin, display: "hissane-omar-adam", action: t("contact.linkedinAction"), href: profile.linkedin, icon: FaLinkedin },
  ];

  useEffect(() => {
    setSubject(t("contact.defaultSubject"));
  }, [language]);

  function openMailClient() {
    const body = [
      `${t("contact.name")}: ${name.trim()}`,
      `${t("contact.email")}: ${email.trim()}`,
      "",
      `${t("contact.message")}:`,
      message.trim(),
      "",
      "Sent from HISSANE Portfolio OS Contact.app",
    ].join("\n");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      onToast(t("contact.notReady"), t("contact.notReadyText"), "warn");
      return;
    }
    if (!emailPattern.test(email.trim())) {
      onToast(t("contact.invalid"), t("contact.invalidText"), "warn");
      return;
    }
    if (company.trim()) return;

    setSending(true);

    if (!contactEndpoint) {
      window.setTimeout(() => {
        openMailClient();
        setSending(false);
        onToast(t("contact.prepared"), t("contact.preparedText"), "success");
      }, 520);
      return;
    }

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _replyto: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          source: "HISSANE Portfolio OS Contact.app",
        }),
      });

      if (!response.ok) throw new Error(`Contact endpoint returned ${response.status}`);

      setSending(false);
      setName("");
      setEmail("");
      setSubject(t("contact.defaultSubject"));
      setMessage("");
      setCollapsed(false);
      setLargeMessage(false);
      onToast(t("contact.sent"), t("contact.sentText"), "success");
    } catch {
      setSending(false);
      onToast(t("contact.failed"), t("contact.failedText"), "warn");
      openMailClient();
    }
  }

  function clearDraft() {
    setName("");
    setEmail("");
    setSubject(t("contact.defaultSubject"));
    setMessage("");
    setCollapsed(false);
    setLargeMessage(false);
    onToast(t("contact.draftCleared"), t("contact.draftClearedText"), "info");
  }

  function fillStarter() {
    const starter = language === "fr"
      ? "Bonjour Omar,\n\nJe vous contacte à propos de...\n\nObjectif:\nDélai:\nBudget / contexte:\n\nMerci,"
      : "Hi Omar,\n\nI am reaching out about...\n\nGoal:\nTimeline:\nBudget / context:\n\nThanks,";
    setMessage((current) => current.trim() ? current : starter);
  }

  return (
    <div className="contact-suite">
      <section className="mail-console">
        <div className="mail-sidebar">
          <div className="mail-hero">
            <motion.div className="mail-envelope" animate={sending ? { y: [-2, -14, -2], rotate: [0, -3, 3, 0] } : { y: 0 }} transition={{ duration: 0.52 }}>
              <Mail size={40} />
            </motion.div>
            <div>
              <p className="label">{t("contact.status")}</p>
              <h2>{t("contact.open")}</h2>
              <button className="mail-copy" onClick={() => { navigator.clipboard?.writeText(profile.email); onToast(t("contact.copied"), profile.email, "success"); }}><Copy size={15} /> {t("contact.copyEmail")}</button>
            </div>
          </div>
          <div className="contact-app">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a className="contact-link-card" key={link.label} href={link.href} target={link.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer">
                  <span className="contact-link-icon"><Icon size={20} /></span>
                  <span className="contact-link-copy">
                    <span>{link.label}</span>
                    <strong>{link.display}</strong>
                    <small>{link.action}</small>
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <form className={`retro-form mail-window ${collapsed ? "is-collapsed" : ""} ${largeMessage ? "message-large" : ""}`} onSubmit={submit}>
          <div className="mail-toolbar">
            <div className="mail-window-buttons" aria-label={t("contact.windowActions")}>
              <button type="button" className="mail-dot close" onClick={clearDraft} title={t("contact.clearDraft")} />
              <button type="button" className="mail-dot minimize" onClick={() => setCollapsed((current) => !current)} title={collapsed ? t("contact.restoreDraft") : t("contact.minimizeDraft")} />
              <button type="button" className="mail-dot zoom" onClick={() => setLargeMessage((current) => !current)} title={largeMessage ? t("contact.compactMessage") : t("contact.expandMessage")} />
            </div>
            <strong>{t("contact.newMessage")}</strong>
            <small>{deliveryMode}</small>
          </div>

          {!collapsed && (
            <>
              <div className="compose-grid">
                <label>
                  <span>{t("contact.name")}</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Omar Client" autoComplete="name" />
                </label>
                <label>
                  <span>{t("contact.email")}</span>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" inputMode="email" />
                </label>
              </div>
              <label className="compose-field">
                <span>{t("contact.subject")}</span>
                <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder={t("contact.subject")} />
              </label>
              <div className="subject-chips" aria-label={t("contact.quickSubjects")}>
                {subjectChips.map((chip) => <button key={chip} type="button" onClick={() => setSubject(chip)}>{chip}</button>)}
                <button type="button" onClick={fillStarter}><Sparkles size={14} /> {t("contact.starter")}</button>
              </div>
              <input className="mail-honeypot" value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" tabIndex={-1} autoComplete="off" />
              <label className="compose-field">
                <span>{t("contact.message")}</span>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t("contact.message")} maxLength={1600} />
              </label>
              <div className="mail-status">
                <span>{contactEndpoint ? t("contact.secureDelivery") : t("contact.fallbackDelivery")}</span>
                <b>{message.length}/1600</b>
              </div>
              <div className="compose-actions">
                <button type="button" className="magnetic-button ghost" onClick={openMailClient}>{t("contact.openMailApp")}</button>
                <button className={`download-button send-button ${sending ? "sending" : ""}`} disabled={sending}>
                  <Send size={17} /> {sending ? t("contact.preparing") : t("contact.send")}
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </div>
  );
}
