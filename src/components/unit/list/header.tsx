import { useEffect } from "react";

import { useUserBookmarks } from "@/hooks/useUserBookmarks";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface IListHeaderProps {
  uid: string | undefined;
  selectedBookmark: string;
  setSelectedBookmark: React.Dispatch<React.SetStateAction<string>>;
}
export default function ListHeader({ uid, selectedBookmark, setSelectedBookmark }: IListHeaderProps) {
  // 마커 데이터 조회
  const { bookmarks, isLoading: isBookmarkersLoading } = useUserBookmarks({ uid });

  useEffect(() => {
    if (bookmarks.length > 0) {
      setSelectedBookmark(bookmarks[0].name);
    }
  }, [bookmarks, setSelectedBookmark]);

  return (
    <div className="fixed flex gap-4 w-full px-8 py-4 bg-white border-b">
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
            onClick={() => setSelectedBookmark(bookmark.name)}
            className={`min-w-10 px-4 py-2 cursor-pointer text-center ${selectedBookmark === bookmark.name ? "border-blue-500 bg-blue-50" : ""}`}
          >
            <CardContent className="p-0">{bookmark.name}</CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
