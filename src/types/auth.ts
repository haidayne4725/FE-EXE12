export interface UserInfo {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
  loyaltyPoints: number;
  loyaltyTier: string;
}
export interface AuthResponse { accessToken: string; refreshToken: string; expiresIn: number; user: UserInfo }
export interface PasswordResetResponse { message: string; developmentToken?: string }
export interface LoginRequest { email: string; password: string }
export interface RegisterRequest extends LoginRequest { name: string; phone?: string }
