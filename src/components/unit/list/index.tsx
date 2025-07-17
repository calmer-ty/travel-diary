import { useEffect, useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/hooks/useAuth";
import { useUserMarkers } from "@/hooks/useUserMarkers";
import { useUserBookmarks } from "@/hooks/useUserBookmarks";

export default function List() {
  const { user } = useAuth();
  // 마커 데이터 조회
  const { markers } = useUserMarkers({ uid: user?.uid });
  const { bookmarks } = useUserBookmarks({ uid: user?.uid });

  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (bookmarks.length > 0) {
      setSelected(bookmarks[0].bookmarkName);
    }
  }, [bookmarks]);

  const filteredBookmarks = markers.filter((b) => selected === b.bookmark.bookmarkName);

  return (
    <article className="grid gap-4 p-8">
      {/* 상단 스크롤 여정 리스트 */}
      <ScrollArea className="w-full rounded-md bg-[#FAFAF2] shadow-md">
        <div className="flex w-max space-x-4 p-4">
          {bookmarks.map(({ bookmarkName }) => (
            <Card
              key={bookmarkName}
              onClick={() => setSelected(bookmarkName)}
              className={`min-w-[100px] px-4 py-2 cursor-pointer text-center ${selected === bookmarkName ? "border-blue-500 bg-blue-50" : ""}`}
            >
              <CardContent className="p-0">{bookmarkName}</CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* 하단 상세: 날짜 + 내용 */}
      <div className="w-full p-8 bg-[#FAFAF2] shadow-md">
        {filteredBookmarks.map((bookmark) => (
          <Card key={bookmark.name} className=" mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
                <div className="text-sm text-muted-foreground font-medium">{bookmark.date.toISOString()}</div>
                <div className="text-base whitespace-pre-line">{bookmark.content}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </article>
  );
}
