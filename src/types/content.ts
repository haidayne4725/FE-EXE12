export interface BlogPost { id: string; slug: string; title: string; content?: string; thumbnail?: string; intro?: string; published: boolean; publishedAt?: string; category?: string; createdAt: string }
export interface BlogUser { id: string; name: string; role: string }
export interface BlogReply { id: string; content: string; user: BlogUser; adminReply: boolean; createdAt: string }
export interface BlogComment { id: string; content: string; customer: BlogUser; replies: BlogReply[]; createdAt: string }
export interface BlogLike { likesCount: number; liked: boolean }
export interface Policy { id: string; slug: string; title: string; content: string; type: string; sortOrder: number; active: boolean }
