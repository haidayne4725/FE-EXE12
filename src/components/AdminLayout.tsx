import { BookOpen, Boxes, FileText, LayoutDashboard, PackageCheck, Percent, ShoppingBag, Sparkles, Star } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

const links = [
  ["/admin", "Tổng quan", LayoutDashboard], ["/admin/products", "Sản phẩm", Boxes], ["/admin/categories", "Danh mục", FileText],
  ["/admin/orders", "Đơn hàng", PackageCheck], ["/admin/vouchers", "Voucher", Percent], ["/admin/reviews", "Đánh giá", Star],
  ["/admin/content", "Nội dung", BookOpen], ["/admin/rag", "RAG / AI", Sparkles],
] as const;
export function AdminLayout() { return <div className="admin-shell"><aside className="admin-sidebar">
  <Link to="/" className="admin-brand"><ShoppingBag /> Tiệm Rêu Admin</Link>
  <nav>{links.map(([to, label, Icon]) => <NavLink to={to} end={to === "/admin"} key={to}><Icon size={18} />{label}</NavLink>)}</nav>
  <Link to="/" className="back-shop">← Về cửa hàng</Link>
  </aside><main className="admin-main"><Outlet /></main></div>; }
