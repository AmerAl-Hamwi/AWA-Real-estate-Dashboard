import { useState, useEffect } from "react";
import { getRequiredEstate } from "@services/adsRequireService/adsRequireService";
import { AdRequire } from "@/types/property";

interface UseRequiredEstateResult {
  ads: AdRequire[];
  pages: number;
  currentPage: number;
  limit: number;
  loading: boolean;
  error: Error | null;
  setPage: (newPage: number) => void;
  setLimit: (newLimit: number) => void;
}

export const useRequiredEstate = (
  initialPage: number,
  initialLimit: number
): UseRequiredEstateResult => {
  const [ads, setAds] = useState<AdRequire[]>([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getRequiredEstate(currentPage, limit)
      .then(({ ads, totalPages }) => {
        setAds(ads);
        setPages(totalPages);
      })
      .catch((err) => {
        setError(err as Error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, limit]);

  return {
    ads,
    pages,
    currentPage,
    limit,
    loading,
    error,
    setPage: setCurrentPage,
    setLimit: (l) => {
      setLimit(l);
      setCurrentPage(1);
    },
  };
};