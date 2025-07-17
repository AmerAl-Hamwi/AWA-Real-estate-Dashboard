import { useState, useCallback } from "react";
import { UpdateBanner as apiUpdateBanner } from "@services/bannerApiService/bannerApiService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

export interface BannerFormInput {
  type: "text" | "image";
  title?: string;
  body?: string;
  imageFile?: File;
}

export const useUpdateBanner = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToaster } = useToasterContext();

  const updateBanner = useCallback(
    async (bannerId: string, data: BannerFormInput) => {
      setLoading(true);
      setError(null);
      try {
        await apiUpdateBanner(bannerId, data);
        showToaster({ message: "Banner updated successfully", type: "success" });
      } catch (err) {
        setError(err.message ?? "Failed to update banner");
        showToaster({
          message: err.response?.data?.message || "Failed to update banner",
          type: "error",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToaster]
  );

  return { updateBanner, isLoading, error };
};