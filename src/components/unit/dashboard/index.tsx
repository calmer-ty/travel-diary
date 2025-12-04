import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AIPopover } from "@/components/commons/AIPopover";

import CountryDialog from "./countryDialog";
import TravelWarning from "./travelWarning";

import type { ITravelWaringItem } from "@/types";

export default function Dashboard() {
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState<ITravelWaringItem | null>(null);
  const [keyword, setKeyWord] = useState("");

  // 여행 주의 국가 모달 관련
  const openDialog = (country: ITravelWaringItem) => {
    setSelectedCountry(country);
  };
  const closeDialog = () => {
    setSelectedCountry(null);
  };
  const handleSearchKeyword = () => {
    if (!keyword) return;
    router.push(`/maps?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <article className="relative w-full h-full p-5">
      <div className="relative flex flex-col w-full h-full shadow-[3px_3px_15px_3px_rgba(0,0,0,0.25)] rounded-3xl md:flex-row">
        {/* 사진 영역 */}
        <section className="relative md:w-[60%] bg-[#7E9EC0] rounded-3xl overflow-hidden w-full min-h-45">
          <img className="absolute top-0 left-0 w-full h-full block object-cover" src="./images/img_main02.jpg" alt="출처: unsplash" />

          <div className="relative z-10 py-8 px-8 md:py-20 md:px-14">
            <p className=" text-white md:text-3xl text-xl">여행의 순간을 나만의 일기로 완성하세요.</p>
            <Link className="block w-fit bg-white rounded-2xl text-[#316192] p-8 py-3 mt-5 font-bold text-xs md:text-xl" href="./maps">
              시작하기
            </Link>
          </div>
        </section>

        {/* 오른쪽 영역 */}
        <section className="flex flex-col gap-3 md:gap-8 md:w-[40%] p-5 w-full">
          {/* 여행 유의 컴포넌트 */}
          <TravelWarning openDialog={openDialog} />
          {/* 검색창 */}
          <div className="p-4 rounded-md">
            <p className="text-xl mb-3 font-semibold">원하는 여행지를 검색해 보세요.</p>
            <div className="flex items-center gap-2 mr-10 md:mr-0">
              <Input onChange={(e) => setKeyWord(e.target.value)} className="bg-white" placeholder="검색" />
              <Button onClick={handleSearchKeyword} variant="search">
                검색
              </Button>
            </div>
          </div>
        </section>

        {/* 비행기 */}
        <img className="absolute bottom-[8%] left-[60%] -translate-x-1/2 w-20 hidden md:block md:w-30" src="./images/icon_airplane.png" alt="" />
      </div>

      <AIPopover />
      {selectedCountry && <CountryDialog country={selectedCountry} closeDialog={closeDialog} />}
    </article>
  );
}
