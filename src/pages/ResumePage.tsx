import { Download, ExternalLink, FileText, Sparkles, ShieldCheck, ScanEye } from "lucide-react";
import { useState } from "react";
import { resumeImgUrl } from "../data/resume";
import { resumePdfUrl } from "../data/resume";
import { useI18n } from "../i18n/I18nProvider";

export default function ResumePage({ onDownload }: { onDownload: () => void }) {
  const { t } = useI18n();
  const [zoomed, setZoomed] = useState(false);
  return (
    <div className="resume-app">
      <section className="resume-hero">
        <div>
          <p className="label">{t("resume.summary")}</p>
          <h2>Resume Hub</h2>
          <p className="muted">
            Preview the CV, open the PDF in a new tab, or download the latest version in one click.
          </p>
        </div>
        <div className="resume-actions">
          <a className="download-button ghost" href={resumePdfUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            {t("resume.openPdf")}
          </a>
          <button className="download-button ghost" onClick={() => setZoomed((current) => !current)}>
            <ScanEye size={16} />
            {zoomed ? "Fit preview" : "Zoom preview"}
          </button>
          <button className="download-button" onClick={onDownload}>
            <Download size={17} />
            {t("resume.download")}
          </button>
        </div>
      </section>

      <div className="resume-layout">
        <button type="button" className={`resume-viewer ${zoomed ? "zoomed" : ""}`} onClick={() => setZoomed((current) => !current)} aria-label="Toggle resume preview zoom">
          <span className="resume-badge"><FileText size={14} /> PDF preview</span>
          <img src={resumeImgUrl} alt="Hissane Omar Adam resume preview" loading="eager" />
        </button>

        <aside className="resume-sidebar">
          <article>
            <p className="label"><Sparkles size={14} /> ATS-ready</p>
            <h3>Clean structure</h3>
            <p>One-page layout with projects, skills, and experience optimized for recruiters.</p>
          </article>
          <article>
            <p className="label"><ShieldCheck size={14} /> Current version</p>
            <h3>Always updated</h3>
            <p>This preview mirrors the latest exported PDF stored in the portfolio.</p>
          </article>
          <article>
            <p className="label"><FileText size={14} /> Fast access</p>
            <h3>Instant actions</h3>
            <p>Open the PDF, zoom the preview, or download the document without leaving the page.</p>
          </article>
        </aside>
      </div>
    </div>
  );
}
