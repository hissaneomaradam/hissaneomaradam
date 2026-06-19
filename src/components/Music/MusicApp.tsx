import { ExternalLink, Music } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

const playlistUrl = "https://open.spotify.com/playlist/5JwoZ2rS5LOyVMoLS26pB8";
const embedUrl = "https://open.spotify.com/embed/playlist/5JwoZ2rS5LOyVMoLS26pB8?utm_source=generator&theme=0";

export function MusicApp() {
  const { language } = useI18n();
  return (
    <div className="music-app">
      <section className="music-hero">
        <div className="music-disc" aria-hidden="true">
          <Music size={30} />
        </div>
        <div>
          <p className="label">Playlist.app</p>
          <h2>{language === "fr" ? "Radio session code" : "Code Session Radio"}</h2>
          <p>{language === "fr" ? "Écoutez ma playlist pendant l'exploration du Portfolio OS." : "Listen to my playlist while exploring the portfolio OS."}</p>
        </div>
        <a className="music-link" href={playlistUrl} target="_blank" rel="noreferrer">
          {language === "fr" ? "Ouvrir Spotify" : "Open Spotify"} <ExternalLink size={14} />
        </a>
      </section>


      <div className="spotify-frame">
        <iframe
          title="Omar Adam Spotify playlist"
          src={embedUrl}
          width="100%"
          height="352"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
}
