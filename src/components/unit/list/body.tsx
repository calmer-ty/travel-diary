import { useMemo } from "react";

import { useUserMarkers } from "@/hooks/useUserMarkers";

import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { format } from "date-fns";

interface IListBodyProps {
  uid: string | undefined;
  selectedBookmark: string;
}

export default function ListBody({ uid, selectedBookmark }: IListBodyProps) {
  // 마커 데이터 조회
  const { markers, isLoading: isMarkersLoading, fetchMoreMarkers, hasMore } = useUserMarkers({ uid });

  // 셀렉터 스테이트 값에 마커를 비교하여 필터링한 값
  // const filteredMarkers = markers.filter((b) => selected === b.bookmark.name);
  const filteredMarkers = useMemo(() => {
    return markers.filter((b) => selectedBookmark === b.bookmark.name);
  }, [markers, selectedBookmark]);
  console.log("filteredMarkers: ", filteredMarkers);
  // 필터링한 값들의 날짜를 모두 뽑은 값
  const markersDate = useMemo(() => {
    return Array.from(new Set(filteredMarkers.map((marker) => format(marker.date, "yyyy-MM-dd"))));
  }, [filteredMarkers]);

  return (
    <div className="max-h-160 pt-24 px-8">
      {isMarkersLoading ? (
        // 로딩중
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-49 w-full rounded-lg" />
          ))}
        </div>
      ) : markersDate.length === 0 ? (
        // 기록이 없을 때
        <div className="size-full">기록이 없습니다.</div>
      ) : (
        // 리스트
        <div id="scroll-container" className="h-full rounded-md">
          <InfiniteScroll
            dataLength={filteredMarkers.length} // 현재 데이터 개수
            next={fetchMoreMarkers} // 더 불러올 함수
            hasMore={hasMore} // 더 데이터 있는지 여부
            loader={<h4>Loading...</h4>} // 로딩 표시
            // endMessage={<p>모두 불러왔어요!</p>} // 끝 메시지
            // scrollableTarget="scroll-container" // 따로 요소를 스크롤 타겟 지정시
          >
            {markersDate.map((date) => (
              <div
                key={`${date}`}
                className="flex gap-x-8 gap-y-4 px-8 py-5 bg-[#FAFAF2] border border-[#9A8C4B] rounded-md
                  mt-8 first:mt-0 last:mb-8
                  flex-col sm:flex-row"
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
  );
}
