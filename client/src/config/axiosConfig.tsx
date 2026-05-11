import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getStoredAuth, removeStoredAuth } from "../utils/storage";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3015";

const axiosConfig = axios.create({
  baseURL: API_URL,
});

const isTokenExpired = (expiresAt: number): boolean =>
  Date.now() >= (expiresAt - 30) * 1000;

const getAccessToken = async (): Promise<string | null> => {
  const auth = getStoredAuth();
  if (!auth) return null;

  const { session } = auth;

  if (!session.expires_at || !isTokenExpired(session.expires_at)) {
    return session.access_token;
  }

  removeStoredAuth();
  globalThis.location.href = "/";
  throw new Error("Session expired");
};

const attachAuth = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  const token = await getAccessToken();

  if (token) {
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
};

const extractErrorMessage = (error: unknown) => {
  const message: string =
    (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message ?? "Ocurrio un error inesperado";

  return Promise.reject(new Error(message));
};

axiosConfig.interceptors.request.use((config) => attachAuth(config));
axiosConfig.interceptors.response.use((response) => response, extractErrorMessage);

export default axiosConfig;
