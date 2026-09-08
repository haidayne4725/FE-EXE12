import api from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { CareItem, Order, Review, VoucherValidation } from "../types/commerce";
import type { Product } from "../types/catalog";

export async function validateVoucher(code: string, cartItems: { productId: string; quantity: number; variants: Record<string, string> }[]) { const { data } = await api.post<ApiResponse<VoucherValidation>>("/api/vouchers/validate", { code, cartItems }); return data.result; }
export async function createOrder(payload: unknown) { const { data } = await api.post<ApiResponse<Order>>("/api/orders", payload); return data.result; }
export async function getOrders() { const { data } = await api.get<ApiResponse<Order[]>>("/api/orders"); return data.result; }
export async function getOrder(id: string, orderNumber?: string) { const { data } = await api.get<ApiResponse<Order>>(`/api/orders/${id}`, { params: { orderNumber } }); return data.result; }
export async function cancelOrder(id: string) { const { data } = await api.post<ApiResponse<Order>>(`/api/orders/${id}/cancel`); return data.result; }
export async function getReviews(productId?: string, status?: string) { const { data } = await api.get<ApiResponse<Review[]>>("/api/reviews", { params: { productId, status } }); return data.result; }
export async function createReview(payload: unknown) { const { data } = await api.post<ApiResponse<Review>>("/api/reviews", payload); return data.result; }
export async function getFavorites() { const { data } = await api.get<ApiResponse<Product[]>>("/api/profile/favorites"); return data.result; }
export async function toggleFavorite(id: string) { const { data } = await api.post<ApiResponse<{ favorite: boolean }>>(`/api/profile/favorites/${id}`); return data.result.favorite; }
export async function getCareItems() { const { data } = await api.get<ApiResponse<CareItem[]>>("/api/profile/care-items"); return data.result; }
export async function updateCare(id: string, action: string) { const { data } = await api.patch<ApiResponse<CareItem>>(`/api/profile/care-items/${id}`, { action }); return data.result; }
