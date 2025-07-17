import { useState, useEffect } from "react";
import axios from "axios";

interface Province {
  id: string;
  name: {
    en: string;
    ar: string;
  };
}

const apiLists = axios.create({
  baseURL: "http://31.97.53.214:3000/api/app/v1",
});

// Add this interceptor to include authToken from localStorage
apiLists.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function useProvinces() {
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await apiLists.get<{
        status: boolean;
        message: string;
        data: Array<{
          id: string;
          name: { en: string; ar: string };
        }>;
      }>("/user/get-all-city");

      setProvinces(
        data.data.map((p) => ({
          id: p.id,
          name: p.name,
        }))
      );
    })();
  }, []);

  return provinces;
}

export function useAmenities() {
  const [amenities, setAmenities] = useState<{ _id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    (async () => {
      const { data } = await apiLists.get<{
        status: boolean;
        message: string;
        data;
      }>("/user/get-all-amenities");
      setAmenities(data.data.map((a) => ({ _id: a._id, name: a.amenitiesType })));
    })();
  }, []);

  return amenities;
}
