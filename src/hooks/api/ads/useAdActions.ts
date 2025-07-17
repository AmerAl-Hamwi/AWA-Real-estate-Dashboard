import { useState, useCallback } from "react";
import { acceptOrRejectAd, acceptOrRejectRequireAd } from "@services/adApiService/adApiService";

export function useAdActions({
  isRequire = false,
}: { isRequire?: boolean } = {}) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const requestFn = isRequire ? acceptOrRejectRequireAd : acceptOrRejectAd;

  const _startProcessing = (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
  };

  const _finishProcessing = (id: string, success: boolean) => {
    setProcessingIds((prev) => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });
    if (success) {
      setCompletedIds((prev) => new Set(prev).add(id));
    }
  };

  const approveAd = useCallback(async (id: string) => {
    if (processingIds.has(id) || completedIds.has(id)) return;
    _startProcessing(id);
    try {
      await requestFn(id, "approved");
      _finishProcessing(id, true);
    } catch {
      _finishProcessing(id, false);
      throw new Error("Failed to approve ad");
    }
  }, [requestFn, processingIds, completedIds]);

  const rejectAd = useCallback(async (id: string) => {
    if (processingIds.has(id) || completedIds.has(id)) return;
    _startProcessing(id);
    try {
      await requestFn(id, "Rejection");
      _finishProcessing(id, true);
    } catch {
      _finishProcessing(id, false);
      throw new Error("Failed to reject ad");
    }
  }, [requestFn, processingIds, completedIds]);

  return { approveAd, rejectAd, processingIds, completedIds };
}

