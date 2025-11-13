import { motion } from "framer-motion";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";

import Link from "next/link";

import MotionAlert from "@/components/commons/MotionAlert";

const mainItem = [
  {
    title: "나의 여행 기록",
    href: "/list",
    imgUrl: "img_folder",
    loginCheck: true,
    alt: "폴더",
  },
  {
    title: "친구와 게임 하기",
    href: "/game",
    imgUrl: "img_game",
    loginCheck: false,
    alt: "게임기",
  },
];

export default function Dashboard() {
  const { uid } = useAuth();
  const { showAlert, alertValue, triggerAlert } = useAlert();

  return (
    <div className="flex-col gap-8 relative size-full h-full p-14 pb-24 flex items-center p-0 sm:flex-row">
      <motion.div
        // onClick={onClickMap}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, boxShadow: "8px 8px 0px #888888" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full h-full relative bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-3xl border border-gray-300 cursor-pointer sm:w-[54%]"
      >
        <Link href="/maps" className="flex flex-col justify-center size-full p-6 break-keep sm:block sm:pt-15 sm:pl-10 sm:pr-4">
          <div className="text-5xl text-center sm:text-left">여행 일기</div>

          <div className="flex flex-col mt-6 text-xl text-center sm:text-left">
            <span>여행 장소를 지도에 남기고,</span>
            <span>당신만의 이야기를 기록해보세요!</span>
          </div>

          <img className="absolute bottom-6 right-6 hidden w-[50%] sm:block lg:w-70" src="./images/img_map.png" alt="지도, 출처: figma" />
        </Link>
      </motion.div>
      <div className="size-full flex justify-between items-center flex-col gap-8 size-full sm:w-[42%] ">
        {mainItem.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.03, boxShadow: "8px 8px 0px #888888" }}
            className="relative w-full h-[50%] bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-3xl border border-gray-300 cursor-pointer sm:pt-10 sm:pl-8"
          >
            <Link
              onClick={(e) => {
                if (item.loginCheck && !uid) {
                  e.preventDefault(); // 링크 이동 막기
                  triggerAlert("로그인이 필요한 페이지 입니다.");
                }
              }}
              href={item.href}
              className=" size-full text-3xl flex justify-center items-center sm:block"
            >
              {item.title}
            </Link>

            <img className="hidden absolute bottom-6 right-6 h-[50%] sm:block lg:h-40" src={`./images/${item.imgUrl}.png`} alt={`${item.alt}, 출처: figma`} />
          </motion.div>
        ))}
      </div>

      {showAlert && <MotionAlert alertValue={alertValue} />}
    </div>
  );
}
