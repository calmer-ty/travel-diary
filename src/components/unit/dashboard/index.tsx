import { motion } from "framer-motion";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";

import Link from "next/link";

import MotionAlert from "@/components/commons/MotionAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ITravelWaringItem } from "@/types";

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
  const [countryItems, setCountryItems] = useState<ITravelWaringItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/travelWarning");
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setCountryItems(data.items.item);
          setTotalCount(data.totalCount);
          console.log(data.items.item, "data.items.item");
        }
      } catch (err) {
        setError("데이터를 불러오는 중 오류 발생");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  console.log(countryItems, "countryItems");
  return (
    <article className="size-full p-5">
      <div className="relative flex size-full shadow-[3px_3px_15px_3px_rgba(0,0,0,0.25)] rounded-3xl ">
        {/* 사진 영역 */}
        <section className="relative w-[60%] h-full bg-[#7E9EC0] rounded-3xl overflow-hidden">
          <img className="w-full h-full block object-cover" src="./images/img_main02.jpg" alt="출처: unsplash" />

          <div className="absolute top-5 left-5">
            <p className=" text-white text-3xl ">여행의 순간을 나만의 일기로 완성하세요.</p>
            <Link className="block w-fit bg-white rounded-2xl text-[#316192] p-8 py-3 mt-5 font-bold" href="./maps">
              시작하기
            </Link>
          </div>
        </section>

        {/* 오른쪽 영역 */}
        <section className="flex flex-col gap-8 w-[40%] h-full p-5">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xl mb-3">여행 주의 국가</p>
              <Link className="text-gray-500 text-xs" href="">
                더보기
              </Link>
            </div>

            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
              {countryItems &&
                countryItems.map((el, idx) => (
                  <div key={idx} className="p-2 border-2  border-[#7E9EC0] rounded">
                    <p className="font-bold">{el.country_name}</p>
                  </div>
                ))}
            </div>
          </div>
          {/* 검색창 */}
          <div>
            <p className="text-xl mb-3 ">원하는 여행지를 검색해 보세요.</p>
            <div className="flex items-center gap-2">
              <Input className="bg-white" placeholder="검색" />
              <Button variant="search">검색</Button>
            </div>
          </div>
        </section>

        {/* 비행기 */}
        <img className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-35" src="./images/ico_airplane.png" alt="" />
      </div>
    </article>
  );
}
