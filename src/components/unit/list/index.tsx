import { useState } from "react";

import { useAuth } from "@/contexts/authContext";

import ListHeader from "./ListHeader";
import ListBody from "./LIstBody";

export default function List() {
  const { uid } = useAuth();

  // 북마크 셀렉터
  const [selectedBookmark, setSelectedBookmark] = useState("");

  return (
    <article className="flex flex-col gap-6 h-full">
      <ListHeader uid={uid} selectedBookmark={selectedBookmark} setSelectedBookmark={setSelectedBookmark} />
      <ListBody selectedBookmark={selectedBookmark} />
    </article>
  );
}
