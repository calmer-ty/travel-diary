import { useCallback, useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

import { useAuth } from "@/contexts/authContext";

import type { IBookmark } from "@/types";

export const useBookmarks = () => {
  const { uid } = useAuth();
  const [bookmarks, setBookmarks] = useState<{ _id: string; name: string; color: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ [등록]
  const createBookmark = async (newBookmark: { name: string; color: string }) => {
    // 저장할 마커 정보 준비
    const bookmarkToSave: IBookmark = {
      _id: "",
      name: newBookmark.name,
      color: newBookmark.color,
    };
    const bookmarkData = collection(db, "bookmarkData");

    // Firestore에 저장
    const docRef = await addDoc(bookmarkData, {
      uid,
      ...bookmarkToSave,
    });
    await updateDoc(docRef, { _id: docRef.id });

    // ⭐ 저장된 최종 북마크 객체 리턴
    return {
      _id: docRef.id,
      name: newBookmark.name,
      color: newBookmark.color,
    };
  };

  // ✅ [삭제]
  const deleteBookmark = async (_id: string) => {
    const docRef = collection(db, "bookmarkData");

    await deleteDoc(doc(docRef, _id));
  };

  // ✅ [조회]
  const fetchBookmarks = useCallback(async () => {
    try {
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
  }, [uid]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    setBookmarks,
    createBookmark,
    deleteBookmark,
    fetchBookmarks,
    isLoading,
  };
};
