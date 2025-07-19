import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://31.97.53.214:3000/api/app/v1",
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

export interface City {
  id: string;
  name: string;
}

export interface Province {
  id: string;
  name: string;
  cities: City[];
}

export interface ProvinceResponse {
  status: boolean;
  message: string;
  data: Province[];
}

export const fetchProvincesWithCities = async (): Promise<Province[]> => {
  const { data } = await api.get<ProvinceResponse>("/cities/provinces-with-cities");
  return data.data;
};
