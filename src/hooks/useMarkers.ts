import { useCallback, useEffect, useState } from "react";

import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import { useAuth } from "@/contexts/authContext";

import type { ICreateMarkerParams, ILogPlace, IUpdateMarker } from "@/types";

export const useMarkers = () => {
  const { user } = useAuth();

  const [markers, setMarkers] = useState<ILogPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ [등록]
  const createMarker = async ({ markerToSave }: ICreateMarkerParams) => {
    if (!user) {
      throw new Error("user 없음");
    }

    const travelData = collection(db, "travelData");

    // 1. 문서 생성 (ID 자동 생성)
    const docRef = await addDoc(travelData, { ...markerToSave });

    // 2. 생성된 ID를 문서에 추가
    await updateDoc(docRef, {
      _id: docRef.id,
    });

    return { _id: docRef.id };
  };

  // ✅ [수정]
  const updateMarker = async ({ markerId, date, content, bookmark }: IUpdateMarker) => {
    if (!user) return;

    const docRef = doc(db, "travelData", markerId);

    await updateDoc(docRef, {
      date,
      content,
      bookmark: {
        name: bookmark.name,
        color: bookmark.color,
      },
    });

    // 클라이언트 상태도 업데이트
    setMarkers((prev) =>
      prev.map((marker) =>
        marker._id === markerId
          ? {
              ...marker,
              date: date ?? marker.date,
              content,
              bookmark: {
                _id: bookmark._id,
                name: bookmark.name,
                color: bookmark.color,
              },
            }
          : marker
      )
    );
  };

  // ✅ [조회]
  const fetchMarkers = useCallback(async () => {
    if (!user) return;
    const uid = user.uid;

    setIsLoading(true);

    const travelData = collection(db, "travelData");

    // 현재 로그인한 유저의 데이터만 가져오기
    const q = query(travelData, where("uid", "==", uid), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    const fetchedData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as ILogPlace[];

    setMarkers(fetchedData);

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  return {
    markers,
    isLoading,
    setMarkers,
    createMarker,
    updateMarker,
    fetchMarkers,
  };
};
