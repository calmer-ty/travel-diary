import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Card } from "../ui/card";
import { ArrowRight, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";

import BasicTooltip from "./BasicTooltip";

import type { Content } from "@google/genai";

interface IData {
  date?: string;
  text?: Content;
  history?: Content[];
}
export default function GeminiChatbot({ modelText, instruction }: { modelText: string; instruction: string }) {
  const [input, setInput] = useState("");
  const [data, setData] = useState<IData | undefined>({
    date: "",
    history: [{ role: "model", parts: [{ text: modelText }] }],
  });
  const [isLoading, setIsLoading] = useState(false);

  // 대화 생성 시 스크롤 업데이트
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && data) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", // 부드럽게 스르륵 내려가는 효과
      });
    }
  }, [data]);

  // 대화 생성
  const handleGemini = async (input: string) => {
    if (!input.trim()) return;

    // 1. 사용자의 메시지를 history에 즉시 추가
    const userContent: Content = { role: "user", parts: [{ text: input }] };

    setData((prev) => ({
      ...prev,
      history: [...(prev?.history ?? []), userContent],
    }));

    setIsLoading(true);
    setInput("");

    try {
      // 우리 서버 API로 요청을 보냄
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({
          input: input,
          history: data?.history, // 현재까지 저장된 대화 기록 전송
          instruction: instruction,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. 한글 입력 시 마지막 글자가 중복 전송되는 현상 방지
    if (e.nativeEvent.isComposing) return;

    // 2. 엔터 키를 눌렀을 때 (Shift 키와 함께 누르지 않았을 때)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 엔터로 인한 줄바꿈 방지

      if (input.trim()) {
        handleGemini(input);
      }
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
      <PopoverContent className="w-80 mb-1 mr-4 font-['Roboto']">
        <div ref={scrollRef} className="overflow-x-auto flex flex-col h-50 pr-4 mb-4 text-sm">
          {data?.history?.map((m, idx) => (
            <div
              key={`${m.parts?.[0].text}_${idx}`}
              className={`[&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-4
               my-4 py-2 space-y-4 ${m.role === "model" ? "self-start" : "px-4 self-end border rounded-xl"}`}
            >
              <ReactMarkdown>{m.parts?.[0].text}</ReactMarkdown>
            </div>
          ))}

          {/* 로딩 중일 때만 보이는 문구 */}
          {isLoading && <p className="self-start text-sm text-slate-400 animate-pulse">생각 중...</p>}
        </div>

        <Card className="flex flex-col gap-2 p-2">
          <textarea className="border-none shadow-none outline-none text-sm" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />

          <Button className="w-8 h-8 self-end" onClick={() => handleGemini(input)}>
            <ArrowRight />
          </Button>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
