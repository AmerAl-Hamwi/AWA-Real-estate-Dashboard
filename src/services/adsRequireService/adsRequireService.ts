import axios, { AxiosError } from "axios";
import { AdsResponse, AdsResponseData } from "@/types/property";

const api = axios.create({
  baseURL: "http://31.97.53.214:3000/api/admin/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("authToken");
  if (t && cfg.headers) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    const s = err.response?.status;
    if ( s === 400 || s === 401) {
      localStorage.clear();
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export const getRequiredEstate = async (
  page: number,
  limit: number
): Promise<AdsResponseData> => {
  const { data } = await api.get<AdsResponse>(
    "/realestatead/get-all-ad-require",
    { params: { page, limit } }
  );

  if (!data.status) {
    throw new Error(data.message || "Unknown API error");
  }

  return data.data;
};
