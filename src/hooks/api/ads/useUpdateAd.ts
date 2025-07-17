import { useState, useCallback } from "react";
import { fetchSingleAd, updateAdById } from "@services/adApiService/adApiService";
import { Ad } from "@/types/property";

interface UseEditAdReturn {
  ad: Ad | null;
  loading: boolean;
  error: Error | null;
  fetchAd: (adId: string) => Promise<void>;
  updateAd: (adId: string, formData: FormData) => Promise<void>;
}

export function useEditAd(): UseEditAdReturn {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAd = useCallback(async (adId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSingleAd(adId);
      setAd(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAd = useCallback(async (adId: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await updateAdById(adId, formData);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { ad, loading, error, fetchAd, updateAd };
}