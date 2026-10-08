import { useEffect, useState } from "react";

// Plays a notification chime; `playing` drives the speaker icon.
export function useSound(src: string) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const audio = new Audio(src);
    audio.addEventListener("ended", () => setPlaying(false));
    void audio.play();
    return () => {
      audio.pause();
    };
  }, [src, playing]);

  return { playing, play: () => setPlaying(true) };
}
