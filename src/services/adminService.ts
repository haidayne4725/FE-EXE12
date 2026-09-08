import api from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Order, Review } from "../types/commerce";

export interface Dashboard { products: number; categories: number; customers: number; orders: number; pendingReviews: number; lowStockProducts: number; revenue: number }
export interface Campaign { id: string; code: string; type: string; value: number; minOrderAmount?: number; maxDiscountAmount?: number; startsAt: string; expiresAt: string; usageLimit?: number; usageCount: number; status: string; applicableTo: string; description?: string }
export async function dashboard() { const { data } = await api.get<ApiResponse<Dashboard>>("/api/admin/stats"); return data.result; }
export async function orders() { const { data } = await api.get<ApiResponse<Order[]>>("/api/admin/orders"); return data.result; }
export async function updateOrderStatus(id: string, status: string) { const { data } = await api.patch<ApiResponse<Order>>(`/api/admin/orders/${id}/status`, { status }); return data.result; }
export async function reviews(status = "PENDING") { const { data } = await api.get<ApiResponse<Review[]>>("/api/reviews", { params: { status } }); return data.result; }
export async function moderateReview(id: string, approved: boolean) { const { data } = await api.patch<ApiResponse<Review>>(`/api/reviews/${id}/moderation`, { approved }); return data.result; }
export async function campaigns() { const { data } = await api.get<ApiResponse<Campaign[]>>("/api/discount-campaigns"); return data.result; }
export async function saveCampaign(payload: unknown, id?: string) { const { data } = id ? await api.put<ApiResponse<Campaign>>(`/api/discount-campaigns/${id}`, payload) : await api.post<ApiResponse<Campaign>>("/api/discount-campaigns", payload); return data.result; }
