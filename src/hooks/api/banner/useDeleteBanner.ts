import { useCallback, useState } from "react";
import { deleteBanner as apiDeleteBanner } from "@services/bannerApiService/bannerApiService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

export function useDeleteBanner(onSuccess?: (id: string) => void) {
  const { showToaster } = useToasterContext();
  const [loading, setLoading] = useState(false);

  const trigger = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await apiDeleteBanner(id);
        showToaster({ message: "Banner deleted successfully", type: "success" });
        onSuccess?.(id);
      } catch (err) {
        showToaster({
          message: err.response?.data?.message || "Delete failed",
          type: "error",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, showToaster]
  );

  return { deleteBanner: trigger, loading };
}