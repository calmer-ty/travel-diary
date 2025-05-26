import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import type { User } from "firebase/auth";
import { auth } from "@/commons/libraries/firebase/firebaseApp";

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useAuth = (): {
  user: User | null;
} => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser !== null) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    // 컴포넌트가 unmount될 때 리스너를 정리
    return () => {
      unsubscribe();
    };
  }, []);

  return { user };
};
