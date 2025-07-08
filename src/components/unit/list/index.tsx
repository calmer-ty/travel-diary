import { useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/hooks/useAuth";
import { useUserMarker } from "@/hooks/useUserMarkers";

interface IBookmarkProps {
  id: number;
  title: string;
  date: string;
  content: string;
  // art: string;
}

const bookmark: IBookmarkProps[] = [
  {
    id: 1,
    title: "Day 1",
    date: "7/10",
    content: "하노이 도착, 분짜 먹음",
  },
  {
    id: 2,
    title: "Day 2",
    date: "7/11",
    content: "하롱베이 투어, 씨푸드 디너",
  },
  {
    id: 3,
    title: "Day 3",
    date: "7/12",
    content: "쇼핑 후 귀국",
  },
];

export default function List() {
  const { user } = useAuth();
  // 마커 데이터 조회
  const { markers } = useUserMarker(user?.uid);
  console.log("markers: ", markers);

  const [selected, setSelected] = useState(bookmark[0]);

  return (
    <article className="grid gap-4 p-8">
      {/* 상단 스크롤 여정 리스트 */}
      <ScrollArea className="w-full rounded-md border whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">
          {bookmark.map((item) => (
            // <figure key={el.artist} className="shrink-0">
            //   <div className="overflow-hidden rounded-md">
            //     <Image src={el.art} alt={`Photo by ${el.artist}`} className="aspect-[3/4] h-fit w-fit object-cover" width={300} height={400} />
            //   </div>
            //   <figcaption className="text-muted-foreground pt-2 text-xs">
            //     Photo by <span className="text-foreground font-semibold">{el.artist}</span>
            //   </figcaption>
            // </figure>
            <Card key={item.id} onClick={() => setSelected(item)} className={`min-w-[100px] px-4 py-2 cursor-pointer text-center ${selected.id === item.id ? "border-blue-500 bg-blue-50" : ""}`}>
              <CardContent className="p-0">{item.title}</CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* 하단 상세: 날짜 + 내용 */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
            <div className="text-sm text-muted-foreground font-medium">{selected.date}</div>
            <div className="text-base whitespace-pre-line">{selected.content}</div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
