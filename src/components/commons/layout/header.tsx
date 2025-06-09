"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/commons/libraries/firebase/firebaseApp";
import { useAuth } from "@/commons/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user } = useAuth();

  // Google 로그인 처리
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log(auth);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  // 로그아웃 처리
  const handleLogout = async (): Promise<void> => {
    try {
      await auth.signOut();
      // setAlertOpen(true);
      // setRouting("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  console.log("user: ", user);

  return (
    <header className="flex justify-between items-center w-full h-12 px-4 bg-white shadow-md fixed z-10">
      <h1 className="text-[0px] w-30 h-8 bg-[url(/images/Logo.png)] bg-contain bg-no-repeat">Travel Diary</h1>
      {user !== null ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <div className="flex items-center gap-2">
                  <img className="w-4 h-4" src="/images/icon_people.png" alt="" />
                  <span>{user.displayName}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Button variant="outline" onClick={handleGoogleLogin}>
          로그인
        </Button>
        // <button onClick={handleGoogleLogin}>로그인</button>
      )}
    </header>
  );
}
