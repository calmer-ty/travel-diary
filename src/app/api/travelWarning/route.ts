import { NextResponse } from "next/server";

export const preferredRegion = "icn";
export const revalidate = 3600; // 1시간 캐싱

export async function GET() {
  const serviceKey = process.env.TRAVEL_SERVICE_KEY;

  if (!serviceKey) {
    return NextResponse.json({ error: "서비스 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const endpoint = "https://apis.data.go.kr/1262000/TravelWarningServiceV3/getTravelWarningListV3";

  try {
    const params = new URLSearchParams({
      serviceKey,
      returnType: "json",
      pageNo: "1",
      numOfRows: "500",
    });

    const res = await fetch(`${endpoint}?${params.toString()}`, {
      next: { revalidate: 3600 }, // 1시간 캐싱
    });

    const data = await res.json();

    return NextResponse.json({
      items: data.response?.body?.items ?? [],
      totalCount: data.response?.body?.totalCount ?? 0,
    });
  } catch (err) {
    console.error("API 호출 오류:", err);

    return NextResponse.json({ error: "API 호출 실패" }, { status: 500 });
  }
}
