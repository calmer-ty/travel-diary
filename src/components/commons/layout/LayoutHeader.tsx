"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/authContext";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BasicTooltip from "../BasicTooltip";

export default function LayoutHeader() {
  const { user, handleLogin, handleLogout } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && (
        <header className="flex justify-between items-center w-full h-12 px-4 bg-white">
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
                        <img className="w-4 h-4" src="/images/icon_people.png" alt="출처: figma Icons8" />
                        <span>{user.displayName}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* 사이드바 트리거 버튼 */}
                <BasicTooltip content="다이어리 메뉴">
                  <SidebarTrigger className="ml-4" />
                </BasicTooltip>
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
