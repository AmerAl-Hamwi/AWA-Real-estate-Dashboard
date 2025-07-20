import { useState, useEffect, useCallback } from "react";
import { getFilteredUsers } from "@services/user/userService";
import { User } from "@/types/user";

export const useFilteredUsers = (
  page: number,
  limit: number,
  hasSubscription?: boolean
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { users, total } = await getFilteredUsers(
        page + 1,
        limit,
        hasSubscription
      );
      setUsers(users);
      setTotal(total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, hasSubscription]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { users, total, loading, error, refetch: fetchData };
};