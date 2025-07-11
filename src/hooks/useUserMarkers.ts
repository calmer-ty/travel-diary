import { useCallback, useEffect, useState } from "react";

import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase/firebaseApp";

import { ILogPlace, IUserID } from "@/types";

export const useUserMarkers = ({ uid }: IUserID) => {
  const [markers, setMarkers] = useState<ILogPlace[]>([]);

  const fetchMarkers = useCallback(async () => {
    if (!uid) return;

    const db = getFirestore(firebaseApp);
    const querySnapshot = await getDocs(collection(db, "travelData"));

    const storedMarkers = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as ILogPlace[];

    const userMarkers = storedMarkers.filter((item) => item.uid === uid);

    setMarkers(userMarkers);
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
