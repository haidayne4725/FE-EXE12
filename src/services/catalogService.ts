import api from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Category, ExploreData, Product, ProductPage } from "../types/catalog";

export async function getCategories(includeInactive = false) { const { data } = await api.get<ApiResponse<Category[]>>("/api/categories", { params: { includeInactive } }); return data.result; }
export async function getProducts(params: Record<string, unknown> = {}) { const { data } = await api.get<ApiResponse<ProductPage>>("/api/products", { params }); return data.result; }
export async function getProduct(slug: string) { const { data } = await api.get<ApiResponse<Product>>(`/api/products/slug/${slug}`); return data.result; }
export async function getProductById(id: string) { const { data } = await api.get<ApiResponse<Product>>(`/api/products/${id}`); return data.result; }
export async function getExplore() { const { data } = await api.get<ApiResponse<ExploreData>>("/api/explore"); return data.result; }
export async function toggleVote(id: string) { const { data } = await api.post<ApiResponse<Product>>(`/api/products/${id}/vote`); return data.result; }
export async function saveProduct(payload: unknown, id?: string) { const { data } = id ? await api.put<ApiResponse<Product>>(`/api/products/${id}`, payload) : await api.post<ApiResponse<Product>>("/api/products", payload); return data.result; }
export async function deleteProduct(id: string) { await api.delete(`/api/products/${id}`); }
export async function saveCategory(payload: unknown, id?: string) { const { data } = id ? await api.put<ApiResponse<Category>>(`/api/categories/${id}`, payload) : await api.post<ApiResponse<Category>>("/api/categories", payload); return data.result; }
export async function deleteCategory(id: string) { await api.delete(`/api/categories/${id}`); }
