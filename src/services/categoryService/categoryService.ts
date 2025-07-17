import axios, { AxiosError } from "axios";
import { CategoriesResponse } from "@/types/category";

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

export const fetchCategories = async (
): Promise<CategoriesResponse> => {
  const { data } = await api.get<CategoriesResponse>(
    `/category/get-all-categories`
  );
  return data;
};

export const deleteCategory = async (categoryId: string) => {
  await api.delete(`/category/delete-category?categoryId=${categoryId}`);
};

export const addCategory = async (formData: FormData) => {
  await api.post(`/category/add-category`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateCategory = async (id: string, formData: FormData) => {
  await api.put(`/category/update-category?categoryId=${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};