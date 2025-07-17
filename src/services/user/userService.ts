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

export const getUnsubscribedUsers = async (): Promise<User[]> => {
  const { data } = await api.get<{
    status: boolean;
    message: string;
    data: { users: User[] };
  }>("/users/get-filtered-users", {
    params: { hasSubscription: false },
  });
  return data.data.users;
};
