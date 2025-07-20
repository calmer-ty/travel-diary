// import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const mainItem = [
  {
    title: "나의 여행 기록",
    href: "/list",
  },
  {
    title: "친구와 게임 하기",
    href: "/game",
  },
  {
    title: "",
    href: "",
  },
];

export default function MainPage() {
  return (
    <div className="flex-col relative size-full flex items-center p-14 sm:flex-row gap-8">
      <motion.div
        // onClick={onClickMap}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, boxShadow: "8px 8px 0px #888888" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full h-full relative bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-3xl border border-gray-300 cursor-pointer sm:w-[54%]"
      >
        <Link href="/maps" className="block size-full pt-15 pl-7 break-keep sm:pl-10 pr-4">
          <div className="text-5xl">여행 일기</div>

          <div className="text-xl mt-8">
            <p>여행 장소를 지도에 남기고,</p>
            <p>당신만의 이야기를 기록해보세요!</p>
          </div>

          <img className="absolute bottom-6 right-6 w-[50%] lg:w-70" src="./images/img_diary.png" alt="" />
        </Link>
      </motion.div>
      <div className="w-full h-full flex justify-between items-center flex-col gap-8 size-full sm:w-[42%]">
        {mainItem.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.03, boxShadow: "8px 8px 0px #888888" }}
            className="w-full h-[33.3%] bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-3xl border border-gray-300 cursor-pointer"
          >
            <Link href={item.href} className="flex items-center justify-center size-full  text-xl ">
              {item.title}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
