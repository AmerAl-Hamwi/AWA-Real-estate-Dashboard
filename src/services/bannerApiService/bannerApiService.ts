import axios, { AxiosError } from "axios";
import { BannerResponse } from "@/types/banner";

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
    if (s === 400 || s === 401) {
      localStorage.clear();
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export const fetchBanners = async (
  page: number,
  limit: number
): Promise<BannerResponse> => {
  const { data } = await api.get<BannerResponse>(
    `/banner/get-all-banners?page=${page}&limit=${limit}`
  );
  return data;
};

export const deleteBanner = async (bannerId: string): Promise<void> => {
  await api.delete(`/banner/delete-banner?bannerid=${bannerId}`);
};

export const editBanner = async (
  bannerId: string,
  formData: FormData
): Promise<void> => {
  await api.put(`/banner/update-banner?bannerid=${bannerId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = async (bannertId: string) => {
  await api.delete(`/banner/delete-banner?bannerid=${bannertId}`);
};

export const addBanner = async (data: {
  type: "text" | "image";
  title?: string;
  body?: string;
  imageFile?: File;
}): Promise<void> => {
  const form = new FormData();
  form.append("type", data.type);
  if (data.type === "text") {
    if (!data.title || !data.body) {
      throw new Error("title and body are required for text banners");
    }
    form.append("title", data.title);
    form.append("body", data.body);
  } else {
    if (!data.imageFile) {
      throw new Error("imageFile is required for image banners");
    }
    form.append("image", data.imageFile);
  }

  await api.post("/banner/add-banner", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UpdateBanner = async (bannertId, data: {
  type: "text" | "image";
  title?: string;
  body?: string;
  imageFile?: File;
}): Promise<void> => {
  const form = new FormData();
  form.append("type", data.type);
  if (data.type === "text") {
    if (!data.title || !data.body) {
      throw new Error("title and body are required for text banners");
    }
    form.append("title", data.title);
    form.append("body", data.body);
  } else {
    if (!data.imageFile) {
      throw new Error("imageFile is required for image banners");
    }
    form.append("image", data.imageFile);
  }

  await api.put(`/banner/update-banner?bannerid=${bannertId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
