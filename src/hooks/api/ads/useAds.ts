import { useState, useEffect, useCallback } from "react";
import { fetchAds } from "@services/adApiService/adApiService";
import { Ad, AdsResponse } from "@/types/property";

export interface UseAdsResult {
  ads: Ad[];
  totalAds: number;
  pages: number;
  currentPage: number;
  loading: boolean;
  error: Error | null;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  limit: number;
  refetch: () => void;
}

export function useAds(initialPage = 1, initialLimit = 5): UseAdsResult {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [ads, setAds] = useState<Ad[]>([]);
  const [totalAds, setTotalAds] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp: AdsResponse = await fetchAds(page, limit);
      setAds(resp.data.ads);
      setTotalAds(resp.data.totalDocs);
      setPages(resp.data.totalPages);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // load on mount and whenever page/limit changes
  useEffect(() => {
    load();
  }, [load]);

  return {
    ads,
    totalAds,
    pages,
    currentPage: page,
    loading,
    error,
    setPage,
    setLimit,
    limit,
    refetch: load,
  };
}
