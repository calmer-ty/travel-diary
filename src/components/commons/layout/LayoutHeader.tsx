"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/authContext";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon, Sun, User } from "lucide-react";

import BasicTooltip from "../BasicTooltip";

export default function LayoutHeader() {
  const pathname = usePathname();
  const { user, handleLogin, handleLogout } = useAuth();

  const { theme, setTheme } = useTheme();

  // 마운트 후 동작 컨트롤
  const [mount, setMount] = useState(false);
  useEffect(() => setMount(true), []);

  console.log("theme: ", theme);

  return (
    <>
      {pathname !== "/" && (
        <header className="flex justify-between items-center w-full h-12 px-4">
          <h1 className="w-35 h-8 bg-[url(/images/Logo.png)] bg-contain bg-no-repeat text-[0px]">
            <Link href="/dashboard" className="block size-full">
              Travel Diary
            </Link>
          </h1>
          <div>
            {mount && (
              <div className="flex items-center gap-3">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <div className="flex items-center gap-2">
                          <User />
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
                ) : (
                  <Button variant="outline" onClick={handleLogin}>
                    로그인
                  </Button>
                )}
                <BasicTooltip content={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}>
                  <Button size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? <Sun /> : <Moon />}
                  </Button>
                </BasicTooltip>
                {/* 사이드바 트리거 버튼 */}
                {user && (
                  <BasicTooltip content="다이어리 메뉴">
                    <SidebarTrigger />
                  </BasicTooltip>
                )}
              </div>
            )}
          </div>
        </header>
      )}
    </>
  );
}
