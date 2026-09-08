import api from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { BlogComment, BlogLike, BlogPost, BlogReply, Policy } from "../types/content";

export async function getBlogs(admin = false) { const { data } = await api.get<ApiResponse<BlogPost[]>>(admin ? "/api/admin/blog" : "/api/blog"); return data.result; }
export async function getBlog(slug: string) { const { data } = await api.get<ApiResponse<BlogPost>>(`/api/blog/${slug}`); return data.result; }
export async function getBlogLikes(slug: string) { const { data } = await api.get<ApiResponse<BlogLike>>(`/api/blog/${slug}/like`); return data.result; }
export async function toggleBlogLike(slug: string) { const { data } = await api.post<ApiResponse<BlogLike>>(`/api/blog/${slug}/like`); return data.result; }
export async function getBlogComments(slug: string) { const { data } = await api.get<ApiResponse<BlogComment[]>>(`/api/blog/${slug}/comments`); return data.result; }
export async function addBlogComment(slug: string, content: string) { const { data } = await api.post<ApiResponse<BlogComment>>(`/api/blog/${slug}/comments`, { content }); return data.result; }
export async function addBlogReply(commentId: string, content: string) { const { data } = await api.post<ApiResponse<BlogReply>>(`/api/blog/comments/${commentId}/replies`, { content }); return data.result; }
export async function getPolicies(admin = false) { const { data } = await api.get<ApiResponse<Policy[]>>(admin ? "/api/admin/policies" : "/api/policies"); return data.result; }
export async function saveBlog(payload: unknown, id?: string) { const { data } = id ? await api.put<ApiResponse<BlogPost>>(`/api/admin/blog/${id}`, payload) : await api.post<ApiResponse<BlogPost>>("/api/admin/blog", payload); return data.result; }
export async function savePolicy(payload: unknown, id?: string) { const { data } = id ? await api.put<ApiResponse<Policy>>(`/api/admin/policies/${id}`, payload) : await api.post<ApiResponse<Policy>>("/api/admin/policies", payload); return data.result; }
