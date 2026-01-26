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
      <GeminiChatbot />
    </>
  );
}
