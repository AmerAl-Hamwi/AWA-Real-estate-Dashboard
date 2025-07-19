import { useEffect, useState } from "react";
import { fetchProvincesWithCities, Province } from "@services/user/provinceService";

export const useProvinces = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProvincesWithCities();
        setProvinces(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load provinces and cities");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { provinces, loading, error };
};
