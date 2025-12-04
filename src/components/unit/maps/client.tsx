"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MapsClient({ setKeyword }: { setKeyword: React.Dispatch<React.SetStateAction<string>> }) {
  // useSearchParams < 은 클라이언트 전용 훅이기 때문에 페이지가 서버에서 프리렌더링될 때 호출될 수도 있기 때문에 오류가 난다.
  // 그렇기 때문에 클라이언트 전용으로 컴포넌트를 따로 빼서 useEffect 하여 값을 담아 사용해야한다.
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  useEffect(() => {
    setKeyword(keyword);
  }, [keyword, setKeyword]); // 렌더 후 실행되므로 안전

  return null;
}
