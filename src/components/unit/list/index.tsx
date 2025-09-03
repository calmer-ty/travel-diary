import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import ListHeader from "./header";
import ListBody from "./body";

export default function List() {
  const { uid } = useAuth();

  // 북마크 셀렉터
  const [selectedBookmark, setSelectedBookmark] = useState("");

  return (
    <article className="flex flex-col gap-6 h-full">
      <ListHeader uid={uid} selectedBookmark={selectedBookmark} setSelectedBookmark={setSelectedBookmark} />
      <ListBody uid={uid} selectedBookmark={selectedBookmark} />
    </article>
  );
}
