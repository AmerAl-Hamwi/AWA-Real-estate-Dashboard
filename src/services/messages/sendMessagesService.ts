import axios, { AxiosError } from "axios";

export interface BroadcastPayload {
  title: string;
  body: string;
}

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

export async function sendBroadcastMessage(
  payload: BroadcastPayload,
): Promise<void> {
  await api.post(
    `/message/send-sms`,
    payload,
  );
}