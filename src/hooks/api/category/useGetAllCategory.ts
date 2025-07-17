import { useState, useEffect, useCallback } from "react";
import { fetchCategories } from "@/services/categoryService/categoryService";
import { Category } from "@/types/category";

export function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCategories();
      setCategories(res.data.categories);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    categories,
    loading,
    error,
    refetch: load,
  };
}