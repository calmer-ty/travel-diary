"use client";
import Link from "next/link";
import { motion } from "framer-motion";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";

import AlertMaps from "@/components/unit/maps/alert";

const mainItem = [
  {
    title: "나의 여행 기록",
    href: "/list",
    img: "img_folder",
    loginCheck: true,
  },
  {
    title: "친구와 게임 하기",
    href: "/game",
    img: "img_game",
    loginCheck: false,
  },
];

export default function Dashboard() {
  const { uid } = useAuth();
  const { showAlert, alertValue, triggerAlert } = useAlert();

  return (
    <div className="flex-col relative size-full flex items-center p-14 sm:flex-row gap-8 pb-25 lg:pb-14">
      <motion.div
        // onClick={onClickMap}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, boxShadow: "8px 8px 0px #888888" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full h-full relative bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-3xl border border-gray-300 cursor-pointer sm:w-[54%]"
      >
        <Link href="/maps" className="block size-full pt-15 pl-7  break-keep sm:pl-10 pr-4">
          <div className="text-5xl">여행 일기</div>

          <div className="text-xl mt-8 sm:mt-5">
            <p>여행 장소를 지도에 남기고,</p>
            <p>당신만의 이야기를 기록해보세요!</p>
          </div>

          <img className="absolute bottom-6 right-6 hidden w-[50%] lg:w-70 sm:block" src="./images/img_map.png" alt="" />
        </Link>
      </motion.div>
      <div className="size-full flex justify-between items-center flex-col gap-8 size-full sm:w-[42%] ">
        {mainItem.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.03, boxShadow: "8px 8px 0px #888888" }}
            className="relative w-full h-[50%] bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-3xl border border-gray-300 cursor-pointer sm:pt-10 sm:pl-8 sm:pr-8 pt-0 pl-0 pr-0"
          >
            <Link
              onClick={(e) => {
                if (item.loginCheck && !uid) {
                  e.preventDefault(); // 링크 이동 막기
                  triggerAlert("로그인이 필요한 페이지 입니다.");
                }
              }}
              href={item.href}
              className=" size-full  text-3xl flex justify-center items-center sm:block"
            >
              {item.title}
            </Link>

            <img className="hidden absolute bottom-6 right-6 h-[50%] lg:h-40 sm:block" src={`./images/${item.img}.png`} alt="" />
          </motion.div>
        ))}
      </div>

      {showAlert && <AlertMaps alertValue={alertValue} />}
    </div>
  );
}
