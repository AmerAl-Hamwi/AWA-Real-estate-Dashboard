import { useState, useCallback } from "react";
import { addBanner as apiAddBanner } from "@services/bannerApiService/bannerApiService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

export interface BannerFormInput {
  type: "text" | "image";
  title?: string;
  body?: string;
  imageFile?: File;
}

export const useCreateBanner = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToaster } = useToasterContext();

  const createBanner = useCallback(async (data: BannerFormInput) => {
    setLoading(true);
    setError(null);
    try {
      // just hand off your data object; service builds the FormData
      await apiAddBanner(data);
      showToaster({ message: "Banner added successfully", type: "success" });
    } catch (err) {
      setError(err.message ?? "Failed to add banner");
      showToaster({
        message: err.response?.data?.message || "Failed to add banner",
        type: "error",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToaster]);

  return { createBanner, isLoading, error };
};
