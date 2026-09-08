import { Bot, LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currentUser, logout } from "../services/authService";
import type { UserInfo } from "../types/auth";

const links = [["/", "Trang chủ"], ["/products", "Sản phẩm"], ["/explore", "Khám phá"], ["/blog", "Góc xanh"], ["/policies", "Chính sách"]];
export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(() => currentUser());
  const { count } = useCart();
  useEffect(() => { const sync = () => setUser(currentUser()); window.addEventListener("auth-changed", sync); return () => window.removeEventListener("auth-changed", sync); }, []);
  return <header className="site-header">
    <div className="announcement">Miễn phí tư vấn chăm sóc terrarium 🌿</div>
    <div className="header-inner container">
      <Link to="/" className="brand"><img src="/logo.png" alt="Tiệm Rêu" /><span>TIỆM RÊU<small>Terrarium & Décor</small></span></Link>
      <nav className={open ? "nav open" : "nav"}>
        {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
        {user?.role === "ADMIN" && <NavLink to="/admin">Quản trị</NavLink>}
      </nav>
      <div className="header-actions">
        <Link to="/consult" className="icon-button" title="Trợ lý Tiệm Rêu"><Bot size={20} /></Link>
        <Link to="/cart" className="icon-button badge-wrap" title="Giỏ hàng"><ShoppingBag size={20} />{count > 0 && <b>{count}</b>}</Link>
        {user ? <>
          <Link to="/profile" className="icon-button" title={user.name}><User size={20} /></Link>
          <button className="icon-button ghost" title="Đăng xuất" onClick={() => { logout(); location.href = "/"; }}><LogOut size={20} /></button>
        </> : <Link to="/login" className="login-link"><User size={17} /> Đăng nhập</Link>}
        <button className="menu-button" onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>
  </header>;
}
