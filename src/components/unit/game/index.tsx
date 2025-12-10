import Link from "next/link";
import { GameList } from "./gameList";

export default function Game() {
  return (
    <article className="size-full p-10 bg-blue-50 dark:bg-blue-900/20">
      <div className="text-2xl break-keep">게임을 통해 친구와 내기를 해보세요!</div>

      <div
        className="grid gap-4 mt-12 pb-10
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5"
      >
        {GameList.map((el, idx) => (
          <Link
            href={`/game/${el.src}`}
            key={`${el.name}_${idx}`}
            className="relative h-40 rounded-2xl bg-[#FAFAF2] shadow-[1px_1px_16px_1px_rgba(0,0,0,0.2)]
                 group transition-colors duration-200"
          >
            <img
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-15 
                   group-hover:opacity-20 transition-opacity duration-200"
              src={`./images/game/icon_${el.src}.png`}
              alt={el.src ? "출처: figma" : ""}
            />
            <span
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      text-xl text-center break-keep opacity-0 
                      group-hover:opacity-100 transition-opacity duration-200"
            >
              {el.name}
            </span>
          </Link>
        ))}
      </div>
    </article>
  );
}
