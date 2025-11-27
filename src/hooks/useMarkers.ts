import { useCallback, useEffect, useRef, useState } from "react";

import { addDoc, collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { db, firebaseApp } from "@/lib/firebase/firebaseApp";

import { useAuth } from "@/contexts/authContext";

import type { QueryDocumentSnapshot } from "firebase/firestore";
import type { ICreateMarkerParams, ILogPlace, IUpdateMarker } from "@/types";

export const useMarkers = () => {
  const { uid } = useAuth();

  const [markers, setMarkers] = useState<ILogPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ [등록]
  const createMarker = async ({ markerToSave }: ICreateMarkerParams) => {
    // Firestore에 문서 생성 (이 시점에서 ID 생성됨)
    const travelData = collection(db, "travelData");
    const docRef = await addDoc(travelData, {
      ...markerToSave,
    });

    // 문서 ID를 포함한 데이터로 업데이트
    await updateDoc(docRef, {
      _id: docRef.id,
    });

    // 3. docRef.id를 marker 객체에 넣어서 새로 구성
    const newMarker = {
      ...markerToSave,
      _id: docRef.id,
    };
    // 4. 기존 마커와 그 뒤에 새로운 마커의 데이터를 추가하여 지도에 렌더링 준비
    setMarkers((prev) => [...prev, newMarker]);
  };

  // ✅ [수정]
  const updateMarker = async ({ markerId, date, content, bookmark }: IUpdateMarker) => {
    const docRef = doc(db, "travelData", markerId);

    await updateDoc(docRef, {
      date,
      content,
      bookmark: {
        name: bookmark.name,
        color: bookmark.color,
      },
    });

    // 상태도 업데이트
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
    if (!uid) return;

    setIsLoading(true); // 로딩 시작

    const travelData = collection(db, "travelData");

    // 🔥 현재 로그인한 유저의 uid로 필터링
    const q = query(travelData, where("uid", "==", uid), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    const fetchedData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as ILogPlace[];

    setMarkers(fetchedData);

    setIsLoading(false); // 로딩 종료
  }, [uid]);

  // 무한스크롤
  const limitCount = 10;
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef<QueryDocumentSnapshot | null>(null);

  const fetchMoreMarkers = useCallback(async () => {
    if (!uid) return;

    setIsLoading(true); // 로딩 시작

    const db = getFirestore(firebaseApp);
    const travelData = collection(db, "travelData");

    // 🔥 현재 로그인한 유저의 uid로 필터링
    // 기본적으로 limitCount만 가져오기 (첫 페이지)
    let q = query(travelData, where("uid", "==", uid), orderBy("date", "desc"), limit(limitCount));
    if (lastDocRef.current) {
      // 이전에 가져온 마지막 문서(lastDoc) 이후부터 다음 limitCount만큼 가져오기 (다음 페이지)
      q = query(travelData, where("uid", "==", uid), orderBy("date", "desc"), startAfter(lastDocRef.current), limit(limitCount));
    }

    const snapshot = await getDocs(q);

    // snapshot.empty > 남아있는 Doc가 있을 경우
    if (!snapshot.empty) {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as ILogPlace[];

      setMarkers((prev) => [...prev, ...newData]); // 기존 마커에 새 데이터 추가
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];

      if (snapshot.docs.length < limitCount) {
        setHasMore(false); // 마지막 페이지일 때 더 이상 fetch 안 함
      }
    } else {
      setHasMore(false);
    }

    setIsLoading(false); // 로딩 종료
  }, [uid]);

  useEffect(() => {
    fetchMoreMarkers();
  }, [fetchMoreMarkers]);

  return {
    markers,
    createMarker,
    updateMarker,
    fetchMarkers,
    fetchMoreMarkers,
    isLoading,
    hasMore,
  };
};
