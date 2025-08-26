import { GameList } from "./gameList";
import Link from "next/link";

export default function Game() {
  return (
    <div className="size-full  p-10">
      <div className="text-2xl">게임을 통해 친구와 내기를 해보세요!</div>

      <div className="flex flex-wrap justify-center gap-3 w-full mt-8 pb-20 lg:mb-0">
        {GameList.map((el, index) => (
          <Link
            href={`/game/${el.src}`}
            key={index}
            className={`
                    w-1/3  h-40 rounded-2xl transition-colors duration-200 group
                    ${el.available === true ? "bg-[#FAFAF2] hover:bg-[rgba(0,0,0,0.1)]" : "bg-[rgba(0,0,0,0.1)]"}
                    ${el.available === true ? "pointer-events-auto" : "pointer-events-none"}
                    md:w-1/5
                `}
          >
            <button className="relative w-full h-full">
              <img
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-15 group-hover:opacity-20 transition-opacity duration-200"
                src={`./images/game/icon_${el.src}.png`}
                alt=""
              />

              {el.available === true ? (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xl keepall">
                  {el.name}
                </span>
              ) : (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-xl keepall">{el.name}</span>
              )}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
