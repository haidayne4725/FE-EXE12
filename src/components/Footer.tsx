import { Facebook, Instagram, Mail, MapPin, Phone, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() { return <footer className="site-footer"><div className="container footer-grid">
  <div><h3><Sprout size={20} /> Tiệm Rêu</h3><p>Mang một khu rừng nhỏ vào không gian sống của bạn.</p><div className="socials"><Facebook /><Instagram /></div></div>
  <div><h4>Khám phá</h4><Link to="/products">Sản phẩm</Link><Link to="/explore">Bộ sưu tập</Link><Link to="/blog">Góc xanh</Link></div>
  <div><h4>Hỗ trợ</h4><Link to="/policies">Chính sách</Link><Link to="/consult">Tư vấn chăm sóc</Link><Link to="/orders">Tra cứu đơn</Link></div>
  <div><h4>Liên hệ</h4><p><MapPin size={16} /> TP. Hồ Chí Minh</p><p><Phone size={16} /> 0900 000 001</p><p><Mail size={16} /> hello@tiemreu.vn</p></div>
  </div><div className="copyright">© 2026 Tiệm Rêu. Nuôi dưỡng những mảng xanh nhỏ.</div></footer>; }
