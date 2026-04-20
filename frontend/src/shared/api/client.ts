import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { ENV } from "@/shared/config/env";
import {
  clearStoredAuth,
  getAccessToken,
  getRefreshToken,
  getRoleFromAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../lib/auth";

type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const isAuthEndpoint = (url?: string) => {
  return url?.includes("/auth/login") || url?.includes("/auth/refresh");
};

const refreshClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

const redirectToLogin = () => {
  localStorage.removeItem("role");
  clearStoredAuth();

  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    redirectToLogin();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshResponse>("/auth/refresh", {
        refresh_token: refreshToken,
      })
      .then(({ data }) => {
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);

        const role = getRoleFromAccessToken(data.access_token);
        if (role) {
          localStorage.setItem("role", role);
        }

        return data.access_token;
      })
      .catch(() => {
        redirectToLogin();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token && !isAuthEndpoint(config.url)) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      !originalRequest ||
      originalRequest._retry ||
      error.response?.status !== 401 ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
    originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);

    return apiClient(originalRequest);
  }
);
