import { useState, useCallback } from "react";
import { addBanner as apiAddBanner } from "@services/bannerApiService/bannerApiService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";
import { FormattedBanner } from "@/types/banner";

interface BannerFormInput {
  type: "text" | "image";
  title?: string;
  body?: string;
  imageFile?: File;
}

export const useCreateBanner = (
  opts: {
    addOptimistic: (b: FormattedBanner) => void;
    snapshot: { data: FormattedBanner[]; total: number };
    setSnapshot: (d: FormattedBanner[], t: number) => void;
    refetch: () => Promise<void>;
  }
) => {
  const [isLoading, setLoading] = useState(false);
  const { showToaster } = useToasterContext();

  const createBanner = useCallback(async (payload: BannerFormInput) => {
    setLoading(true);
    // optimistic item (temporary id)
    const tempId = `temp-${Date.now()}`;
    const optimisticBanner: FormattedBanner = {
      id: tempId,
      title: payload.title || "",
      body: payload.body || "",
      type: payload.type,
      imageUrl: payload.imageFile ? URL.createObjectURL(payload.imageFile) : "",
    };

    const snap = opts.snapshot;
    opts.addOptimistic(optimisticBanner);

    try {
      await apiAddBanner(payload);
      showToaster({ message: "Banner added successfully", type: "success" });
      opts.refetch();
    } catch (err) {
      // rollback
      opts.setSnapshot(snap.data, snap.total);
      showToaster({
        message: err.response?.data?.message || "Failed to add banner",
        type: "error",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [opts, showToaster]);

  return { createBanner, isLoading };
};