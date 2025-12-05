import { useCallback, useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";

import { useAuth } from "@/contexts/authContext";
import { useAlert } from "./useAlert";

export const useBookmarks = () => {
  const { uid } = useAuth();
  const [bookmarks, setBookmarks] = useState<{ _id: string; name: string; color: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { triggerAlert } = useAlert();

  // ✅ [등록]
  const deleteBookmark = async (_id: string) => {
    const docRef = collection(db, "bookmarkData");

    await deleteDoc(doc(docRef, _id));

    // 상태에서 삭제
    setBookmarks((prev) => prev.filter((bm) => bm._id !== _id));
  };

  // ✅ [조회]
  const fetchBookmarks = useCallback(async () => {
    try {
      if (!uid) {
        triggerAlert("로그인이 필요합니다. 먼저 로그인해주세요!");
        return;
      }

      setIsLoading(true);

      const bookmarkData = collection(db, "bookmarkData");

      const q = query(bookmarkData, where("uid", "==", uid));
      const snapshot = await getDocs(q);

      const fetchedData = snapshot.docs.map((doc) => ({
        _id: doc.id,
        name: doc.data().name,
        color: doc.data().color,
      }));

      setBookmarks(fetchedData);

      setIsLoading(false);
    } catch (error) {
      console.error("Firebase 북마크 불러오기 실패:", error);
    }
  }, [uid, triggerAlert]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    setBookmarks,
    deleteBookmark,
    fetchBookmarks,
    isLoading,
  };
};
