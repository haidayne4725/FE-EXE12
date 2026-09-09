import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types/api";
import type { AuthResponse } from "../types/auth";
import { handleMockRequest } from "../mock/mockService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token && !config.headers.has("Authorization")) config.headers.set("Authorization", `Bearer ${token}`);

  const url = config.url || "";
  const method = config.method || "get";
  let data: any = undefined;
  if (config.data) {
    try {
      data = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    } catch {
      data = config.data;
    }
  }

  const mockResult = handleMockRequest(url, method, data, config.params);
  if (mockResult) {
    config.adapter = async () => ({
      data: mockResult,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  }

  return config;
});

api.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const request = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
  const url = request?.url || "";
  const method = request?.method || "get";
  let data: any = undefined;
  if (request?.data) {
    try {
      data = typeof request.data === "string" ? JSON.parse(request.data) : request.data;
    } catch {
      data = request.data;
    }
  }

  const token = localStorage.getItem("accessToken");
  const isMockToken = token?.startsWith("mock-");
  const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.code === "ECONNABORTED" || (error.response.status >= 500) || error.response.status === 404;

  if (isMockToken || isNetworkError) {
    const mockResult = handleMockRequest(url, method, data, request?.params);
    if (mockResult) {
      return {
        data: mockResult,
        status: 200,
        statusText: "OK",
        headers: {},
        config: request!,
      };
    }
  }

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

