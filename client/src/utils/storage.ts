import type { AuthData } from "../types/authData";

const STORAGE_KEY = "auth";
const SESSION_EXPIRY_BUFFER_SECONDS = 30;

export type StoredUserRole = "consumer" | "entrepreneur";

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

export const getStoredRole = (): StoredUserRole | null => {
  const role = getStoredAuth()?.user.user_metadata?.role;

  return role === "consumer" || role === "entrepreneur" ? role : null;
};

export const isStoredSessionValid = (auth: AuthData | null = getStoredAuth()): boolean => {
  if (!auth?.session.access_token) {
    return false;
  }

  const expiresAt = auth.session.expires_at;

  if (!expiresAt) {
    return true;
  }

  return Date.now() < (expiresAt - SESSION_EXPIRY_BUFFER_SECONDS) * 1000;
};

export const getDefaultRouteForRole = (role: StoredUserRole | null): string => {
  if (role === "entrepreneur") {
    return "/entrepreneur/home";
  }

  if (role === "consumer") {
    return "/consumer/home";
  }

  return "/";
};
