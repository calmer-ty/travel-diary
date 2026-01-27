import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { ArrowRight, Brain } from "lucide-react";

import BasicTooltip from "./BasicTooltip";

import type { Content } from "@google/genai";

interface IData {
  text?: Content;
  history?: Content[];
}
export default function GeminiChatbot() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [data, setData] = useState<IData | undefined>({
    text: { role: "", parts: [{ text: "" }] },
    history: [{ role: "model", parts: [{ text: "만나서 반갑습니다. 무엇을 도와드릴까요?" }] }],
  });

  // 대화 생성 시 스크롤 업데이트
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isLoading) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", // 부드럽게 스르륵 내려가는 효과
      });
    }
  }, [isLoading]);

  // 대화 생성
  const handleGemini = async (input: string) => {
    if (!input.trim()) return;
    setIsLoading(true);
    setInput("");

    try {
      // 우리 서버 API로 요청을 보냄
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({
          input: input,
          history: data?.history, // 현재까지 저장된 대화 기록 전송
        }),
      });

      const resJson = await res.json();

      // 서버가 돌려준 최신 대화 기록으로 상태 업데이트
      setData(resJson);
    } catch (error) {
      console.error("통신 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <BasicTooltip content="안녕하세요. Travel AI입니다.">
        <PopoverTrigger asChild>
          <Button variant="default" className="absolute bottom-4 right-4 w-10 h-10 rounded-full md:w-12 md:h-12">
            <Brain className="!w-6 !h-6" />
          </Button>
        </PopoverTrigger>
      </BasicTooltip>
      <PopoverContent className="w-80 mb-1 mr-4">
        <div ref={scrollRef} className="overflow-x-auto flex flex-col h-100 mb-4">
          {data?.history?.map((m, idx) => (
            <p key={`${m.parts?.[0].text}_${idx}`} className={`my-2 py-2 ${m.role === "model" ? "self-start" : "px-4 self-end border rounded-xl bg-slate-50"}`}>
              {m.parts?.[0].text}
            </p>
          ))}
          {/* 로딩 중일 때만 보이는 문구 */}
          {isLoading && <p className="self-start text-sm text-slate-400 animate-pulse">생각 중...</p>}
        </div>

        <Card className="flex flex-col gap-2 p-2">
          <Textarea className="border-none shadow-none" value={input} onChange={(e) => setInput(e.target.value)} />

          <Button className="self-end" onClick={() => handleGemini(input)}>
            <ArrowRight />
          </Button>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
