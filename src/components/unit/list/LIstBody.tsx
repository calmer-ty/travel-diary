import { useState } from "react";
import { format } from "date-fns";

import { useMarkers } from "@/hooks/useMarkers";
import { useBookmarks } from "@/hooks/useBookmarks";

// import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown, Clock, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IListBodyProps {
  uid: string | undefined;
}

export default function ListBody({ uid }: IListBodyProps) {
  // 마커 데이터 조회
  const { markers, isLoading } = useMarkers({ uid });
  const { bookmarks } = useBookmarks({ uid });

  // 개별 open 상태
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});
  const onClickToggle = (id: string) => {
    setIsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative max-h-160 h-full">
      <h2 className="mb-6">나의 여행 기록들을 확인해보세요</h2>
      {isLoading ? (
        // 로딩중
        <Loader size={30} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        // 리스트
        <div id="scroll-container" className="h-full rounded-md space-y-4">
          {bookmarks.map((b) => {
            const relatedMarkers = markers.filter((m) => m.bookmark.name === b.name); // 현재 bookmark 에 속하는 markers만 추출
            if (relatedMarkers.length === 0) return null; // 0개면 렌더하지 않음

            const dates = relatedMarkers.map((m) => m.date);
            const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
            const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

            return (
              <Collapsible
                key={b._id}
                open={isOpen[b._id]}
                onOpenChange={() => {
                  onClickToggle(b._id);
                }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border shadow-sm transition-colors bg-muted/40 hover:bg-muted/60">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <h4 className="text-sm font-semibold tracking-wide">{b.name}</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">{relatedMarkers.length}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-primary py-0.5 rounded-md">
                      <Clock className="w-3 h-3" />
                      {format(earliest, "yyyy-MM-dd")}
                      <span className="mx-1">–</span> {/* 날짜 범위 구분 아이콘 */}
                      {format(latest, "yyyy-MM-dd")}
                    </span>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <ChevronsUpDown />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="flex flex-col gap-3 px-2 pt-2">
                  {markers
                    .filter((m) => m.bookmark.name === b.name)
                    .map((m) => (
                      <Card key={m._id} className="border border-border/60 rounded-xl shadow-sm transition-colors bg-muted/30 hover:bg-muted/50">
                        <CardContent className="flex gap-4 px-6">
                          <div className="text-sm leading-relaxed">{format(m.date, "yyyy-MM-dd")}</div>
                          <div>
                            <h3 className="text-sm font-semibold whitespace-pre-line">{m.name}</h3>
                            <span className="text-xs text-muted-foreground font-medium block mt-1">{m.address}</span>
                            <p className="text-sm mt-2 leading-relaxed">{m.content}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}
