import { motion } from "framer-motion";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";

import Link from "next/link";

import MotionAlert from "@/components/commons/MotionAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const mainItem = [
  {
    title: "나의 여행 기록",
    href: "/list",
    imgUrl: "img_folder",
    loginCheck: true,
    alt: "폴더",
  },
  {
    title: "친구와 내기 하기",
    href: "/game",
    imgUrl: "img_game",
    loginCheck: false,
    alt: "게임기",
  },
];

export default function Dashboard() {
  const { uid } = useAuth();
  const { showAlert, alertValue, triggerAlert } = useAlert();
  const [travelData, setTravelData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/travelWarning")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.response?.body?.items) {
          setTravelData(data.response.body.items);
        }
      })
      .catch((err) => console.error("API 호출 오류", err));
  }, []);

  return (
    <div className="size-full p-5">
      <div className="relative flex size-full shadow-[3px_3px_15px_3px_rgba(0,0,0,0.25)] rounded-3xl ">
        {/* 사진 영역 */}
        <section className="relative w-[60%] h-full bg-[#7E9EC0] rounded-3xl overflow-hidden">
          <p className="absolute top-5 left-5 text-white text-3xl ">여행의 순간을 나만의 일기로 완성하세요.</p>
          <img className="w-full h-full block object-cover" src="./images/img_main02.jpg" alt="출처: unsplash" />
        </section>

        {/* 오른쪽 영역 */}
        <section className="flex flex-col gap-8 w-[40%] h-full p-5">
          <div>
            <p className="text-xl">당신을 위한 추천 여행지!</p>
          </div>
          {/* 검색창 */}
          <div>
            <p className="text-xl ">원하는 여행지를 검색해 보세요.</p>
            <div className="flex items-center gap-2">
              <Input className="bg-white" placeholder="검색" />
              <Button variant="search">검색</Button>
            </div>
          </div>
        </section>

        {/* 비행기 */}
        <img className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-35" src="./images/ico_airplane.png" alt="" />
      </div>
    </div>
  );
}
