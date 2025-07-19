import { useState, useEffect } from "react";
import { getFilteredUsers } from "@services/user/userService";
import { User } from "@/types/user";

export const useFilteredUsers = (hasSubscription?: boolean) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const u = await getFilteredUsers(hasSubscription);
        setUsers(u);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [hasSubscription]);

  return { users, loading, error, setUsers };
};
