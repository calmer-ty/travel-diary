"use client";

import Link from "next/link";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";

import AlertMaps from "@/components/unit/maps/alert";

export default function MobileMenu() {
  const { uid } = useAuth();
  const { showAlert, alertValue, triggerAlert } = useAlert();

  return (
    <div>
      <nav className="fixed bottom-0 z-10 w-full h-[50px] bg-[#EDE3CA] rounded-tl-4xl rounded-tr-4xl ">
        <ul className="size-full flex">
          <li className="flex justify-center items-center w-1/4 h-full">
            <Link href="/" className="w-7 h-7 bg-contain bg-no-repeat bg-[url(/images/icon_home.png)]"></Link>
          </li>
          <li className="flex justify-center items-center w-1/4 h-full">
            <Link href="/maps" className="w-7 h-7 bg-contain bg-no-repeat bg-[url(/images/icon_diary.png)]"></Link>
          </li>
          <li className="flex justify-center items-center w-1/4 h-full">
            <Link href="" className="w-7 h-7 bg-contain bg-no-repeat bg-[url(/images/icon_balloon.png)]"></Link>
          </li>
          <li className="flex justify-center items-center w-1/4 h-full">
            <Link
              onClick={(e) => {
                if (!uid) {
                  e.preventDefault(); // 링크 이동 막기
                  triggerAlert("로그인이 필요한 페이지 입니다.");
                }
              }}
              href="/list"
              className="w-5.5 h-5.5 bg-contain bg-no-repeat bg-[url(/images/icon_people.png)]"
            ></Link>
          </li>
        </ul>
      </nav>

      {showAlert && <AlertMaps alertValue={alertValue} />}
    </div>
  );
}
