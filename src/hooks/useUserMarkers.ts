import { useCallback, useEffect, useState } from "react";

import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase/firebaseApp";

import { ILogPlace, IUserID } from "@/types";

export const useUserMarkers = ({ uid }: IUserID) => {
  const [markers, setMarkers] = useState<ILogPlace[]>([]);

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
    refetch: fetchMarkers,
  };
};
