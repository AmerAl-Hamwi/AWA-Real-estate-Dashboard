import { useState, useEffect, useCallback, useRef } from "react";
import { getFilteredUsers } from "@services/user/userService";
import { User } from "@/types/user";

export const useFilteredUsers = (
  page: number,
  limit: number,
  hasSubscription?: boolean,
  number?: string
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);     // only for initial mount
  const [isFetching, setIsFetching] = useState(false); // for subsequent fetches
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // cancel any in-flight
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // only show full loader on first mount
    if (!users.length && total === 0) setLoading(true);
    else setIsFetching(true);
    setError(null);

    try {
      const { users: u, total: t } = await getFilteredUsers(
        page + 1,
        limit,
        hasSubscription,
        number,
        controller.signal
      );
      setUsers(u);
      setTotal(t);
    } catch (err) {
      // ignore cancellations
      if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
        setError(err as Error);
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [page, limit, hasSubscription, number, users.length, total]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { users, total, loading, isFetching, error, refetch: fetchData };
};