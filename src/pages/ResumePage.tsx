import { Download } from "lucide-react";
import { resumeImgUrl } from "../data/resume";
import { resumePdfUrl } from "../data/resume";
import { useI18n } from "../i18n/I18nProvider";

export default function ResumePage({ onDownload }: { onDownload: () => void }) {
  const { t } = useI18n();
  return (
    <div className="resume-app">
      <div className="resume-viewer">
        <img
          
          src={resumeImgUrl}
          loading="eager"
        />
      </div>
      <button className="download-button" onClick={onDownload}>
        <Download size={17} />
        {t("resume.download")}
      </button>
    </div>
  );
}
