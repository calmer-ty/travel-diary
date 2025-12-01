import { useMemo } from "react";

import { useMarkers } from "@/hooks/useMarkers";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { format } from "date-fns";

interface IListBodyProps {
  selectedBookmark: string;
}

export default function ListBody({ selectedBookmark }: IListBodyProps) {
  // 마커 데이터 조회
  const { markers, isLoading } = useMarkers();

  // 셀렉터 스테이트 값에 마커를 비교하여 필터링한 값
  const filteredMarkers = useMemo(() => {
    return markers.filter((b) => selectedBookmark === b.bookmark.name);
  }, [markers, selectedBookmark]);

  // 필터링한 값들의 날짜를 모두 뽑은 값
  const markersDate = useMemo(() => {
    return Array.from(new Set(filteredMarkers.map((marker) => format(marker.date, "yyyy-MM-dd"))));
  }, [filteredMarkers]);

  return (
    <div className="max-h-160 pt-24 px-8">
      {isLoading ? (
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
        </div>
      )}
    </div>
  );
}
