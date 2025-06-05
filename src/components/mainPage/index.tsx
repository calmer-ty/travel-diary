import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function MainPage() {
  const router = useRouter();

  const onClickMap = () => {
    router.push("./maps");
  };

  return (
    <div className="relative size-full overflow-hidden">
      <div className="relative size-full flex justify-between items-center p-14">
        <motion.div
          onClick={onClickMap}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, boxShadow: "8px 8px 0px #888888" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-[54%] h-full relative bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-3xl border border-gray-300 pt-20 pl-14 cursor-pointer"
        >
          <div className="text-5xl">여기는 쌸라쌸라</div>

          <div className="text-xl mt-8">
            <p>당신의 쏼라쏼라</p>
            <p>기록해봐 쏼랴쏼랴</p>
          </div>

          <img className="absolute bottom-6 right-6 w-70" src="./images/img_diary.png" alt="" />
        </motion.div>
        <div className="w-[42%] h-full flex justify-between items-center flex-col size-full">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.03, boxShadow: "8px 8px 0px #888888" }}
              className="w-full h-50 bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-3xl border border-gray-300 cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
