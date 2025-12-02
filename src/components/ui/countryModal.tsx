"use client";
import { FC, useEffect } from "react";
import { X } from "lucide-react";
import type { ITravelWaringItem } from "@/types";
import { Button } from "./button";
import { CountryLabelColor } from "../unit/maps/colorList";

interface ICountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: ITravelWaringItem | null;
}

const CountryModal: FC<ICountryModalProps> = ({ isOpen, onClose, country }) => {
  if (!isOpen || !country) return null;

  // ESC 키 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const alertNotes = [
    country.attention_note,
    country.control_note,
    country.limita_note,
    country.ban_yna || country.ban_note,
  ];

  const alerts = CountryLabelColor.map((el, idx) => ({
    label: el.label,
    note: alertNotes[idx],
    textColor: el.text,
    bg: el.bg,
  })).filter((a) => a.note);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={25} />
        </button>

        {/* 타이틀 */}
        <div className="flex items-center gap-3 mb-4">
          <img className="w-16 h-10 object-cover rounded shadow-[1px_1px_8px_1px_rgba(0,0,0,0.25)]" src={country.img_url} alt={country.country_name} />
          <h3 className="text-xl font-bold "><span className="text-[#1D538A]">{country.country_name}</span> 여행 경보</h3>
        </div>

        <p className="text-gray-600 mb-4">{country.country_en_name} | {country.continent}</p>
        {country.wrt_dt && <p className="text-gray-500 mb-4 text-sm">등록일: {country.wrt_dt}</p>}

        {/* 경보 섹션 */}
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className={`flex-shrink-0 px-2 py-1 rounded-full text-sm  ${alert.textColor} ${alert.bg}`}>{alert.label}</span>
              <p className="text-gray-700">{alert.note}</p>
            </div>
          ))}
        </div>

        {/* 확인 버튼 */}
        <div className="mt-6 text-center">
          <Button variant="input" onClick={onClose}>확인</Button>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
