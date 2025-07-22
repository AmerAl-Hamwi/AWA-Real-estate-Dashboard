import { useState, useCallback } from "react";
import { UpdateBanner as apiUpdateBanner } from "@services/bannerApiService/bannerApiService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";
import { FormattedBanner } from "@/types/banner";

interface BannerFormInput {
  type: "text" | "image";
  title?: string;
  body?: string;
  imageFile?: File;
}

export const useUpdateBanner = (
  opts: {
    updateOptimistic: (id: string, patch: Partial<FormattedBanner>) => void;
    snapshot: { data: FormattedBanner[]; total: number };
    setSnapshot: (d: FormattedBanner[], t: number) => void;
    refetch: () => Promise<void>;
  }
) => {
  const [isLoading, setLoading] = useState(false);
  const { showToaster } = useToasterContext();

  const updateBanner = useCallback(
    async (id: string, payload: BannerFormInput) => {
      setLoading(true);
      const snap = opts.snapshot;

      // optimistic patch
      opts.updateOptimistic(id, {
        title: payload.title,
        body: payload.body,
        type: payload.type,
        ...(payload.imageFile && { imageUrl: URL.createObjectURL(payload.imageFile) }),
      });

      try {
        await apiUpdateBanner(id, payload);
        showToaster({ message: "Banner updated successfully", type: "success" });
        opts.refetch();
      } catch (err) {
        // rollback
        opts.setSnapshot(snap.data, snap.total);
        showToaster({
          message: err.response?.data?.message || "Failed to update banner",
          type: "error",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [opts, showToaster]
  );

  return { updateBanner, isLoading };
};