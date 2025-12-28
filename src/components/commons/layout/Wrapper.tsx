"use client";

import { useEffect } from "react";

import type { ReactNode } from "react";

export default function Wrapper({ children }: { children: ReactNode }) {
  // 설명 정리:
  // Zustand 훅이나 클라이언트 전용 훅에서 useEffect 같은
  // 초기화/구독 로직을 한 번만 실행해야 할 때 여기에 호출
  // 예: 사용자 데이터 구독, 실시간 업데이트 구독 등

  useEffect(() => {
    localStorage.removeItem("theme");
  }, []);

  return (
    <div id="wrapper" className="size-full">
      {children}
    </div>
  );
}
