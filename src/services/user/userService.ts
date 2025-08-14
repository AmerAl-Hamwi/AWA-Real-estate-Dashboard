/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { User } from "@/types/user";

const api = axios.create({
  baseURL: "http://31.97.53.214:3000/api/admin/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("authToken");
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
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

/**
 * Fetches paginated users, filtered by subscription state.
 */

export const getFilteredUsers = async (
  page: number,
  limit: number,
  hasSubscription?: boolean,
  number?: string,
  signal?: AbortSignal // NEW
): Promise<{ users: User[]; total: number }> => {
  const params: Record<string, any> = { page, limit };
  if (hasSubscription !== undefined) params.hasSubscription = hasSubscription;
  if (number && number.trim()) params.number = number;

  const { data } = await api.get("/users/get-filtered-users", {
    params,
    signal,
  });

  return {
    users: data.data.users,
    total: data.data.pagination.totalUsers,
  };
};

/**
 * Manually register a user.
 */
export const registerManualUser = async (payload: {
  name: string;
  email: string;
  number: string;
  provinceId: string;
  cityId: string;
  userType: string;
  subscriptionAmount: string;
  image?: File;
}): Promise<void> => {
  if (payload.userType === "real estate company" && payload.image) {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("email", payload.email);
    form.append("number", payload.number);
    form.append("provinceId", payload.provinceId);
    form.append("cityId", payload.cityId);
    form.append("userType", payload.userType);
    form.append("subscriptionAmount", payload.subscriptionAmount);
    form.append("image", payload.image);
    await api.post("/users/manual-register-user", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    // Owner or no logo → JSON
    await api.post(
      "/users/manual-register-user",
      {
        name: payload.name,
        email: payload.email,
        number: payload.number,
        provinceId: payload.provinceId,
        cityId: payload.cityId,
        userType: payload.userType,
        subscriptionAmount: payload.subscriptionAmount,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  }
};

export const deleteUserById = async (userId: string): Promise<void> => {
  await api.delete(`/users/delete-user`, {
    params: { userId },
  });
};

/**
 * Grant a subscription to a user.
 */
export const giveSubscription = async (userId: string): Promise<void> => {
  await api.post(
    `/users/give-subscription?userId=${userId}`,
  );
};

/**
 * Cancel a user’s subscription.
 */
export const cancelSubscription = async (userId: string): Promise<void> => {
  await api.delete(`/users/cancel-subscription?userId=${userId}`);
};
