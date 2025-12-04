"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MotionAlert from "@/components/commons/MotionAlert";

// 👉 기능 훅 import (네 기존 코드 그대로 사용)
import { useAlert } from "@/hooks/useAlert";
import { useAudio } from "@/hooks/useAudio";

export default function RouletteGame() {
  /* -------------------------------
      기능 로직 (네 코드 그대로 삽입)
  -------------------------------- */

  const [items, setItems] = useState<{ label: string; color: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<null | { label: string; color: string }>(null);

  const { showAlert, alertValue, triggerAlert } = useAlert();
  const { audioRef, playLoop, audioStop } = useAudio();

  const rouletteSpin = () => {
    if (isSpinning) return;
    if (items.length < 2) {
      triggerAlert("룰렛 리스트를 2개 이상 입력하세요.");
      return;
    }

    const spins = 5;
    const degreesPerItem = 360 / items.length;
    const randomIndex = Math.floor(Math.random() * items.length);
    const finalAngle = 360 * spins + randomIndex * degreesPerItem + degreesPerItem / 2;

    const selected = items[randomIndex];

    setAngle(finalAngle);
    setIsSpinning(true);
    setSelectedItem(selected);

    playLoop();

    setTimeout(() => {
      setIsSpinning(false);
      audioStop();
    }, 3000);
  };

  const handleAddItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      triggerAlert("롤렛 리스트를 입력하세요.");
      return;
    }
    if (items.some((item) => item.label === trimmed)) {
      triggerAlert("이미 있는 리스트입니다.");
      return;
    }

    const newColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

    setItems([...items, { label: trimmed, color: newColor }]);
    setInputValue("");
  };

  const handleDeleteItem = (label: string) => {
    setItems(items.filter((item) => item.label !== label));
  };

  const degreesPerItem = 360 / items.length;
  let startDeg = 0;
  const gradientColors = items
    .map((item) => {
      const endDeg = startDeg + degreesPerItem;
      const colorStop = `${item.color} ${startDeg}deg ${endDeg}deg`;
      startDeg = endDeg;
      return colorStop;
    })
    .join(", ");

  const onClickReset = () => {
    setIsSpinning(false);
    setItems([]);
    setInputValue("");
    setAngle(0);
    setTimeout(() => setSelectedItem(null), 0);
  };

  const onChangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const isDisabled = isSpinning || !!selectedItem;

  return (
    <div className="h-full flex flex-col items-center p-6 bg-blue-50">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">룰렛 돌리기</h2>
        <p className="text-neutral-600 mt-1">아이템을 입력하고 행운을 시험해보세요!</p>
      </div>

      {/* 룰렛 섹션 */}
      <section className="w-full flex flex-col items-center mb-10">
        {/* 화살표 */}
        <div className="relative w-fit">
          <div
            className="
              absolute top-0 left-1/2 -translate-x-1/2 z-10
              w-16 h-20 sm:w-20 sm:h-28 bg-[url('/images/game/icon_arrow.png')] 
              bg-no-repeat bg-contain
            "
          ></div>

          {/* 룰렛 */}
          <div
            className={`
              rounded-full border-[6px] border-[#CEDE89]
              transition-transform ease-out duration-[3000ms]
              mx-auto
              w-[350px] h-[350px]
              sm:w-[400px] sm:h-[400px]
              md:w-[500px] md:h-[500px]
              lg:w-[550px] lg:h-[550px]
              ${isDisabled ? "pointer-events-none" : "pointer-events-auto"}
            `}
            style={{
              transform: `rotate(${angle}deg)`,
              background: items.length ? `conic-gradient(${gradientColors})` : "#fff",
            }}
          >
            {/* Start Button */}
            <button
              onClick={rouletteSpin}
              disabled={isSpinning}
              className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-28 h-20 bg-[url('/images/game/btn_start.png')] bg-contain bg-no-repeat
                hover:scale-105 transition-transform
              "
            ></button>
          </div>

          {/* Sound */}
          <audio ref={audioRef} src="/sound/effect_roulette.mp3" />
        </div>
      </section>

      {/* 입력 + 리스트 카드 */}
      <section className="w-full max-w-[550px] ">
        {/* 입력 영역 */}
        <div className="flex gap-2 mb-4">
          <Input value={inputValue} onChange={onChangeItem} placeholder="룰렛 아이템 입력" className="bg-white" />
          <Button variant="input" onClick={handleAddItem} disabled={isDisabled}>
            추가
          </Button>
        </div>

        {/* 리스트 */}
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div key={item.label} className="relative flex items-center gap-2 px-5 py-2 bg-gray-200 rounded-lg">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}

              <button onClick={() => handleDeleteItem(item.label)} className="absolute top-1 right-1 w-4 h-4 bg-[url('/images/game/btn_close.png')] bg-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* 결과 모달 */}
      <div
        className={`
          fixed inset-0 flex justify-center items-center z-50
          backdrop-blur-sm transition-all duration-500
          ${!isSpinning && selectedItem ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
        `}
      >
        <div
          className="
            relative w-[90%] max-w-[400px] h-50 bg-white p-8 rounded-2xl
            bg-[url('/images/game/bg_result.png')] bg-cover bg-center
            text-center text-3xl shadow-lg
          "
        >
          <p>축하드립니다!</p>
          <p className="mt-3">
            <span className="text-[#E9897B] font-bold">{selectedItem?.label}</span> 당첨!
          </p>

          <Button variant="input" onClick={onClickReset} className="absolute bottom-6 left-1/2 -translate-x-1/2">
            다시 하기
          </Button>
        </div>
      </div>

      {/* 알림 */}
      {showAlert && <MotionAlert alertValue={alertValue} />}
      {/* 
      <footer className="opacity-0">이미지 출처: freepik</footer> */}
    </div>
  );
}
