import { useState } from "react";

import { useAlert } from "@/hooks/useAlert";
import { useAudio } from "@/hooks/useAudio";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import MotionAlert from "@/components/commons/MotionAlert";

export default function RouletteGame() {
  // 룰렛 아이템 (라벨 + 색상)
  const [items, setItems] = useState<{ label: string; color: string }[]>([]);
  const [inputValue, setInputValue] = useState("");

  // 룰렛 회전 관련
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // 당첨된 아이템
  const [selectedItem, setSelectedItem] = useState<null | { label: string; color: string }>(null);

  // hook 사용
  const { showAlert, alertValue, triggerAlert } = useAlert();
  const { audioRef, playLoop, audioStop } = useAudio();

  // 롤렛 돌리기
  const rouletteSpin = () => {
    if (isSpinning) return;
    if (items.length < 2) {
      triggerAlert("롤렛 리스트를 2개 이상 입력하세요.");
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

  const onChangeItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // 아이템 추가
  const handleAddItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      triggerAlert("롤렛 리스트를 입력하세요.");
      return;
    }

    if (items.some((item) => item.label === trimmed)) {
      triggerAlert("이미 있는 룰렛 리스트입니다.");
      return;
    }

    const newColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

    setItems([...items, { label: trimmed, color: newColor }]);
    setInputValue("");
  };

  // 아이템 삭제
  const handleDeleteItem = (label: string) => {
    setItems(items.filter((item) => item.label !== label));
  };

  // 룰렛 배경 색상 계산
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

  // 게임 리셋
  const onClickReset = () => {
    setIsSpinning(false);
    setItems([]);
    setInputValue("");
    setAngle(0);
    setTimeout(() => setSelectedItem(null), 0);
  };

  const isDisabled = isSpinning || !!selectedItem;

  return (
    <div style={{ backgroundImage: "url('/images/img_bg.jpg')" }} className=" size-full gap-10 p-10 bg-cover bg-bottom bg-no-repeat ">
      <h2 className="text-2xl text-center">롤렛 돌리기</h2>

      <div className="relative overflow-hidden">
        {/* 게임 사운드 */}
        <audio ref={audioRef} src="/sound/effect_roulette.mp3" />

        {/* 화살표 */}
        <div className="absolute top-0 left-1/2 z-[1] transform -translate-x-1/2 w-18 h-25 bg-[url(/images/game/icon_arrow.png)] bg-contain bg-no-repeat max-[510px]:w-12"></div>

        {/* 룰렛 */}
        <div
          className={`
            w-[500px] h-[500px] rounded-full border-[5px] ease-out transition-transform duration-[3000ms] border-[#CEDE89] mx-auto 
            max-[510px]:w-[400px] max-[510px]:h-[400px]
            max-[410px]:w-[350px] max-[410px]:h-[350px]
            ${isDisabled ? "pointer-events-none" : "pointer-events-auto"}
          `}
          style={{
            transform: `rotate(${angle}deg)`,
            background: items.length > 0 ? `conic-gradient(${gradientColors})` : "#ffffff",
          }}
        >
          {/* 게임 시작 버튼 */}
          <button
            className="absolute top-1/2 left-1/2 z-[1] transform -translate-x-1/2 -translate-y-1/2 w-30 h-20 bg-[url(/images/game/btn_start.png)] bg-contain bg-no-repeat max-[510px]:w-25"
            onClick={rouletteSpin}
            disabled={isSpinning}
          ></button>
        </div>

        {/* 아이템 입력 */}
        <div
          className={`
            flex justify-center gap-3 mt-5 p-1 max-w-[550px] mx-auto
            ${isDisabled ? "pointer-events-none" : "pointer-events-auto"}
          `}
        >
          <Input type="text " className="bg-[#ffffff] " value={inputValue} onChange={onChangeItem} placeholder="입력하세요." />
          <Button className={isSpinning ? "pointer-events-none" : "pointer-events-auto"} variant="input" onClick={handleAddItem}>
            입력
          </Button>
        </div>

        {/* 추가한 아이템 보여주기 */}
        <div className="flex flex-wrap mt-3 gap-3 max-w-[550px] mx-auto">
          {items.map((item) => (
            <div className="relative flex justify-center items-center min-w-25 h-10 bg-[#D9D9D9] rounded-lg p-2 pl-6 pr-6" key={item.label}>
              {item.label}
              <button
                onClick={() => handleDeleteItem(item.label)}
                className={`
                  absolute top-1 right-1 w-5 h-5 bg-[url(/images/game/btn_close.png)] bg-contain bg-no-repeat
                  ${isDisabled ? "pointer-events-none" : "pointer-events-auto"}
                `}
              ></button>
            </div>
          ))}
        </div>
      </div>

      {/* 결과 모달 */}
      <div
        className={`
          absolute top-1/2 left-1/2 z-[10]
          flex items-center justify-center
          transform -translate-x-1/2 -translate-y-1/2
          w-[90%] h-80 bg-white bg-[url(/images/game/bg_result.png)]
          bg-cover rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,0.3)] border text-4xl
          transition-all duration-500 ease-out
          ${!isSpinning && selectedItem ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}
        `}
      >
        <div className="text-center word-keep">
          <p>축하드립니다!</p>
          <p className="mt-2">
            <span className="text-[#E9897B]">{selectedItem?.label}</span> 당첨입니다!
          </p>
        </div>

        <Button variant="input" onClick={onClickReset} className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
          다시 하기
        </Button>
      </div>

      {/* 경고창 */}
      {showAlert && <MotionAlert alertValue={alertValue} />}
      <footer className="opacity-0">배경 이미지 출처: freepik</footer>
    </div>
  );
}
