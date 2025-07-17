import { useCallback } from "react";
import { deleteAdById } from "@services/adApiService/adApiService";

export const useDeleteAd = (refetch: () => void) => {
  const deleteAd = useCallback(async (id: string) => {
    try {
      await deleteAdById(id);
      refetch();
    } catch (error) {
      console.error("Delete failed", error);
      throw error;
    }
  }, [refetch]);

  return { deleteAd };
};
