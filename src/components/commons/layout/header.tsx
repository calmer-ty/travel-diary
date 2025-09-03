"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, handleLogin, handleLogout } = useAuth();

  return (
    <header className="flex justify-between items-center w-full h-12 px-4 bg-white shadow-md fixed z-10">
      <h1 className="w-30 h-8 bg-[url(/images/Logo.png)] bg-contain bg-no-repeat text-[0px]">
        <Link href="/" className="block size-full">
          Travel Diary
        </Link>
      </h1>
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
        <Button variant="outline" onClick={handleLogin}>
          로그인
        </Button>
        // <button onClick={handleGoogleLogin}>로그인</button>
      )}
    </header>
  );
}
