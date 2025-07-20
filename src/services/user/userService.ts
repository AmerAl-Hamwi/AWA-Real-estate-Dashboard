import axios from "axios";
import { User } from "@/types/user";

const api = axios.create({
  baseURL: "http://31.97.53.214:3000/api/admin/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("authToken");
  if (t && cfg.headers) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const getFilteredUsers = async (
  page: number,
  limit: number,
  hasSubscription?: boolean
): Promise<{ users: User[]; total: number }> => {
  const { data } = await api.get("/users/get-filtered-users", {
    params: {
      page,
      limit,
      ...(hasSubscription !== undefined && { hasSubscription }),
    },
  });

  return {
    users: data.data.users,
    total: data.data.pagination.totalUsers,
  };
};




export const registerManualUser = async (payload: {
  name: string;
  email: string;
  number: string;
  provinceId: string;
  cityId: string;
  userType: string;
  subscriptionAmount: string;
}): Promise<void> => {
  await api.post("/users/manual-register-user", payload);
};
