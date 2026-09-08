import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types/api";
import type { AuthResponse } from "../types/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token && !config.headers.has("Authorization")) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const request = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
  const refreshToken = localStorage.getItem("refreshToken");
  const isRefresh = request?.url?.includes("/api/auth/refresh");
  if (error.response?.status === 401 && request && !request._retry && refreshToken && !isRefresh) {
    request._retry = true;
    try {
      const response = await axios.post<ApiResponse<AuthResponse>>(`${api.defaults.baseURL}/api/auth/refresh`, { refreshToken });
      storeAuth(response.data.result);
      request.headers.set("Authorization", `Bearer ${response.data.result.accessToken}`);
      return api(request);
    } catch {
      clearAuth();
      if (!location.pathname.startsWith("/login")) location.href = "/login";
    }
  }
  return Promise.reject(error);
});

export function storeAuth(auth: AuthResponse) {
  localStorage.setItem("accessToken", auth.accessToken);
  localStorage.setItem("refreshToken", auth.refreshToken);
  localStorage.setItem("currentUser", JSON.stringify(auth.user));
  window.dispatchEvent(new Event("auth-changed"));
}
export function clearAuth() {
  localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); localStorage.removeItem("currentUser");
  window.dispatchEvent(new Event("auth-changed"));
}
export function getApiMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as { message?: string; error?: string } | undefined;
    return body?.message || body?.error || error.message;
  }
  return error instanceof Error ? error.message : "Đã có lỗi xảy ra";
}
export default api;
