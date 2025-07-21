import { useState } from "react";
import { giveSubscription, cancelSubscription } from "@services/user/userService";
import { useToasterContext } from "@/contexts/toaster/useToasterContext";

export function useSubscriptionActions() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { showToaster } = useToasterContext();

  const onSubscribe = async (userId: string) => {
    setLoadingId(userId);
    try {
      await giveSubscription(userId);
      showToaster({ message: "Subscription granted", type: "success" });
    } catch (err) {
      showToaster({
        message: err.response?.data?.message || "Failed to subscribe",
        type: "error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const onCancel = async (userId: string) => {
    setLoadingId(userId);
    try {
      await cancelSubscription(userId);
      showToaster({ message: "Subscription cancelled", type: "success" });
    } catch (err) {
      showToaster({
        message: err.response?.data?.message || "Failed to cancel subscription",
        type: "error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return { onSubscribe, onCancel, loadingId };
}
