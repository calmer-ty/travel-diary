import { useRef } from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 반복 재생
  const playLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play();
    }
  };

  // 멈추기
  const audioStop = () => {
    if (audioRef.current) {
      audioRef.current.loop = false;
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // 처음으로
    }
  };

  return { audioRef, playLoop, audioStop };
}
