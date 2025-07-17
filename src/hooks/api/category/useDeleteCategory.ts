import { useCallback, useState } from "react";
import { deleteCategory } from "@services/categoryService/categoryService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

export function useDeleteCategory(onSuccess: () => void) {
  const { showToaster } = useToasterContext();
  const [loading, setLoading] = useState(false);

  const trigger = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await deleteCategory(id);
        showToaster({ message: "Category deleted", type: "success" });
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

  return { triggerDeleteCategory: trigger, loading };
}
