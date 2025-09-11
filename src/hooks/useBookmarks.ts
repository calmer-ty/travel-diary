import { useCallback, useEffect, useState } from "react";

import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import { useAlert } from "./useAlert";

import type { IBookmark, INewBookmark, IUserID } from "@/types";
interface ICreateBookmarkParams {
  bookmarkToSave: IBookmark;
  newBookmark: INewBookmark;
}

export const useBookmarks = ({ uid }: IUserID) => {
  const [bookmarks, setBookmarks] = useState<{ _id: string; name: string; color: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { triggerAlert } = useAlert();

  // ✅ [등록]
  const createBookmark = async ({ bookmarkToSave, newBookmark }: ICreateBookmarkParams) => {
    const bookMarkData = collection(db, "bookmarkData");

    // Firestore에 저장
    const docRef = await addDoc(bookMarkData, {
      uid,
      ...bookmarkToSave,
    });
    await updateDoc(docRef, { _id: docRef.id });

    const newBookmarkToSave = {
      _id: docRef.id,
      name: newBookmark.name,
      color: newBookmark.color,
    };

    // 상태 업데이트
    setBookmarks((prev) => [...prev, newBookmarkToSave]);
  };

  // ✅ [조회]
  const fetchBookmarks = useCallback(async () => {
    try {
      if (!uid) {
        triggerAlert("로그인이 필요합니다. 먼저 로그인해주세요!");
        return;
      }

      setIsLoading(true); // 로딩 시작

      const bookmarkData = collection(db, "bookmarkData");

      // 현재 로그인한 유저의 uid로 필터링
      const q = query(bookmarkData, where("uid", "==", uid));
      const snapshot = await getDocs(q);

      const fetchedData = snapshot.docs.map((doc) => ({
        _id: doc.id,
        name: doc.data().name,
        color: doc.data().color,
      }));

      setBookmarks(fetchedData);

      setIsLoading(false); // 로딩 종료
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
    createBookmark,
    fetchBookmarks,
    isLoading,
  };
};
