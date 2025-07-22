import { useState, useCallback } from "react";
import { deleteUserById } from "@services/user/userService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

export function useDeleteUser(onSuccess?: () => void) {
  const { showToaster } = useToasterContext();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const remove = useCallback(
    async (userId: string) => {
      setLoadingId(userId);
      try {
        await deleteUserById(userId);
        showToaster({ message: "User deleted successfully", type: "success" });
        onSuccess?.();
      } catch (err) {
        showToaster({
          message: err?.response?.data?.message || "Failed to delete user",
          type: "error",
        });
        throw err;
      } finally {
        setLoadingId(null);
      }
    },
    [onSuccess, showToaster]
  );

  return { deleteUser: remove, loadingId };
}
