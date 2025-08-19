import { useEffect, useMemo, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/hooks/useAuth";
import { useUserMarkers } from "@/hooks/useUserMarkers";
import { useUserBookmarks } from "@/hooks/useUserBookmarks";

import { format } from "date-fns";

import InfiniteScroll from "react-infinite-scroll-component";

export default function List() {
  const { user } = useAuth();
  // 마커 데이터 조회
  const { markers, isLoading: isMarkersLoading, fetchMoreMarkers, hasMore } = useUserMarkers({ uid: user?.uid });
  const { bookmarks, isLoading: isBookmarkersLoading } = useUserBookmarks({ uid: user?.uid });

  // 북마크 셀렉터
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (bookmarks.length > 0) {
      setSelected(bookmarks[0].name);
    }
  }, [bookmarks]);

  // 셀렉터 스테이트 값에 마커를 비교하여 필터링한 값
  const filteredMarkers = useMemo(() => {
    return markers.filter((b) => selected === b.bookmark.name);
  }, [markers, selected]);

  // 필터링한 값들의 날짜를 모두 뽑은 값
  const markersDate = useMemo(() => {
    return Array.from(new Set(filteredMarkers.map((marker) => format(marker.date, "yyyy-MM-dd"))));
  }, [filteredMarkers]);

  return (
    <article className="flex flex-col gap-6 h-full p-8">
      {/* 북마크 선택지 */}
      <div className="flex gap-4 mx-6">
        {isBookmarkersLoading ? (
          // 로딩 중
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
      <div className="max-h-160">
        {isMarkersLoading ? (
          // 로딩중
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-42 w-full rounded-lg" />
            ))}
          </div>
        ) : markersDate.length === 0 ? (
          // 기록이 없을 때
          <div className="size-full ">기록이 없습니다.</div>
        ) : (
          // 리스트
          <div id="scroll-container" className="overflow-auto h-full rounded-md">
            <InfiniteScroll
              dataLength={filteredMarkers.length} // 현재 데이터 개수
              next={fetchMoreMarkers} // 더 불러올 함수
              hasMore={hasMore} // 더 데이터 있는지 여부
              loader={<h4>Loading...</h4>} // 로딩 표시
              // endMessage={<p>모두 불러왔어요!</p>} // 끝 메시지
              scrollableTarget="scroll-container" // 이게 포인트!
            >
              {markersDate.map((date) => (
                <div
                  key={`${date}`}
                  className="flex gap-x-8 gap-y-4 px-8 py-5 bg-[#FAFAF2] border border-none rounded-md shadow-[6px_6px_0px_#AAAAAA] mr-2 mb-10
                  
                  flex-col sm:flex-row
                  "
                >
                  <div className="w-23 mt-1 shrink-0">{date}</div>

                  <div className="w-full">
                    {filteredMarkers
                      .filter((marker) => format(marker.date, "yyyy-MM-dd") === date)
                      .map((marker) => (
                        <Card key={`${marker._id}`} className="mt-6 py-5 first:mt-0">
                          <CardContent className="px-8 sm:px-12">
                            <div className="flex flex-col gap-3 items-start">
                              <div>
                                <h3 className="text-base whitespace-pre-line">{marker.name}</h3>
                                <span className="text-xs text-muted-foreground font-medium">{marker.address}</span>
                              </div>
                              <p>{marker.content}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
        )}
      </div>
    </article>
  );
}
