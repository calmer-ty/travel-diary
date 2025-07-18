import { useCallback, useEffect, useState } from "react";

import { addDoc, collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase/firebaseApp";

import { ILogPlace, IUserID } from "@/types";

export const useUserMarkers = ({ uid }: IUserID) => {
  const [markers, setMarkers] = useState<ILogPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 무한스크롤
  const limitCount = 10;
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // ✅ [등록]
  const createMarker = async (markerData: ILogPlace) => {
    // Firestore에 문서 생성 (이 시점에서 ID 생성됨)
    const travelData = collection(getFirestore(firebaseApp), "travelData");
    const docRef = await addDoc(travelData, {
      ...markerData,
    });

    // 문서 ID를 포함한 데이터로 업데이트
    await updateDoc(docRef, {
      _id: docRef.id,
    });

    // 3. docRef.id를 marker 객체에 넣어서 새로 구성
    const newMarker = {
      ...markerData,
      _id: docRef.id,
    };
    // 4. 기존 마커와 그 뒤에 새로운 마커의 데이터를 추가하여 지도에 렌더링 준비
    setMarkers((prev) => [...prev, newMarker]);
  };

  // ✅ [수정]
  const updateMarker = async ({ markerId, date, content }: { markerId: string; date: Date | undefined; content: string }) => {
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, "travelData", markerId);

    await updateDoc(docRef, {
      date,
      content,
    });
    //  수정할 부분인 date, content를 선택한 마커 상태를 지도에 뿌려지는 마커들에서 비교 후에 일치하는 경우 수정해줌
    setMarkers((prev) => prev.map((marker) => (marker._id === markerId ? { ...marker, date: date ?? marker.date, content } : marker)));
  };

  // const fetchMarkers = useCallback(async () => {
  //   if (!uid) return;

  //   setIsLoading(true); // 로딩 시작

  //   const db = getFirestore(firebaseApp);
  //   const travelData = collection(db, "travelData");

  //   // 🔥 현재 로그인한 유저의 uid로 필터링
  //   // const querySnapshot = await getDocs(collection(db, "travelData"));
  //   const q = query(travelData, where("uid", "==", uid), orderBy("date", "desc"));
  //   const snapshot = await getDocs(q);

  //   const fetchedData = snapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     date: doc.data().date.toDate(),
  //   })) as ILogPlace[];

  //   setMarkers(fetchedData);

  //   setIsLoading(false); // 로딩 종료
  // }, [uid]);

  const fetchMoreMarkers = useCallback(async () => {
    if (!uid) return;

    setIsLoading(true); // 로딩 시작

    const db = getFirestore(firebaseApp);
    const travelData = collection(db, "travelData");

    // 🔥 현재 로그인한 유저의 uid로 필터링
    let q = query(travelData, where("uid", "==", uid), orderBy("date", "desc"), limit(limitCount));
    if (lastDoc) {
      q = query(travelData, where("uid", "==", uid), orderBy("date", "desc"), startAfter(lastDoc), limit(limitCount));
    }
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as ILogPlace[];

      setMarkers((prev) => [...prev, ...newData]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      console.log("이번 fetch에서 추가된 마커 수:", newData.length);

      if (snapshot.docs.length < limitCount) setHasMore(false);
    } else {
      setHasMore(false);
    }
    setIsLoading(false); // 로딩 종료
  }, [uid, lastDoc]);

  // useEffect(() => {
  //   fetchMarkers();
  // }, [fetchMarkers]);

  useEffect(() => {
    if (markers.length === 0) {
      fetchMoreMarkers();
    }
  }, [markers.length, fetchMoreMarkers]);

  // hasMore 상태도 출력
  console.log("hasMore 상태:", hasMore);
  useEffect(() => {
    console.log("현재까지 총 마커 개수:", markers.length);
  }, [markers]);

  return {
    markers,
    createMarker,
    updateMarker,
    fetchMoreMarkers,
    hasMore,
    isLoading,
  };
};
