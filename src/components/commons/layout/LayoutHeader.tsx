"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/authContext";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function LayoutHeader() {
  const { user, handleLogin, handleLogout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const onClickMoveToList = () => {
    router.push("/list");
  };

  return (
    <>
      {pathname !== "/" && (
        <header className="flex justify-between items-center w-full h-12 px-4 bg-white fixed z-255">
          {/* <header className="flex justify-between items-center w-full h-12 px-4 bg-white shadow-md fixed z-10"> */}
          <h1 className="w-35 h-8 bg-[url(/images/Logo.png)] bg-contain bg-no-repeat text-[0px]">
            <Link href="/dashboard" className="block size-full">
              Travel Diary
            </Link>
          </h1>
          <div>
            {user !== null ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <div className="flex items-center gap-2">
                        <img className="w-4 h-4" src="/images/icon_people.png" alt="출처: figma" />
                        <span>{user.displayName}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuItem className="cursor-pointer" onClick={onClickMoveToList}>
                      나의 여행기록
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="outline" onClick={handleLogin}>
                로그인
              </Button>
            )}
          </div>
        </header>
      )}
    </>
  );
}
