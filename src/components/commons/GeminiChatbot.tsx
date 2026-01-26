import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { GoogleGenAI } from "@google/genai";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Brain } from "lucide-react";

import type { Content } from "@google/genai";
import BasicTooltip from "./BasicTooltip";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEN_AI_API_KEY });

export default function GeminiChatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Content[]>([{ role: "model", parts: [{ text: "만나서 반갑습니다. 무엇을 도와드릴까요?" }] }]);

  const gemini = async (input: string) => {
    try {
      const chat = ai.chats.create({
        model: "gemini-2.0-flash-lite",
        // **"이 방은 이미 이런 대화를 나눈 상태에서 시작하는 거야"**라고 이전 대화 기록을 미리 채워넣은 것입니다.
        history: messages,
      });

      // 그 카톡방에 메시지를 톡 던지는 행위입니다. 그러면 상대방(AI)이 답장을 하겠죠?
      await chat.sendMessage({
        message: input,
      });

      setMessages(chat.getHistory());
      setInput("");
    } catch (error) {
      console.error(error);
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
          {messages.map((m) => (
            <p key={m.parts?.[0].text} className={`my-2 py-2 ${m.role === "model" ? "self-start" : "px-4 self-end border rounded-xl bg-slate-50"}`}>
              {m.parts?.[0].text}
            </p>
          ))}
        </div>

        <Card className="flex flex-col gap-2 p-2">
          <Textarea className="border-none shadow-none" value={input} onChange={(e) => setInput(e.target.value)} />

          <Button className="mt-2 self-end" onClick={() => gemini(input)}>
            보내기
          </Button>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
