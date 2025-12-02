import Link from "next/link";
import { GameList } from "./gameList";

export default function Game() {
  return (
    <article className="size-full p-10">
      <div className="text-2xl break-keep">게임을 통해 친구와 내기를 해보세요!</div>

      <div className="flex flex-wrap justify-center gap-4 w-full mt-12 pb-10 lg:mb-0 sm:mt-30">
        {GameList.map((el, idx) => (
          <Link
            href={`/game/${el.src}`}
            key={`${el.name}_${idx}`}
            className={`
                relative w-[calc(50%-0.5rem)] h-40 rounded-2xl transition-colors duration-200 group
                ${el.available ? "bg-[#FAFAF2] hover:bg-[rgba(0,0,0,0.1)]" : "bg-[rgba(0,0,0,0.1)]"}
                ${el.available ? "pointer-events-auto" : "pointer-events-none"}
                md:w-[calc(25%-1rem)]
            `}
          >
            {el.available && (
              <img
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-15
                group-hover:opacity-20 transition-opacity duration-200"
                src={`./images/game/icon_${el.src}.png`}
                alt={el.src ? "출처: figma" : ""}
              />
            )}
            {el.available ? (
              <span
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-200 text-xl text-center break-keep"
              >
                {el.name}
              </span>
            ) : (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl text-center break-keep">{el.name}</span>
            )}
          </Link>
        ))}
      </div>
    </article>
  );
}
