import api, { clearAuth, storeAuth } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { AuthResponse, LoginRequest, PasswordResetResponse, RegisterRequest, UserInfo } from "../types/auth";

export async function login(body: LoginRequest) {
  try {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/api/auth/login", body); 
    storeAuth(data.result); 
    return data.result;
  } catch {
    // Demo fallback login
    const user: UserInfo = body.email.includes("admin")
      ? { id: "usr_admin_1", email: body.email, name: "Quản trị viên Greenify", role: "ADMIN", loyaltyPoints: 850, loyaltyTier: "PLATINUM" }
      : { id: "usr_cust_1", email: body.email, name: "Nguyễn Văn A", role: "CUSTOMER", loyaltyPoints: 240, loyaltyTier: "SILVER" };
    const authResult: AuthResponse = { accessToken: "demo-token", refreshToken: "demo-token", expiresIn: 3600, user };
    storeAuth(authResult);
    return authResult;
  }
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

export function demoCustomer() {
  const user: UserInfo = { id: "usr_cust_1", email: "customer@tiemreu.vn", name: "Nguyễn Văn A", role: "CUSTOMER", loyaltyPoints: 240, loyaltyTier: "SILVER" };
  const authResult: AuthResponse = { accessToken: "demo-cust-token", refreshToken: "demo-token", expiresIn: 3600, user };
  storeAuth(authResult);
  window.dispatchEvent(new Event("auth-changed"));
  return user;
}

export function demoAdmin() {
  const user: UserInfo = { id: "usr_admin_1", email: "admin@tiemreu.vn", name: "Quản trị viên Greenify", role: "ADMIN", loyaltyPoints: 850, loyaltyTier: "PLATINUM" };
  const authResult: AuthResponse = { accessToken: "demo-admin-token", refreshToken: "demo-token", expiresIn: 3600, user };
  storeAuth(authResult);
  window.dispatchEvent(new Event("auth-changed"));
  return user;
}
