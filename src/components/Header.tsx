import { Search, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { currentUser, logout } from "../services/authService";
import type { UserInfo } from "../types/auth";

export function Header() {
  const [user, setUser] = useState<UserInfo | null>(() => currentUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setUser(currentUser());
    window.addEventListener("auth-changed", sync);
    return () => window.removeEventListener("auth-changed", sync);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="greenify-site-header-clean">
      <div className="header-container-clean">
        {/* BRAND LOGO */}
        <Link to="/" className="greenify-logo-clean">
          greenify
        </Link>

        {/* CENTER NAV PILL */}
        <nav className="greenify-nav-pill">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Trang chủ
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Sản Phẩm
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Blog
          </NavLink>
          <NavLink to="/policies" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Chính sách
          </NavLink>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="header-right-actions">
          {/* SEARCH BUTTON */}
          <button
            type="button"
            className="search-icon-circle"
            title="Tìm kiếm"
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <Search size={20} />
          </button>

          {/* USER ACCOUNT PILL */}
          {user ? (
            <div className="user-dropdown-wrap">
              <button
                type="button"
                className="user-pill-btn-clean"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="user-avatar-badge">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-name-text">{user.name}</span>
                <ChevronDown size={14} />
              </button>

              {menuOpen && (
                <div className="user-dropdown-menu">
                  {user.role === "ADMIN" && (
                    <Link to="/admin" className="dropdown-item admin" onClick={() => setMenuOpen(false)}>
                      <Sparkles size={16} /> Trang Quản Trị (Admin)
                    </Link>
                  )}
                  <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    Hồ sơ cá nhân
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    Đơn hàng của tôi
                  </Link>
                  <button
                    type="button"
                    className="dropdown-item logout"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      window.location.href = "/";
                    }}
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-pill-btn">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* OVERLAY SEARCH BAR */}
      {searchOpen && (
        <div className="header-search-modal container">
          <form onSubmit={handleSearchSubmit} className="search-form-row">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm terrarium, cây cảnh, phụ kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-submit-btn">Tìm kiếm</button>
          </form>
        </div>
      )}
    </header>
  );
}
