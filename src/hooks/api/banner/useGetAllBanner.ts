import { useState, useEffect, useCallback } from "react";
import { fetchBanners } from "@services/bannerApiService/bannerApiService";
import { FormattedBanner } from "@/types/banner";

export function useBanners(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [data, setData] = useState<FormattedBanner[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBanners(page, limit);
      const d = res.data;
      setData(d.banners);
      setTotal(d.totalBanners);
    } catch (err) {
      setError(err.message || "Unable to load banners");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { load(); }, [load]);

  // ---------- optimistic helpers ----------
  const addOptimistic = (banner: FormattedBanner) => {
    setData(prev => [banner, ...prev]);
    setTotal(t => t + 1);
  };

  const updateOptimistic = (id: string, patch: Partial<FormattedBanner>) => {
    setData(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
  };

  const deleteOptimistic = (id: string) => {
    setData(prev => prev.filter(b => b.id !== id));
    setTotal(t => Math.max(0, t - 1));
  };

  // rollback helper if API failed
  const setSnapshot = (snap: FormattedBanner[], totalSnap: number) => {
    setData(snap);
    setTotal(totalSnap);
  };

  return {
    data,
    total,
    page,
    limit,
    setPage,
    setLimit,
    loading,
    error,
    refetch: load,
    addOptimistic,
    updateOptimistic,
    deleteOptimistic,
    snapshot: { data, total },
    setSnapshot,
  };
}