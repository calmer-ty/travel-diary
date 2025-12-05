"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth, db, googleProvider } from "@/lib/firebase/firebaseApp";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";

import type { User } from "firebase/auth";
import type { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  uid: string | undefined;
  loading: boolean;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  uid: undefined,
  loading: true,
  handleLogin: async () => {
    throw new Error("handleLogin not implemented");
  },
  handleLogout: async () => {
    throw new Error("handleLogout not implemented");
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [routingPoint, setRoutingPoint] = useState("");
  const uid = user?.uid;

  const router = useRouter();
  const pathname = usePathname();

  // 클라이언트에서 마운트된 후에 pathname 값 저장
  useEffect(() => {
    setRoutingPoint(pathname);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google 로그인 처리
  const handleLogin = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await createUser(user);
      router.push(routingPoint);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  // 유저 데이터 등록 함수
  const createUser = async (user: User) => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    try {
      await setDoc(
        docRef,
        {
          _id: user.uid,
          name: user.displayName,
          email: user.email,
          grade: "free",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  // 로그아웃 처리
  const handleLogout = async (): Promise<void> => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return <AuthContext.Provider value={{ user, uid, loading, handleLogin, handleLogout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
