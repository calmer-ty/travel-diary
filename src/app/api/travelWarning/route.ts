import { NextResponse } from "next/server";

export async function GET() {
  const serviceKey = process.env.TRAVEL_SERVICE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "서비스 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const pageNo = 1;
  const numOfRows = 10;

  const endpoint = "https://apis.data.go.kr/1262000/TravelWarningServiceV3";
  const params = new URLSearchParams({
    serviceKey,
    // returnType: "json",
    pageNo: pageNo.toString(),
    numOfRows: numOfRows.toString(),
  });

  try {
    const url = `${endpoint}?${params.toString()}`;
    console.log("API 호출 URL:", url);

    const res = await fetch(url);
    const text = await res.text();
    console.log("Raw API response:", text);

    const data = JSON.parse(text); // JSON이면 파싱
    return NextResponse.json(data);
  } catch (err) {
    console.error("API 호출 오류:", err);
    return NextResponse.json({ error: "API 호출 실패" }, { status: 500 });
  }
}
