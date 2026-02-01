import { Suspense, useState } from "react";
import { Loader2 } from "lucide-react";

import MapsClient from "./MapsClient";
import MapsContent from "./MapsContent";
import GeminiChatbot from "@/components/commons/GeminiChatbot";

export default function Maps() {
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <Suspense
        fallback={
          <div>
            <Loader2 />
          </div>
        }
      >
        <MapsClient setKeyword={setKeyword} />
      </Suspense>
      <MapsContent keyword={keyword} />
      <GeminiChatbot modelText="어떤 추억을 만드셨나요? 잊기 전에 간단히 메모해 보세요!" instruction="당신은 맵 기반 여행 일기 서비스의 '기록 비서'입니다." />
    </>
  );
}
