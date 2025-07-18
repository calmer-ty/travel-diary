import { useCallback, useEffect, useState } from "react";

import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase/firebaseApp";

import { IUserID } from "@/types";
import { useAlert } from "./useAlert";

export const useUserBookmarks = ({ uid }: IUserID) => {
  const [bookmarks, setBookmarks] = useState<{ _id: string; name: string; color: string }[]>([]);

  const { triggerAlert } = useAlert();

  const fetchBookmarks = useCallback(async () => {
    try {
      if (!uid) {
        triggerAlert("로그인이 필요합니다. 먼저 로그인해주세요!");
        return;
      }

      const db = getFirestore(firebaseApp);
      const bookmarkData = collection(db, "bookmarkData");

      // 🔥 현재 로그인한 유저의 uid로 필터링
      const q = query(bookmarkData, where("uid", "==", uid));
      const snapshot = await getDocs(q);

      const fetchedData = snapshot.docs.map((doc) => ({
        _id: doc.id,
        name: doc.data().name,
        color: doc.data().color,
      }));

      setBookmarks(fetchedData);
    } catch (error) {
      console.error("Firebase 북마크 불러오기 실패:", error);
    }
  }, [uid, triggerAlert]);

  // if (showDialog) {
  //   fetchBookmarks();
  // }

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    setBookmarks,
    fetchBookmarks,
  };
};
