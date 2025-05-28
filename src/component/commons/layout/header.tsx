"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/commons/libraries/firebase/firebaseApp";

export default function Headers() {
  // Google 로그인 처리
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log(auth);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleGoogleLogout = () => {};

  return (
    <header className="bg-white w-full h-[50px] p-1 shadow-[0_3px_3px_rgba(0,0,0,0.2)] fixed top-[0] z-[10]">
      <div className="w-full h-full flex justify-between items-center">
        <h1 className="text-[0px] w-30 h-8 bg-[url(/images/Logo.png)] bg-contain bg-no-repeat">Travel Diary</h1>

        {auth.currentUser?.uid ? (
          <div className="flex items-center gap-2 font-medium">
            <img className="w-4 h-4" src="/images/icon_people.png" alt="" />
            <span>{auth.currentUser.displayName}</span>
          </div>
        ) : (
          // <button onClick={handleGoogleLogout} className="font-medium ">로그 아웃</button>
          <button onClick={handleGoogleLogin} className="font-medium ">
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
