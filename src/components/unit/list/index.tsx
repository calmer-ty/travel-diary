import { useEffect, useRef, useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/hooks/useAuth";
import { useUserMarkers } from "@/hooks/useUserMarkers";
import { useUserBookmarks } from "@/hooks/useUserBookmarks";

import { format } from "date-fns";

export default function List() {
  const { user } = useAuth();
  // 마커 데이터 조회
  const { markers, isLoading: isMarkersLoading, fetchMoreMarkers, hasMore } = useUserMarkers({ uid: user?.uid });
  const { bookmarks, isLoading: isBookmarkersLoading } = useUserBookmarks({ uid: user?.uid });

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

  // 스크롤 중

  const containerRef = useRef(null);
  const handleScroll = () => {
    const el = containerRef.current;
    console.log("el: ", el);
    if (!el) return;

    // 아래에서 100px 이내 도달하면 더 불러오기
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      if (!isMarkersLoading && hasMore) {
        fetchMoreMarkers();
      }
    }
  };

  return (
    <article className="grid gap-4 size-full p-8">
      {/* 상단 스크롤 여정 리스트 */}
      <ScrollArea className="" ref={containerRef} onScroll={handleScroll}>
        <div className="grid gap-6">
          <div className="flex gap-4 p-4 bg-[#FAFAF2] rounded-md shadow-md">
            {isBookmarkersLoading ? (
              // ✅ 로딩 중
              <div className="flex gap-5">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="w-22 h-10 rounded-md" />
                ))}
              </div>
            ) : (
              bookmarks.map(({ bookmarkName }) => (
                <Card
                  key={bookmarkName}
                  onClick={() => setSelected(bookmarkName)}
                  className={`min-w-10 px-4 py-2 cursor-pointer text-center ${selected === bookmarkName ? "border-blue-500 bg-blue-50" : ""}`}
                >
                  <CardContent className="p-0">{bookmarkName}</CardContent>
                </Card>
              ))
            )}
          </div>

          {/* 하단 상세: 날짜 + 내용 */}
          <div className="size-full p-8 bg-[#FAFAF2] shadow-md">
            {isMarkersLoading ? (
              // ✅ 로딩 중
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-8">
                    <Skeleton className="h-10 w-[5.5rem] rounded-md" /> {/* 날짜 박스 */}
                    <Skeleton className="h-26 w-2xl rounded-lg" /> {/* 카드 박스 */}
                  </div>
                ))}
              </div>
            ) : (
              markersDate.map((date, index) => (
                <div key={`${date}_${index}`} className="flex gap-8 mt-8 first:mt-0">
                  <div className="w-[5.5rem] mt-1 shrink-0">{date}</div>
                  {/* Card Wrap */}
                  <div className="w-full">
                    {filteredMarkers
                      .filter((marker) => format(marker.date, "yyyy-MM-dd") === date)
                      .map((marker) => (
                        <Card key={marker.name} className="mt-6 border-[#9A8C4B] first:mt-0">
                          <CardContent className="px-12">
                            <div className="flex gap-10 items-start">
                              <div className="grid gap-2 w-2xs">
                                <h3 className="text-base whitespace-pre-line">{marker.name}</h3>
                                <span className="text-sm text-muted-foreground font-medium">{marker.address}</span>
                              </div>
                              <p className="w-3xs">{marker.content}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </article>
  );
}
