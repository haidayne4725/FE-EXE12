import { BookOpen, Boxes, FileText, LayoutDashboard, PackageCheck, Percent, Sparkles, Star, ArrowLeft, LogOut } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { logout } from "../services/authService";

const links = [
  ["/admin", "Tổng Quan Studio", LayoutDashboard],
  ["/admin/products", "Quản Lý Sản Phẩm", Boxes],
  ["/admin/categories", "Danh Mục Terrarium", FileText],
  ["/admin/orders", "Xử Lý Đơn Hàng", PackageCheck],
  ["/admin/vouchers", "Mã Giảm Giá & Voucher", Percent],
  ["/admin/reviews", "Duyệt Đánh Giá", Star],
  ["/admin/content", "Blog & Chính Sách", BookOpen],
  ["/admin/rag", "RAG / Knowledge AI", Sparkles],
] as const;

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand" style={{ display: "block", textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "var(--font-family-logo)",
              fontSize: "2.4rem",
              color: "#ffffff",
              lineHeight: "1",
              display: "block",
            }}
          >
            Greenify
          </span>
          <small style={{ display: "block", color: "rgba(255, 255, 255, 0.65)", fontSize: "0.65rem", letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase", marginTop: "4px" }}>
            STUDIO ADMIN SUITE
          </small>
        </Link>

        <nav className="admin-nav">
          {links.map(([to, label, Icon]) => (
            <NavLink to={to} end={to === "/admin"} key={to} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link to="/" className="button outline" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)", padding: "0.5rem", fontSize: "0.85rem", justifyContent: "flex-start" }}>
            <ArrowLeft size={16} /> Quay Về Storefront
          </Link>
          <button
            type="button"
            className="button ghost"
            style={{ color: "#FF9999", padding: "0.5rem", fontSize: "0.85rem", justifyContent: "flex-start" }}
            onClick={() => {
              logout();
              location.href = "/";
            }}
          >
            <LogOut size={16} /> Đăng Xuất Admin
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
