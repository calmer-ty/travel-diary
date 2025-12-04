import { useEffect, useState } from "react";

import type { ITravelWaringItem } from "@/types";
interface ITravelWarningResponse {
  items: {
    item: ITravelWaringItem[];
  };
  totalCount: number;
  error?: string;
}

export function useTravelWarning() {
  const [countryItems, setCountryItems] = useState<ITravelWaringItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/travelWarning");
        const data: ITravelWarningResponse = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setCountryItems(data.items.item);
          setTotalCount(data.totalCount);
          // console.log(data.items.item, "data.items.item");
        }
      } catch (err) {
        setError("데이터를 불러오는 중 오류 발생");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    countryItems,
    loading,
    error,
    totalCount,
  };
}
