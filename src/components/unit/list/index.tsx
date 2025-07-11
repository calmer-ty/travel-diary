import { useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/hooks/useAuth";
import { useUserMarkers } from "@/hooks/useUserMarkers";

interface IBookmarkProps {
  id: number;
  title: string;
  date: string;
  content: string;
  // art: string;
  bookmark?: {
    bookmarkName: string;
    bookmarkColor: string;
  };
}
const titles = ["베트남 여행", "타이 여행"];

const bookmark: IBookmarkProps[] = [
  {
    id: 1,
    title: "베트남 여행",
    date: "7/10",
    content: "하노이 도착, 분짜 먹음",
  },
  {
    id: 2,
    title: "베트남 여행",
    date: "7/10",
    content: "하노이 도착, 분짜 먹음2",
  },
  {
    id: 3,
    title: "베트남 여행",
    date: "7/10",
    content: "하노이 도착, 분짜 먹음3",
  },
  {
    id: 4,
    title: "타이 여행",
    date: "7/11",
    content: "하롱베이 투어, 씨푸드 디너",
  },
  {
    id: 5,
    title: "타이 여행",
    date: "7/12",
    content: "쇼핑 후 귀국",
  },
  {
    id: 6,
    title: "베트남 여행",
    date: "7/10",
    content: "하노이 도착, 분짜 먹음3",
  },
  {
    id: 7,
    title: "베트남 여행",
    date: "7/10",
    content: "하노이 도착, 분짜 먹음3",
  },
];

export default function List() {
  const { user } = useAuth();
  // 마커 데이터 조회
  const { markers } = useUserMarkers({ uid: user?.uid });

  const [selected, setSelected] = useState(titles[0]);

  const filteredBookmarks = bookmark.filter((b) => selected === b.title);

  console.log("markers: ", markers);

  return (
    <article className="grid gap-4 p-8">
      {/* 상단 스크롤 여정 리스트 */}
      <ScrollArea className="w-full rounded-md bg-[#FAFAF2] shadow-md">
        <div className="flex w-max space-x-4 p-4">
          {titles.map((title) => (
            <Card key={title} onClick={() => setSelected(title)} className={`min-w-[100px] px-4 py-2 cursor-pointer text-center ${selected === title ? "border-blue-500 bg-blue-50" : ""}`}>
              <CardContent className="p-0">{title}</CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* 하단 상세: 날짜 + 내용 */}
      <div className="w-full p-8 bg-[#FAFAF2] shadow-md">
        {filteredBookmarks.map((bookmark) => (
          <Card key={bookmark.id} className=" mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
                <div className="text-sm text-muted-foreground font-medium">{bookmark.date}</div>
                <div className="text-base whitespace-pre-line">{bookmark.content}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </article>
  );
}
