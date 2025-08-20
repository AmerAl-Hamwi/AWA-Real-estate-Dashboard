import { useCallback, useEffect, useState } from "react";
import {
  deleteVersion,
  fetchVersions,
  ReleaseVersion,
  upsertVersion,
  UpsertVersionInput,
} from "@/services/versionService/versionService";

export function useVersions() {
  const [versions, setVersions] = useState<ReleaseVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setError(null);
    if (versions.length === 0) setLoading(true); else setIsFetching(true);
    try {
      const list = await fetchVersions();
      setVersions(list);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [versions.length]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (input: UpsertVersionInput) => {
    const saved = await upsertVersion(input);
    setVersions(prev => {
      const idx = prev.findIndex(v => v.platform === saved.platform);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...prev[idx], ...saved };
        return copy;
      }
      return [saved, ...prev];
    });
  }, []);

  // ✅ delete by platform
  const remove = useCallback(async (platform: string) => {
    await deleteVersion(platform);
    setVersions(prev => prev.filter(v => v.platform !== platform));
  }, []);

  return { versions, loading, isFetching, error, refetch: load, save, remove };
}
