import { useEffect, useState } from "react";

export function useTypingRotator(phrases: string[]) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const complete = visible === phrase;
    const empty = visible.length === 0;
    const delay = complete && !deleting ? 1250 : deleting ? 34 : 58;

    const timer = window.setTimeout(() => {
      if (complete && !deleting) {
        setDeleting(true);
        return;
      }
      if (deleting && empty) {
        setDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
        return;
      }
      setVisible((current) => (deleting ? current.slice(0, -1) : phrase.slice(0, current.length + 1)));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, phraseIndex, phrases, visible]);

  return visible;
}
