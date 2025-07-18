import { useState } from "react";
import { sendBroadcastMessage, BroadcastPayload } from "@services/messages/sendMessagesService";

export function useBroadcastMessage() {
  const [loading, setLoading] = useState(false);

  async function broadcast(
    payload: BroadcastPayload,
  ): Promise<{ success: boolean; error?: Error }> {
    setLoading(true);
    try {
      await sendBroadcastMessage(payload);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }

  return { broadcast, loading };
}