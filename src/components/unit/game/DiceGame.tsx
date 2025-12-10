import { useState } from "react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { useAudio } from "@/hooks/useAudio";

export default function DiceGame() {
  const { audioRef, playLoop, audioStop } = useAudio();

  const [rolling, setRolling] = useState(false);
  const [end, setEnd] = useState(false);

  const randomIndex = Math.floor(Math.random() * 6) + 1;

  const onClickDice = () => {
    setEnd(false);
    setRolling(true);
    // 소리 재생
    playLoop();

    setTimeout(() => {
      audioStop();
      setRolling(false);
      setEnd(true);
    }, 3000);
  };

  return (
    <div className="relative flex flex-col items-center size-full gap-10 p-10 bg-blue-50 dark:bg-blue-900/20">
      <div className="text-center mb-3">
        <h2 className="text-2xl ">주사위 굴리기</h2>
        <p className="text-muted-foreground mt-2">더 높은 숫자를 뽑아 행운을 가져가보세요!</p>
      </div>

      <div className="relative flex justify-center  w-full overflow-hidden">
        <div className="relative  text-center  w-full ">
          <img className={`h-110 ${rolling || end ? "hidden" : "block"}  mx-auto`} src="/images/game/btn_start_dice.png" alt="주사위 출처: figma" />

          {/* 게임 사운드 */}
          <audio ref={audioRef} src="/sound/effect_dice.mp3" />

          {/* 주사위 굴러 가는 중 */}
          {rolling && <div className="h-103 w-full leading-100 bg-[rgba(0,0,0,0.5)]  text-white ">주사위 굴러가는 중...</div>}

          {/* 주사위 완료 */}
          {end && (
            <motion.div
              className="h-103 flex flex-col justify-center items-center gap-5 w-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <img className="h-90 object-contain" src={`/images/game/icon_dice0${randomIndex}.png`} alt="" />
              <div className="text-2xl">{randomIndex}</div>
            </motion.div>
          )}

          {/* 시작 버튼 */}
          <Button onClick={onClickDice} className="mt-10 bg-[#E97C50] text-white shadow-[inset_-2px_-2px_0px_#F3642A] hover:shadow-[inset_2px_2px_0px_#F3642A] hover:bg-[#E97C50]">
            굴리기
          </Button>
        </div>
      </div>

      {/* <footer className="opacity-0">배경 이미지 출처: freepik</footer> */}
    </div>
  );
}
