import { NextResponse } from "next/server";

export async function GET() {
  const serviceKey = process.env.NEXT_PUBLIC_TRAVEL_SERVICE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "서비스 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const endpoint = "https://apis.data.go.kr/1262000/TravelWarningServiceV3/getTravelWarningListV3";

  try {
    // totalCount 확인
    const initialParams = new URLSearchParams({
      serviceKey,
      returnType: "json",
      pageNo: "1",
      numOfRows: "10",
    });

    const initialRes = await fetch(`${endpoint}?${initialParams.toString()}`);
    const initialData = await initialRes.json();

    const totalCount = initialData.response?.body?.totalCount ?? 0;

    if (totalCount === 0) {
      return NextResponse.json({ items: [], totalCount: 0 });
    }

    // totalCount로 모든 데이터 가져오기
    const allParams = new URLSearchParams({
      serviceKey,
      returnType: "json",
      pageNo: "1",
      numOfRows: totalCount.toString(),
    });

    const allRes = await fetch(`${endpoint}?${allParams.toString()}`);
    const allData = await allRes.json();

    return NextResponse.json({
      items: allData.response?.body?.items ?? [],
      totalCount,
    });
  } catch (err) {
    console.error("API 호출 오류:", err);
    return NextResponse.json({ error: "API 호출 실패" }, { status: 500 });
  }
}
