import initialMockData from "./mockData.json";
import type { ApiResponse } from "../types/api";
import type { UserInfo } from "../types/auth";
import type { Category, Product } from "../types/catalog";
import type { Order, Review } from "../types/commerce";
import type { BlogPost, Policy } from "../types/content";
import type { Knowledge, RagDocument } from "../types/rag";

const STORAGE_KEY = "tiemreu_mock_db_v1";

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load mock storage", e);
  }
  saveDb(initialMockData);
  return initialMockData;
}

function saveDb(db: unknown) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to save mock storage", e);
  }
}

export function handleMockRequest(url: string, method: string, data?: any, params?: any): ApiResponse<any> | null {
  const db = loadDb();
  const cleanUrl = url.split("?")[0];
  const reqMethod = method.toUpperCase();

  const wrap = <T>(result: T, message = "Thao tác thành công"): ApiResponse<T> => ({
    code: 200,
    message,
    result,
    path: cleanUrl,
    timestamp: new Date().toISOString(),
  });

  // 1. AUTH
  if (cleanUrl === "/api/auth/login") {
    const email = data?.email || "";
    const isAdmin = email.includes("admin") || email.startsWith("admin@");
    const user: UserInfo = isAdmin
      ? db.users.find((u: UserInfo) => u.role === "ADMIN") || db.users[0]
      : db.users.find((u: UserInfo) => u.role === "CUSTOMER") || db.users[1];

    return wrap({
      accessToken: "mock-access-token-admin-12345",
      refreshToken: "mock-refresh-token-admin-12345",
      expiresIn: 86400,
      user,
    }, "Đăng nhập thành công (Mock)");
  }

  if (cleanUrl === "/api/auth/register") {
    const newUser: UserInfo = {
      id: "usr_" + Date.now(),
      email: data?.email || "newuser@example.com",
      name: data?.name || "Người dùng mới",
      phone: data?.phone || "",
      role: "CUSTOMER",
      loyaltyPoints: 0,
      loyaltyTier: "BRONZE",
    };
    db.users.push(newUser);
    saveDb(db);
    return wrap({
      accessToken: "mock-access-token-" + newUser.id,
      refreshToken: "mock-refresh-token-" + newUser.id,
      expiresIn: 86400,
      user: newUser,
    }, "Đăng ký tài khoản thành công (Mock)");
  }

  if (cleanUrl === "/api/auth/forgot-password") {
    return wrap({
      message: "Liên kết khôi phục đã được gửi (Mock)",
      developmentToken: "mock-dev-token-999",
    });
  }

  if (cleanUrl === "/api/auth/reset-password") {
    return wrap({ message: "Mật khẩu đã được đặt lại thành công (Mock)" });
  }

  if (cleanUrl === "/api/auth/me" || cleanUrl === "/api/auth/refresh") {
    const currentUserRaw = localStorage.getItem("currentUser");
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : db.users[0];
    if (cleanUrl === "/api/auth/refresh") {
      return wrap({
        accessToken: "mock-refreshed-access-token",
        refreshToken: "mock-refreshed-refresh-token",
        expiresIn: 86400,
        user: currentUser,
      });
    }
    return wrap(currentUser);
  }

  // 2. ADMIN STATS
  if (cleanUrl === "/api/admin/stats" && reqMethod === "GET") {
    const productsCount = db.products.length;
    const categoriesCount = db.categories.length;
    const ordersCount = db.orders.length;
    const pendingReviewsCount = db.reviews.filter((r: Review) => !r.approved).length;
    const lowStockCount = db.products.filter((p: Product) => p.inventory <= 3).length;
    const totalRevenue = db.orders
      .filter((o: Order) => o.paymentStatus === "PAID" || o.status === "DELIVERED")
      .reduce((sum: number, o: Order) => sum + (o.total || 0), 0);

    return wrap({
      products: productsCount,
      categories: categoriesCount,
      customers: db.users.length + 16,
      orders: ordersCount,
      pendingReviews: pendingReviewsCount,
      lowStockProducts: lowStockCount,
      revenue: totalRevenue || db.stats.revenue,
    });
  }

  // 3. ADMIN ORDERS & STATUS
  if (cleanUrl === "/api/admin/orders" && reqMethod === "GET") {
    return wrap(db.orders);
  }
  if (cleanUrl.match(/^\/api\/admin\/orders\/[^/]+\/status$/) && reqMethod === "PATCH") {
    const id = cleanUrl.split("/")[4];
    const newStatus = data?.status || "CONFIRMED";
    const order = db.orders.find((o: Order) => o.id === id);
    if (order) {
      order.status = newStatus;
      order.statusLogs = [...(order.statusLogs || []), `${new Date().toISOString()} - ${newStatus}`];
      order.updatedAt = new Date().toISOString();
      saveDb(db);
      return wrap(order);
    }
  }

  // 4. CATEGORIES
  if (cleanUrl === "/api/categories" && reqMethod === "GET") {
    return wrap(db.categories);
  }
  if (cleanUrl === "/api/categories" && reqMethod === "POST") {
    const newCat: Category = {
      id: "cat_" + Date.now(),
      slug: data?.slug || "danh-muc-moi",
      name: data?.name || "Danh mục mới",
      status: data?.status || "ACTIVE",
      sortOrder: Number(data?.sortOrder || db.categories.length + 1),
    };
    db.categories.push(newCat);
    saveDb(db);
    return wrap(newCat);
  }
  if (cleanUrl.startsWith("/api/categories/") && reqMethod === "PUT") {
    const id = cleanUrl.split("/")[3];
    const cat = db.categories.find((c: Category) => c.id === id);
    if (cat) {
      Object.assign(cat, data);
      saveDb(db);
      return wrap(cat);
    }
  }
  if (cleanUrl.startsWith("/api/categories/") && reqMethod === "DELETE") {
    const id = cleanUrl.split("/")[3];
    db.categories = db.categories.filter((c: Category) => c.id !== id);
    saveDb(db);
    return wrap(true);
  }

  // 5. PRODUCTS
  if (cleanUrl === "/api/products" && reqMethod === "GET") {
    let list: Product[] = db.products;
    if (params?.categoryId) {
      list = list.filter((p: Product) => p.categoryId === params.categoryId);
    }
    return wrap({
      products: list,
      page: 1,
      limit: 100,
      total: list.length,
      totalPages: 1,
    });
  }
  if (cleanUrl.startsWith("/api/products/slug/") && reqMethod === "GET") {
    const slug = cleanUrl.split("/")[4];
    const p = db.products.find((item: Product) => item.slug === slug) || db.products[0];
    return wrap(p);
  }
  if (cleanUrl.startsWith("/api/products/") && reqMethod === "GET") {
    const id = cleanUrl.split("/")[3];
    const p = db.products.find((item: Product) => item.id === id) || db.products[0];
    return wrap(p);
  }
  if (cleanUrl === "/api/products" && reqMethod === "POST") {
    const cat = db.categories.find((c: Category) => c.id === data?.categoryId);
    const newProd: Product = {
      id: "prod_" + Date.now(),
      slug: data?.slug || "san-pham-moi-" + Date.now(),
      name: data?.name || "Sản phẩm mới",
      description: data?.description || "",
      basePrice: Number(data?.basePrice || 100000),
      salePrice: data?.salePrice ? Number(data.salePrice) : undefined,
      effectivePrice: data?.salePrice ? Number(data.salePrice) : Number(data?.basePrice || 100000),
      type: data?.type || "PRODUCT",
      inventory: Number(data?.inventory || 10),
      featured: false,
      categoryId: data?.categoryId || db.categories[0]?.id || "cat_1",
      categoryName: cat?.name || "Terrarium",
      status: data?.status || "ACTIVE",
      images: data?.images || ["/home-hero-full-banner.png"],
      setupStatus: data?.setupStatus || "READY_TO_DISPLAY",
      careLevel: data?.careLevel || "EASY",
      chatTags: data?.chatTags || [],
      reviewCount: 0,
      voteCount: 0,
      userVoted: false,
      variants: [],
      careGuide: data?.careGuide,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.products.unshift(newProd);
    saveDb(db);
    return wrap(newProd);
  }
  if (cleanUrl.match(/^\/api\/products\/[^/]+$/) && reqMethod === "PUT") {
    const id = cleanUrl.split("/")[3];
    const p = db.products.find((item: Product) => item.id === id);
    if (p) {
      Object.assign(p, data, {
        effectivePrice: data.salePrice ? Number(data.salePrice) : Number(data.basePrice || p.basePrice),
        updatedAt: new Date().toISOString(),
      });
      saveDb(db);
      return wrap(p);
    }
  }
  if (cleanUrl.match(/^\/api\/products\/[^/]+$/) && reqMethod === "DELETE") {
    const id = cleanUrl.split("/")[3];
    db.products = db.products.filter((item: Product) => item.id !== id);
    saveDb(db);
    return wrap(true);
  }
  if (cleanUrl === "/api/explore" && reqMethod === "GET") {
    return wrap({
      featured: db.products.filter((p: Product) => p.featured),
      pinned: db.products.slice(0, 2),
      topVoted: [...db.products].sort((a: Product, b: Product) => b.voteCount - a.voteCount),
      newArrivals: db.products,
    });
  }

  // 6. DISCOUNT CAMPAIGNS / VOUCHERS
  if (cleanUrl === "/api/discount-campaigns" && reqMethod === "GET") {
    return wrap(db.campaigns);
  }
  if (cleanUrl === "/api/discount-campaigns" && reqMethod === "POST") {
    const newCamp = {
      id: "camp_" + Date.now(),
      ...data,
      usageCount: 0,
    };
    db.campaigns.push(newCamp);
    saveDb(db);
    return wrap(newCamp);
  }
  if (cleanUrl.startsWith("/api/discount-campaigns/") && reqMethod === "PUT") {
    const id = cleanUrl.split("/")[3];
    const camp = db.campaigns.find((c: any) => c.id === id);
    if (camp) {
      Object.assign(camp, data);
      saveDb(db);
      return wrap(camp);
    }
  }

  // 7. REVIEWS
  if (cleanUrl === "/api/reviews" && reqMethod === "GET") {
    const statusParam = params?.status;
    let list = db.reviews;
    if (statusParam === "PENDING") {
      list = list.filter((r: Review) => !r.approved);
    }
    return wrap(list);
  }
  if (cleanUrl.match(/^\/api\/reviews\/[^/]+\/moderation$/) && reqMethod === "PATCH") {
    const id = cleanUrl.split("/")[3];
    const approved = Boolean(data?.approved);
    const rev = db.reviews.find((r: Review) => r.id === id);
    if (rev) {
      rev.approved = approved;
      saveDb(db);
      return wrap(rev);
    }
  }

  // 8. BLOG & POLICIES
  if ((cleanUrl === "/api/blog" || cleanUrl === "/api/admin/blog") && reqMethod === "GET") {
    return wrap(db.blogs);
  }
  if (cleanUrl.startsWith("/api/blog/") && reqMethod === "GET") {
    const slug = cleanUrl.split("/")[3];
    const blog = db.blogs.find((b: BlogPost) => b.slug === slug) || db.blogs[0];
    return wrap(blog);
  }
  if (cleanUrl === "/api/admin/blog" && reqMethod === "POST") {
    const newBlog: BlogPost = {
      id: "blog_" + Date.now(),
      slug: data?.slug || "bai-viet-moi-" + Date.now(),
      title: data?.title || "Bài viết mới",
      content: data?.content || "",
      intro: data?.intro || "",
      thumbnail: data?.thumbnail || "/about_us_bg.png",
      published: true,
      category: data?.category || "Chăm sóc",
      createdAt: new Date().toISOString(),
    };
    db.blogs.unshift(newBlog);
    saveDb(db);
    return wrap(newBlog);
  }

  if ((cleanUrl === "/api/policies" || cleanUrl === "/api/admin/policies") && reqMethod === "GET") {
    return wrap(db.policies);
  }
  if (cleanUrl === "/api/admin/policies" && reqMethod === "POST") {
    const newPol: Policy = {
      id: "pol_" + Date.now(),
      slug: data?.slug || "chinh-sach-moi-" + Date.now(),
      title: data?.title || "Chính sách mới",
      content: data?.content || "",
      type: data?.type || "policy",
      sortOrder: Number(data?.sortOrder || db.policies.length + 1),
      active: true,
    };
    db.policies.push(newPol);
    saveDb(db);
    return wrap(newPol);
  }

  // 9. RAG & KNOWLEDGE BASE
  if (cleanUrl === "/api/rag/documents" && reqMethod === "GET") {
    return wrap(db.documents);
  }
  if (cleanUrl === "/api/rag/knowledge" && reqMethod === "GET") {
    return wrap(db.knowledge);
  }
  if (cleanUrl === "/api/rag/knowledge" && reqMethod === "POST") {
    const newKn: Knowledge = {
      id: "kn_" + Date.now(),
      keyword: data?.keyword || "",
      response: data?.response || "",
      category: data?.category || "care_basic",
      priority: Number(data?.priority || 50),
      active: data?.active ?? true,
    };
    db.knowledge.unshift(newKn);

    // Auto-create document chunk for RAG view
    db.documents.unshift({
      id: "doc_" + Date.now(),
      documentKey: `knowledge_${newKn.id}_chunk0`,
      sourceType: "KNOWLEDGE",
      sourceId: newKn.id,
      title: newKn.keyword.slice(0, 30),
      content: newKn.response,
      chunkIndex: 0,
      embedded: true,
    });

    saveDb(db);
    return wrap(newKn);
  }
  if (cleanUrl.startsWith("/api/rag/knowledge/") && reqMethod === "DELETE") {
    const id = cleanUrl.split("/")[4];
    db.knowledge = db.knowledge.filter((k: Knowledge) => k.id !== id);
    saveDb(db);
    return wrap(true);
  }
  if (cleanUrl === "/api/rag/reindex" && reqMethod === "POST") {
    const status = {
      sourceCount: db.products.length + db.policies.length + db.knowledge.length,
      chunkCount: db.documents.length,
      embeddedCount: db.documents.filter((d: RagDocument) => d.embedded).length,
    };
    return wrap(status, "Reindex thành công!");
  }
  if (cleanUrl === "/api/rag/chat" && reqMethod === "POST") {
    const message = data?.message || "";
    const matchedKn = db.knowledge.find((k: Knowledge) => message.toLowerCase().includes(k.keyword.toLowerCase())) || db.knowledge[0];
    return wrap({
      answer: matchedKn ? matchedKn.response : "Rêu Tiệm Rêu cần ánh sáng gián tiếp và độ ẩm từ 70-90%.",
      citations: [
        {
          documentKey: `knowledge_${matchedKn?.id || "kn_1"}`,
          sourceType: "KNOWLEDGE",
          sourceId: matchedKn?.id || "kn_1",
          title: matchedKn?.keyword || "Hỏi đáp Terrarium",
          score: 0.95,
        },
      ],
      mode: "VECTOR_HYBRID",
    });
  }

  // Fallback for unhandled endpoints
  return wrap([], "Mock response default");
}
