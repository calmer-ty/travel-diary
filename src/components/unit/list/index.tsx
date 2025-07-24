import { useEffect, useState } from "react";

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
  const { markers, isLoading: isMarkersLoading } = useUserMarkers({ uid: user?.uid });
  const { bookmarks, isLoading: isBookmarkersLoading } = useUserBookmarks({ uid: user?.uid });

  // 북마크 셀렉터
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (bookmarks.length > 0) {
      setSelected(bookmarks[0].name);
    }
  }, [bookmarks]);

  // 셀렉터 스테이트 값에 마커를 비교하여 필터링한 값
  const filteredMarkers = markers.filter((b) => selected === b.bookmark.name);

  // 필터링한 값들의 날짜를 모두 뽑은 값
  const markersDate = Array.from(new Set(filteredMarkers.map((marker) => format(marker.date, "yyyy-MM-dd"))));
  console.log("filteredMarkers: ", filteredMarkers.length);
  console.log("markersDate: ", markersDate.length);

  // 스크롤 중
  // const loaderRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (!loaderRef.current || !hasMore) return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && !isMarkersLoading) {
  //         fetchMoreMarkers();
  //       }
  //     },
  //     { threshold: 1.0 } // 100% 노출 시 실행
  //   );

  //   observer.observe(loaderRef.current);

  //   return () => observer.disconnect();
  // }, [isMarkersLoading, hasMore, fetchMoreMarkers]);

  return (
    <article className="grid gap-4 p-6">
      {/* 북마크 선택지 */}
      <div className="flex gap-4 mx-6">
        {isBookmarkersLoading ? (
          // ✅ 로딩 중
          <div className="flex gap-5">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="w-19 h-10 rounded-md" />
            ))}
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <Card
              key={bookmark.name}
              onClick={() => setSelected(bookmark.name)}
              className={`min-w-10 px-4 py-2 cursor-pointer text-center ${selected === bookmark.name ? "border-blue-500 bg-blue-50" : ""}`}
            >
              <CardContent className="p-0">{bookmark.name}</CardContent>
            </Card>
          ))
        )}
      </div>
      {/* 하단 상세: 날짜 + 내용 */}
      <ScrollArea className="h-140 p-6 bg-[#FAFAF2] rounded-md">
        {/* ✅ 로딩중 */}
        {isMarkersLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-8">
                <Skeleton className="h-10 w-[5.5rem] rounded-md" />
                <Skeleton className="h-26 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : markersDate.length === 0 ? (
          <div className="size-full">기록이 없습니다.</div>
        ) : (
          markersDate.map((date, index) => (
            <div key={`${date}_${index}`} className="flex gap-8 mt-8 first:mt-0">
              <div className="w-23 mt-1 shrink-0">{date}</div>

              <div className="w-full">
                {filteredMarkers.length === 0 ? (
                  <>
                    <div>없</div>
                    <div>없</div>
                    <div>없</div>
                    <div>없</div>
                  </>
                ) : (
                  filteredMarkers
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
                    ))
                )}
              </div>
            </div>
          ))
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </article>
  );
}
