import axios from "axios";
import { createContext, createElement, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getStoredAuth, removeStoredAuth } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1703";

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
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

const extractErrorMessage = (error: unknown): never => {
  const message: string =
    (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message ?? "Ocurrió un error inesperado";
  return Promise.reject(new Error(message)) as never;
};

const AxiosContext = createContext<AxiosInstance | null>(null);

axiosConfig.interceptors.request.use((config) => attachAuth(config));

export default axiosConfig;

export const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const instance = useMemo(() => {
    const baseURL = API_URL;
    const inst = axios.create({ baseURL });

    inst.interceptors.request.use((config) => attachAuth(config));
    inst.interceptors.response.use((response) => response, extractErrorMessage);

    return inst;
  }, []);

  return createElement(AxiosContext.Provider, { value: instance }, children);
};

export const useAxios = () => {
  const ctx = useContext(AxiosContext);
  return ctx ?? axiosConfig;
};
