import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Slider } from "./slider";

export default function StartedUI() {
  const router = useRouter();

  const waveText = [
    { text: "T", color: "#E9897B" },
    { text: "r", color: "#EDE3CA" },
    { text: "a", color: "#EDE3CA" },
    { text: "v", color: "#EDE3CA" },
    { text: "e", color: "#EDE3CA" },
    { text: "l", color: "#EDE3CA" },
    { text: " ", color: "#EDE3CA" },
    { text: "D", color: "#DFB489" },
    { text: "i", color: "#EDE3CA" },
    { text: "a", color: "#EDE3CA" },
    { text: "r", color: "#EDE3CA" },
    { text: "y", color: "#EDE3CA" },
  ];

  const moveImages = ["./images/img_map.png", "./images/img_folder.png", "./images/img_game.png"];

  const onClickMoveToHome = () => {
    router.push("/dashboard");
  };

  return (
    <section className="relative w-screen h-screen  p-10 overflow-x-hidden box-border">
      <div className="flex gap-1">
        {waveText.map((el, i) => (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [20, -10, 0], opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: i * 0.1, // 글자마다 순차적으로 딜레이
              ease: "easeInOut",
            }}
            className="inline-block  text-6xl"
            style={{ color: el.color, textShadow: "0px 2px 2px rgba(0,0,0,0.35)" }}
          >
            {el.text}
          </motion.span>
        ))}
      </div>

      <div className="relative w-full flex flex-col items-start justify-center gap-2 mt-15 sm:flex-row">
        {/* text 영역 */}
        <div className=" text-center sm:w-[47%] w-full break-keep">
          <div className="text-4xl text-left">당신의 여행 기록을 쉽고 재미있게 기록하기!</div>

          <div className="text-2xl mt-5 mb-10 text-left">
            <p>당신의 여행을 기록해 보세요!</p>
            <p>지도에 찍고, 사진과 일기로 남기는 나만의 여행 기록.</p>
            <p>나의 여행을 한눈에 확인하기!</p>
            <p>재미있는 게임을 통해 친구들과 함께 내기하기!</p>
          </div>

          {/* img 영역*/}
          <div className="flex items-center justify-between gap-2 w-full mb-5">
            {moveImages.map((src, i) => (
              <motion.img
                key={i}
                src={src}
                alt=""
                className={`w-[${i === 2 ? "26" : "27"}%]`}
                animate={{ y: [0, -20, 0] }} // 위로 15px 떠오르고 다시 내려오는 애니메이션
                transition={{
                  duration: 2 + i * 0.3, // 이미지마다 약간 다른 속도
                  repeat: Infinity, // 무한 반복
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <Button variant="default" className="bg-[#E9897B] shadow-[inset_-2px_-2px_0px_#F3642A] hover:shadow-[inset_2px_2px_0px_#F3642A] hover:bg-[#E9897B]" onClick={onClickMoveToHome}>
            지금 시작하기
          </Button>
        </div>

        {/* 슬라이드 영역 */}
        <div className="flex items-center justify-center sm:w-[47%] sm:mb-[0] w-full sm:h-140 h-80 mb-10 bg-[#E3F3FE] shadow-[inset_-5px_-5px_0px_#6DC2FF] rounded-2xl">
          <div className="w-[90%] h-[90%]">
            <Slider />
          </div>
        </div>
      </div>
    </section>
  );
}
