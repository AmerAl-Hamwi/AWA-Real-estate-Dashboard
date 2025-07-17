import { useCallback, useState } from "react";
import { deleteBanner } from "@services/bannerApiService/bannerApiService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

export function useDeleteBanner(onSuccess: () => void) {
  const { showToaster } = useToasterContext();
  const [loading, setLoading] = useState(false);

  const trigger = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await deleteBanner(id);
        showToaster({ message: "Banner deleted Successfully", type: "success" });
        onSuccess();
      } catch (err) {
        showToaster({
          message: err.response?.data?.message || "Delete failed",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, showToaster]
  );

  return { deleteBanner: trigger, loading };
}