import { useCallback, useEffect, useState } from "react";

import { addDoc, collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase/firebaseApp";

import { ILogPlace, IUserID } from "@/types";

export const useUserMarkers = ({ uid }: IUserID) => {
  const [markers, setMarkers] = useState<ILogPlace[]>([]);

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

  const fetchMarkers = useCallback(async () => {
    if (!uid) return;

    const db = getFirestore(firebaseApp);
    const travelData = collection(db, "travelData");

    // 🔥 현재 로그인한 유저의 uid로 필터링
    // const querySnapshot = await getDocs(collection(db, "travelData"));
    const q = query(travelData, where("uid", "==", uid));
    const snapshot = await getDocs(q);

    const fetchedData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as ILogPlace[];

    setMarkers(fetchedData);
  }, [uid]);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  return {
    markers,
    setMarkers,
    createMarker,
    refetch: fetchMarkers,
  };
};
