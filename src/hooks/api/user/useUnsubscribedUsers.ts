import { useState, useEffect } from "react";
import { getUnsubscribedUsers } from "@services/user/userService";
import { User } from "@/types/user";

export const useUnsubscribedUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const u = await getUnsubscribedUsers();
        setUsers(u);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { users, loading, error };
};
