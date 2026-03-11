import type { ITravelWaringItem } from "@/types";
import useSWR from "swr";

interface ITravelWarningResponse {
  items: {
    item: ITravelWaringItem[];
  };
  error?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTravelWarning() {
  const { data, error, isLoading } = useSWR<ITravelWarningResponse>(
    "/api/travelWarning",
    fetcher,
    { revalidateOnFocus: false } // 창 포커스 시 재요청 방지
  );

  return {
    countryItems: data?.items?.item ?? [],
    loading: isLoading,
    error: error || data?.error,
  };
}
