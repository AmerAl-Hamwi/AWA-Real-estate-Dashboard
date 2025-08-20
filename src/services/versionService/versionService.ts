import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://31.97.53.214:3000/api/admin/v1",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
    if (s === 407 || s === 405) {
      localStorage.clear();
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export type Platform = "android" | "ios";

export interface ReleaseVersion {
  id: string;
  platform: Platform;
  latestVersion: string;
  forceUpdate: boolean;
  downloadUrl?: string;
  releaseNotes?: string | { en?: string; ar?: string };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertVersionInput {
  platform: Platform;
  latestVersion: string;
  forceUpdate: boolean;
  isActive: boolean;
  downloadUrl?: string;
  releaseNotesEn?: string;
  releaseNotesAr?: string;
}

export async function fetchVersions(): Promise<ReleaseVersion[]> {
  const { data } = await api.get("/version");
  return Array.isArray(data?.data) ? data.data : data?.data?.versions ?? [];
}

// Post EXACT keys expected by backend, with string booleans
export async function upsertVersion(payload: UpsertVersionInput): Promise<ReleaseVersion> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: Record<string, any> = {
    platform: payload.platform,
    latestVersion: payload.latestVersion,
    forceUpdate: String(payload.forceUpdate),
    isActive: String(payload.isActive),
    downloadUrl: payload.downloadUrl?.trim() || "false",
    "releaseNotes[en]": payload.releaseNotesEn ?? "",
    "releaseNotes[ar]": payload.releaseNotesAr ?? "",
  };

  const { data } = await api.post("/version", body);
  return data?.data ?? data;
}

export async function deleteVersion(platform: string): Promise<void> {
  await api.delete(`/version/${platform}`);
}
