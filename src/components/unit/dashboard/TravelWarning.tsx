import { useState } from "react";

import { useTravelWarning } from "@/hooks/useTravelWarning";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { CountryLabelColor } from "../maps/colorList";

import type { ITravelWaringItem } from "@/types";
interface ITravelWarningProps {
  openDialog: (country: ITravelWaringItem) => void;
}

export default function TravelWarning({ openDialog }: ITravelWarningProps) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const { countryItems, loading } = useTravelWarning();

  return (
    <article>
      <p className="text-xl mb-3 font-semibold">여행 주의 국가</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <button className="px-2 py-1 rounded-full text-sm bg-gray-200 text-gray-800 bg-[#aab2c5]" onClick={() => setSelectedLabel(null)}>
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

      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto p-2">
        {loading
          ? // 로딩 스켈레톤
            Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="w-full h-8 mb-2" />)
          : // 데이터 존재
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
                <Button variant="outline" key={idx} onClick={() => openDialog(el)} className="flex justify-between items-center">
                  {/*  hover:bg-[#7E9EC0] hover:text-white */}
                  <span>{el.country_name}</span>
                  <ChevronRight />
                </Button>
              ))}
      </div>
    </article>
  );
}
