import { useRef } from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return { audioRef };
}
