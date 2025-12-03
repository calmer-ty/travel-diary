"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AIPopover } from "@/components/commons/AIPopover";

import { ITravelWaringItem } from "@/types";

import { CountryLabelColor } from "../maps/colorList";
import CountryModal from "./countryModal";

export default function Dashboard() {
  const [countryItems, setCountryItems] = useState<ITravelWaringItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<ITravelWaringItem | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [keyword, setKeyWord] = useState("");
  const router = useRouter();

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
          // console.log(data.items.item, "data.items.item");
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
  // console.log(countryItems, "countryItems");

  // 여행 주의 국가 모달 관련
  const openModal = (country: ITravelWaringItem) => {
    setSelectedCountry(country);
  };

  const closeModal = () => {
    setSelectedCountry(null);
  };

  const handleSearchKeyword = () => {
    if (!keyword) return;
    router.push(`/maps?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <article className="relative size-full p-5">
      <div className="relative flex flex-col size-full shadow-[3px_3px_15px_3px_rgba(0,0,0,0.25)] rounded-3xl md:flex-row">
        {/* 사진 영역 */}
        <section className="relative md:w-[60%] md:h-full bg-[#7E9EC0] rounded-3xl overflow-hidden w-full">
          <img className="w-full h-full block object-cover" src="./images/img_main02.jpg" alt="출처: unsplash" />

          <div className="absolute md:top-20 md:left-20 top-5 left-5">
            <p className=" text-white md:text-3xl text-xl">여행의 순간을 나만의 일기로 완성하세요.</p>
            <Link className="block w-fit bg-white rounded-2xl text-[#316192] p-8 py-3 mt-5 font-bold text-xs md:text-xl" href="./maps">
              시작하기
            </Link>
          </div>
        </section>

        {/* 오른쪽 영역 */}
        <section className="flex flex-col gap-3 md:gap-8 md:w-[40%] md:h-full p-5 w-full">
          <div>
            <p className="text-xl mb-3 font-semibold">여행 주의 국가</p>

            <div className="flex flex-wrap gap-2 mb-3">
              <button className="px-2 py-1 rounded-full text-sm bg-gray-200 text-gray-800" onClick={() => setSelectedLabel(null)}>
                전체
              </button>
              {CountryLabelColor.map((el) => (
                <button
                  key={el.label}
                  className={`px-2 py-1 rounded-full text-sm ${el.text} ${el.bg} ${selectedLabel === el.label ? "ring-2 ring-[#1D538A]" : ""}`}
                  onClick={() => setSelectedLabel(el.label)}
                >
                  {el.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto p-2">
              {loading ? (
                // 로딩 스켈레톤
                Array.from({ length: 7 }).map((_, idx) => <div key={idx} className="w-full rounded bg-gray-200 h-8 mb-2"></div>)
              ) : countryItems.length === 0 ? (
                // 데이터 없음
                <p className="text-gray-500">조회 가능한 데이터가 없습니다.</p>
              ) : (
                // 데이터 존재
                countryItems
                  .filter((el) => {
                    if (!selectedLabel) return true;
                    const labelMap: Record<string, string | undefined> = {
                      "여행 유의": el.attention_note,
                      "여행 자제": el.control_note,
                      "철수 권고": el.limita_note,
                      "여행 금지": el.ban_yna || el.ban_note,
                    };
                    return labelMap[selectedLabel] !== undefined && labelMap[selectedLabel] !== "";
                  })
                  .map((el, idx) => (
                    <button key={idx} onClick={() => openModal(el)} className="flex justify-between items-center p-2 rounded text-left hover:bg-[#7E9EC0] hover:text-white">
                      <p>{el.country_name}</p>
                      <p className="text-xs text-gray-500">더보기</p>
                    </button>
                  ))
              )}
            </div>
          </div>
          {/* 검색창 */}
          <div>
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
      {typeof window !== "undefined" && <CountryModal isOpen={!!selectedCountry} onClose={closeModal} country={selectedCountry} />}
    </article>
  );
}
