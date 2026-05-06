import type { AuthData } from "../types/authData";

const STORAGE_KEY = "auth";

export const getStoredAuth = (): AuthData | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as AuthData) : null;
};

export const setStoredAuth = (auth: AuthData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

export const removeStoredAuth = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
