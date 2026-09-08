import api from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Knowledge, RagChatResponse, RagDocument, RagIndexStatus } from "../types/rag";

export async function chat(message: string, topK = 5) { const { data } = await api.post<ApiResponse<RagChatResponse>>("/api/rag/chat", { message, topK }); return data.result; }
export async function recommend(productId: string) { const { data } = await api.post<ApiResponse<RagChatResponse>>(`/api/rag/recommend/${productId}`); return data.result; }
export async function reindex() { const { data } = await api.post<ApiResponse<RagIndexStatus>>("/api/rag/reindex"); return data.result; }
export async function documents() { const { data } = await api.get<ApiResponse<RagDocument[]>>("/api/rag/documents"); return data.result; }
export async function knowledge() { const { data } = await api.get<ApiResponse<Knowledge[]>>("/api/rag/knowledge"); return data.result; }
export async function saveKnowledge(payload: Omit<Knowledge, "id">, id?: string) { const { data } = id ? await api.put<ApiResponse<Knowledge>>(`/api/rag/knowledge/${id}`, payload) : await api.post<ApiResponse<Knowledge>>("/api/rag/knowledge", payload); return data.result; }
export async function deleteKnowledge(id: string) { await api.delete(`/api/rag/knowledge/${id}`); }
