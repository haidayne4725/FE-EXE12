import api, { clearAuth, storeAuth } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { AuthResponse, LoginRequest, PasswordResetResponse, RegisterRequest, UserInfo } from "../types/auth";

export async function login(body: LoginRequest) {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/api/auth/login", body); storeAuth(data.result); return data.result;
}
export async function register(body: RegisterRequest) {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/api/auth/register", body); storeAuth(data.result); return data.result;
}
export async function forgotPassword(email: string) { const { data } = await api.post<ApiResponse<PasswordResetResponse>>("/api/auth/forgot-password", { email }); return data.result; }
export async function resetPassword(token: string, newPassword: string) { const { data } = await api.post<ApiResponse<PasswordResetResponse>>("/api/auth/reset-password", { token, newPassword }); return data.result; }
export async function me() { const { data } = await api.get<ApiResponse<UserInfo>>("/api/auth/me"); return data.result; }
export function logout() { clearAuth(); }
export function currentUser(): UserInfo | null {
  try { const value = localStorage.getItem("currentUser"); return value ? JSON.parse(value) as UserInfo : null; }
  catch { return null; }
}
