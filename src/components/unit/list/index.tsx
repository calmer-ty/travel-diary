import { useEffect, useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/hooks/useAuth";
import { useUserMarkers } from "@/hooks/useUserMarkers";
import { useUserBookmarks } from "@/hooks/useUserBookmarks";

import { format } from "date-fns";

export default function List() {
  const { user } = useAuth();
  // 마커 데이터 조회
  const { markers } = useUserMarkers({ uid: user?.uid });
  const { bookmarks } = useUserBookmarks({ uid: user?.uid });

  // 북마크 셀렉터
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (bookmarks.length > 0) {
      setSelected(bookmarks[0].bookmarkName);
    }
  }, [bookmarks]);

  // 셀렉터 스테이트 값에 마커를 비교하여 필터링한 값
  const filteredMarkers = markers.filter((b) => selected === b.bookmark.bookmarkName);

  // 필터링한 값들의 날짜를 모두 뽑은 값
  const markersDate = Array.from(new Set(filteredMarkers.map((marker) => format(marker.date, "yyyy-MM-dd"))));

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
        {markersDate.map((date, index) => (
          <div key={`${date}_${index}`} className="flex gap-8">
            <div className="w-[5.5rem] mt-1 shrink-0">{date}</div>
            <div className="w-full">
              {filteredMarkers
                .filter((marker) => format(marker.date, "yyyy-MM-dd") === date)
                .map((marker) => (
                  <Card key={marker.name} className=" mb-6 border-[#9A8C4B]">
                    <CardContent className="px-12 py-6">
                      <div className="flex gap-10 items-start">
                        {/* <div className="text-sm text-muted-foreground font-medium">{format(marker.date, "yyyy-MM-dd")}</div> */}
                        <div className="grid gap-2 w-2xs">
                          <h3 className="text-base whitespace-pre-line">{marker.name}</h3>
                          <span className="text-sm text-muted-foreground font-medium">{marker.address}</span>
                        </div>
                        <p>{marker.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
