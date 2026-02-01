import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_API_KEY });

export async function POST(req: Request) {
  const { input, history, instruction } = await req.json(); // 클라이언트에서 보낸 값 받기

  try {
    const chat = ai.chats.create({
      model: "gemini-2.0-flash-lite",
      // **"이 방은 이미 이런 대화를 나눈 상태에서 시작하는 거야"**라고 이전 대화 기록을 미리 채워넣은 것입니다.
      history: history,
      config: {
        systemInstruction: `${instruction}
        - 사용자의 질문에 답할 때, 핵심 내용은 반드시 번호가 매겨진 리스트(1., 2., 3.)를 사용하여 설명해줘.`,
      },
    });

    // 그 카톡방에 메시지를 톡 던지는 행위입니다. 그러면 상대방(AI)이 답장을 하겠죠?
    const result = await chat.sendMessage({
      message: input,
    });

    // 클라이언트로 전달
    return NextResponse.json({
      date: result.sdkHttpResponse?.headers?.date,
      history: chat.getHistory(),
    });
  } catch (error) {
    console.error(error);
  }
}
