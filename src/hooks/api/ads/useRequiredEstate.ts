import { useState, useEffect } from "react";
import { getRequiredEstate } from "@services/adsRequireService/adsRequireService";
import { AdRequire } from "@/types/property";

interface UseRequiredEstateResult {
  ads: AdRequire[];
  totalDocs: number;
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
  const [totalDocs, setTotalDocs] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getRequiredEstate(currentPage, limit)
      .then(({ ads, totalPages, totalDocs }) => {
        setAds(ads);
        setPages(totalPages);
        setTotalDocs(totalDocs);
      })
      .catch((err) => setError(err as Error))
      .finally(() => setLoading(false));
  }, [currentPage, limit]);

  return {
    ads,
    totalDocs,
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