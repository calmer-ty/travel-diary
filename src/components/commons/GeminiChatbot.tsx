import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Brain } from "lucide-react";

import type { Content } from "@google/genai";
import BasicTooltip from "./BasicTooltip";

export default function GeminiChatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Content[] | undefined>([{ role: "model", parts: [{ text: "만나서 반갑습니다. 무엇을 도와드릴까요?" }] }]);

  const handleGemini = async (input: string) => {
    try {
      // 우리 서버 API로 요청을 보냄
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({
          input: input,
          history: messages, // 현재까지 저장된 대화 기록 전송
        }),
      });

      const data: Content[] | undefined = await res.json();

      // 서버가 돌려준 최신 대화 기록으로 상태 업데이트
      setMessages(data);
      setInput("");
    } catch (error) {
      console.error("통신 에러:", error);
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
        <div className="overflow-x-auto flex flex-col h-100 mb-4">
          {messages?.map((m) => (
            <p key={m.parts?.[0].text} className={`my-2 py-2 ${m.role === "model" ? "self-start" : "px-4 self-end border rounded-xl bg-slate-50"}`}>
              {m.parts?.[0].text}
            </p>
          ))}
        </div>

        <Card className="flex flex-col gap-2 p-2">
          <Textarea className="border-none shadow-none" value={input} onChange={(e) => setInput(e.target.value)} />

          <Button className="mt-2 self-end" onClick={() => handleGemini(input)}>
            보내기
          </Button>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
