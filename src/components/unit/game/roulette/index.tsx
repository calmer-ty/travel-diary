import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useAlert } from "@/hooks/useAlert";
import AlertMaps from "../../maps/alert";

export default function Roulette() {
  const [rouletteItem, setRouletteItem] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const [colors, setColors] = useState<string[]>([]);

  const audioRef = useRef(null);

  const { showAlert, alertValue, triggerAlert } = useAlert();

  // 롤렛 돌리기
  const rouletteSpin = () => {
    if (isSpinning || rouletteItem.length === 0) {
      triggerAlert("롤렛 리스트를 입력하세요.");
      return;
    }

    if (isSpinning || rouletteItem.length === 1) {
      triggerAlert("롤렛 리스트를 2개 이상 입력하세요.");
      return;
    }

    const spins = 5;
    const degreesPerItem = 360 / rouletteItem.length;
    const randomIndex = Math.floor(Math.random() * rouletteItem.length);
    const finalAngle = 360 * spins + randomIndex * degreesPerItem + degreesPerItem / 2;

    const selected = rouletteItem[randomIndex];

    setAngle(finalAngle);
    setIsSpinning(true);
    setSelectedItem(selected); // 이건 UI 표시용

    if (audioRef.current) {
      (audioRef.current as HTMLAudioElement).loop = true;
      (audioRef.current as HTMLAudioElement).play();
    }

    setTimeout(() => {
      setIsSpinning(false);

      if (audioRef.current) {
        (audioRef.current as HTMLAudioElement).loop = false;
      }
    }, 3000);
  };

  // 롤렛 아이템 추가~
  const onChangeItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      triggerAlert("롤렛 리스트를 입력하세요.");
      return;
    }

    if (rouletteItem.includes(trimmed)) {
      triggerAlert("이미 있는 룰렛 리스트입니다.");
      return;
    }

    const newColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    setRouletteItem([...rouletteItem, trimmed]);
    setColors([...colors, newColor]);
    setInputValue("");
  };

  // 롤렛 아이템 삭제
  const handelDeleteItem = (itemToDelete: string) => {
    const index = rouletteItem.findIndex((item) => item === itemToDelete);

    const updatedItems = rouletteItem.filter((_, i) => i !== index);
    const updatedColors = colors.filter((_, i) => i !== index);

    setRouletteItem(updatedItems);
    setColors(updatedColors);
  };

  // 룰렛 랜덤 색상 지정
  const degreesPerItem = 360 / rouletteItem.length;

  let startDeg = 0;
  const gradientColors = colors
    ?.map((color) => {
      const endDeg = startDeg + degreesPerItem;
      const colorStop = `${color} ${startDeg}deg ${endDeg}deg`;
      startDeg = endDeg;
      return colorStop;
    })
    .join(", ");

  // 게임 리셋
  const onClickReset = () => {
    setIsSpinning(false);
    setRouletteItem([]);
    setInputValue("");
    setAngle(0);
    setColors([]);

    // 마지막에 selectedItem 초기화 (리렌더링 트리거 강하게 유도)
    setTimeout(() => {
      setSelectedItem("");
    }, 0);
  };

  return (
    <div className="flex flex-col items-center size-full gap-10  p-10">
      <div className="text-2xl">롤렛 돌리기</div>

      <div className="relative  ">
        {/* 게임 사운드 */}
        <audio ref={audioRef} src="/sound/effect_roulette.mp3" />

        {/* 화살표 */}
        <div className="absolute top-0 left-1/2 z-[1] transform -translate-x-1/2  w-18 h-25 bg-[url(/images/game/icon_arrow.png)] bg-contain bg-no-repeat"></div>

        {/* 룰렛 */}
        <div
          className={`
            w-[500px] h-[500px]  rounded-full border-[5px] rounded-full  ease-out transition-transform duration-[3000ms] border-[#CEDE89]
            ${!isSpinning && selectedItem ? "pointer-events-none" : "pointer-events-auto"}
            `}
          style={{
            transform: `rotate(${angle}deg)`,
            background: rouletteItem.length > 0 ? `conic-gradient(${gradientColors})` : "none",
          }}
        >
          {/* 게임 시작 버튼 */}
          <button
            className="absolute top-1/2 left-1/2 z-[1] transform -translate-x-1/2 -translate-y-1/2 w-30 h-20 bg-[url(/images/game/btn_start.png)] bg-contain bg-no-repeat"
            onClick={rouletteSpin}
            disabled={isSpinning}
          ></button>

          {rouletteItem.map((el, i) => {
            return (
              <div className="absolute top-1/2 left-1/2 w-1/2 h-6 origin-left transform  flex items-center justify-start text-[0px] " key={i}>
                {el}
              </div>
            );
          })}
        </div>

        {/* 룰렛 아이템 추가하기 */}
        <div
          className={`
            flex gap-5 mt-5
            ${!isSpinning && selectedItem ? "pointer-events-none" : "pointer-events-auto"}
            `}
        >
          <Input type="text" value={inputValue} onChange={onChangeItem} placeholder="입력하세요." />
          <Button variant="primary" onClick={handleAddItem}>
            입력
          </Button>
        </div>

        {/* 추가한 룰렛 아이템 보여주기 */}
        <div className="flex flex-wrap  mt-5 gap-3">
          {rouletteItem.map((el) => (
            <div className="relative flex justify-center items-center min-w-25 h-10 bg-[#D9D9D9] rounded-2xl p-2 pl-6 pr-6" key={el}>
              {el}
              <button
                onClick={() => handelDeleteItem(el)}
                className={`
                absolute top-1 right-1 w-5 h-5 bg-[url(/images/game/btn_close.png)] bg-contain bg-no-repeat
                ${!isSpinning && selectedItem ? "pointer-events-none" : "pointer-events-auto"}
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
            w-150 h-80 bg-white bg-[url(/images/game/bg_result.png)]
            bg-cover rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,0.3)] border text-4xl
            transition-all duration-500 ease-out
            ${!isSpinning && selectedItem ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}
        `}
      >
        <div className="text-center">
          <p>축하드립니다!</p>
          <p className="mt-2">
            <span className="text-[#E9897B]">{selectedItem}</span> 당첨입니다!
          </p>
        </div>

        <Button variant="primary" onClick={onClickReset} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 ">
          다시 하기
        </Button>
      </div>

      {/* 경고창 */}
      {showAlert && <AlertMaps alertValue={alertValue} />}
    </div>
  );
}
