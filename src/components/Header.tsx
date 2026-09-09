import { Search, ShoppingBag, User, LogOut, ChevronDown, ShieldCheck, Phone, MapPin, Scissors, Truck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currentUser, logout } from "../services/authService";
import type { UserInfo } from "../types/auth";

export function Header() {
  const [user, setUser] = useState<UserInfo | null>(() => currentUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
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
    <header className="greenify-site-header">
      {/* MAIN TOP HEADER BAR */}
      <div className="greenify-top-header">
        <div className="header-container">
          {/* BRAND LOGO */}
          <Link to="/" className="greenify-logo">
            Greenify
          </Link>

          {/* MAIN NAVIGATION */}
          <nav className="greenify-nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Trang chủ
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Sản Phẩm
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Khám phá
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Blog
            </NavLink>
            <NavLink to="/policies" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Chính sách
            </NavLink>
          </nav>

          {/* RIGHT HEADER ACTIONS */}
          <div className="header-actions">
            {/* SEARCH ICON BUTTON */}
            <button
              type="button"
              className="header-icon-btn"
              title="Tìm kiếm"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Search size={20} />
            </button>

            {/* CART ICON BUTTON */}
            <Link to="/cart" className="header-icon-btn cart-badge-wrap" title="Giỏ hàng">
              <ShoppingBag size={20} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>

            {/* USER PROFILE BUTTON */}
            {user ? (
              <div className="user-dropdown-wrap">
                <button
                  type="button"
                  className="user-pill-btn"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className="user-avatar-circle">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user.name}</span>
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
              <Link to="/login" className="header-icon-btn" title="Đăng nhập">
                <User size={20} />
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
      </div>

      {/* ANNOUNCEMENT SUB BAR BELOW HEADER */}
      <div className="greenify-sub-announcement-bar">
        <div className="announcement-container">
          <div className="sub-bar-item">
            <ShieldCheck size={16} />
            <span>Bảo hành thực vật miễn phí</span>
          </div>
          <span className="bar-divider">|</span>

          <div className="sub-bar-item">
            <Phone size={16} />
            <span>Liên hệ: <strong>0706 668 296</strong></span>
          </div>
          <span className="bar-divider">|</span>

          <div className="sub-bar-item">
            <MapPin size={16} />
            <span>32/16 Tam Đa, TP. Hồ Chí Minh</span>
          </div>
          <span className="bar-divider">|</span>

          <div className="sub-bar-item">
            <Scissors size={16} />
            <span>Thiết kế Terrarium theo yêu cầu</span>
          </div>
          <span className="bar-divider">|</span>

          <div className="sub-bar-item">
            <Truck size={16} />
            <span>Giao hàng toàn quốc</span>
          </div>
        </div>
      </div>
    </header>
  );
}
