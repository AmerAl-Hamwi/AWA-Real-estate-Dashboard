import axios, { AxiosError } from "axios";
import { AdsResponse, Ad } from "@/types/property";

const api = axios.create({
  baseURL: "http://31.97.53.214:3000/api/admin/v1",
  headers: { "Content-Type": "application/json" },
});

// const apiUpdate = axios.create({
//   baseURL: "http://31.97.53.214:3000/api/admin/v1",
//   headers: { "Content-Type": "application/json" },
// });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("authToken");
  if (t && cfg.headers) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    const s = err.response?.status;
    if (s === 407 || s === 401) {
      localStorage.clear();
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export const fetchSingleAd = async (
  adId: string
): Promise<{ status: boolean; message: string; data: Ad }> => {
  const { data } = await api.get<{
    status: boolean;
    message: string;
    data: Ad;
  }>(`/realestatead/get-ad-by-id`, { params: { adId } });
  return data;
};

export const fetchAds = async (
  page: number,
  limit: number
): Promise<AdsResponse> => {
  const { data } = await api.get<AdsResponse>(`/realestatead/get-all-ad`, {
    params: { page, limit },
  });
  return data;
};

export const acceptOrRejectAd = async (
  adId: string,
  typeAccepte: "approved" | "Rejection"
): Promise<void> => {
  const body = new URLSearchParams();
  body.append("typeAccepte", typeAccepte);

  await api.put(
    `/realestatead/Accept-or-reject-ad-by-id?adId=${encodeURIComponent(adId)}`,
    body.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const acceptOrRejectRequireAd = async (
  adId: string,
  typeAccepte: "approved" | "Rejection"
): Promise<void> => {
  const body = new URLSearchParams();
  body.append("typeAccepte", typeAccepte);

  await api.put(
    `/realestatead/Accept-or-reject-ad-require-by-id?adId=${encodeURIComponent(adId)}`,
    body.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const updateAdById = async (
  adId: string,
  formData: FormData
): Promise<void> => {
  await api.put(`/realestatead/update-ad-by-id`, formData, {
    params: { adId },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAdById = async (id: string): Promise<void> => {
  await api.delete(`/realestatead/delete-ad-by-id`, {
    params: { id },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
