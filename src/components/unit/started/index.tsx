import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const waveText = [
  { text: "T" },
  { text: "r" },
  { text: "a" },
  { text: "v" },
  { text: "e" },
  { text: "l" },
  { text: " " },
  { text: "D" },
  { text: "i" },
  { text: "a" },
  { text: "r" },
  { text: "y" },
  { img: "/images/icon_airplane.png", alt: "plane icon" },
];
const moveImages = ["./images/img_map.png", "./images/img_folder.png", "./images/img_game.png"];

export default function StartedUI() {
  const router = useRouter();

  const onClickMoveToHome = () => {
    router.push("/dashboard");
  };

  return (
    <article
      style={{ backgroundImage: "url('/images/img_bg.jpg')" }}
      className="relative p-10 overflow-x-hidden bg-cover bg-bottom bg-no-repeat
        md:pl-25 md:pr-25 md:p-15"
    >
      <h2 className="flex gap-1">
        {waveText.map((el, idx) => (
          <motion.span
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [20, -10, 0], opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: idx * 0.1, // 글자마다 순차적으로 딜레이
              ease: "easeInOut",
            }}
            className="inline-block text-4xl md:text-7xl text-[#1D538A]"
            style={{ textShadow: el.text ? "0px 2px 2px rgba(0,0,0,0.35)" : "none" }}
          >
            {el.text ? el.text : el.img ? <img src={el.img} alt={el.alt || ""} className="inline-block align-middle h-12 md:h-14 max-w-fit" /> : null}
          </motion.span>
        ))}
      </h2>

      <motion.div
        className="flex flex-col justify-between items-start break-keep mt-18"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: waveText.length * 0.1 + 0.4, // h2 애니메이션 끝난 뒤 약간의 추가 딜레이
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        {/* text 영역 */}
        <div className="text-4xl ">당신의 여행 기록을 쉽고 재미있게 기록하기!</div>

        <div className="text-2xl mt-5 leading-relaxed">
          <p>당신의 여행을 기록해 보세요!</p>
          <p>지도에 찍고, 사진과 일기로 남기는 나만의 여행 기록!</p>
          <p>나의 여행을 한눈에 확인하기!</p>
          <p>재미있는 게임을 통해 친구들과 함께 내기하기!</p>
        </div>

        {/* img 영역*/}
        <div className="flex items-center justify-end gap-5 w-full my-10">
          {moveImages.map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt="출처: figma Icons8"
              className={i === 0 ? "h-23 lg:h-40 md:h-35 sm:h-25" : "h-25 lg:h-55 md:h-47 sm:h-30"}
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 2 + i * 0.3, // 이미지마다 약간 다른 속도
                repeat: Infinity, // 무한 반복
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="mx-auto">
          <Button
            variant="default"
            className="bg-[#E9897B] shadow-[inset_-2px_-2px_0px_#F3642A] 
              hover:shadow-[inset_2px_2px_0px_#F3642A] hover:bg-[#E9897B]"
            onClick={onClickMoveToHome}
          >
            지금 시작하기
          </Button>
        </div>
      </motion.div>

      <footer className="opacity-0">배경 이미지 출처: freepik</footer>
    </article>
  );
}
