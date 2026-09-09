import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <>
      <footer className="greenify-site-footer">
        <div className="footer-container">
          {/* COLUMN 1: BRAND LOGO & BIO */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              Greenify
            </Link>
            <p className="footer-bio">
              Terrarium thủ công mang thiên nhiên vào không gian sống của bạn. Mỗi sản phẩm là một hệ sinh thái thu nhỏ, được tạo tính tỉ mỉ.
            </p>
          </div>

          {/* COLUMN 2: KHÁM PHÁ */}
          <div className="footer-col">
            <h4 className="footer-heading">Khám phá</h4>
            <ul className="footer-links">
              <li><Link to="/products">Tất cả sản phẩm</Link></li>
              <li><Link to="/explore">Được chọn tuần này</Link></li>
              <li><Link to="/blog">Blog & Kiến thức</Link></li>
              <li><Link to="/">Về chúng tôi</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: LIÊN HỆ */}
          <div className="footer-col">
            <h4 className="footer-heading">Liên hệ</h4>
            <ul className="footer-contact-list">
              <li><Mail size={16} /> <span>greenify.com.vn@gmail.com</span></li>
              <li><Phone size={16} /> <span>0706 668 296</span></li>
              <li><MapPin size={16} /> <span>32/16 Tam Đa, P. Long Trường, TP. Hồ Chí Minh</span></li>
              <li><Clock size={16} /> <span>Thứ 2 - Chủ nhật, 9:00 - 21:00</span></li>
            </ul>
          </div>

          {/* COLUMN 4: CHÍNH SÁCH */}
          <div className="footer-col">
            <h4 className="footer-heading">Chính sách</h4>
            <ul className="footer-links">
              <li><Link to="/policies?tab=warranty">Bảo hành</Link></li>
              <li><Link to="/policies?tab=shipping">Vận chuyển</Link></li>
              <li><Link to="/policies?tab=return">Đổi trả</Link></li>
              <li><Link to="/policies?tab=privacy">Bảo mật</Link></li>
              <li><Link to="/policies?tab=faq">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* FLOATING GREENIFY STAMP CHAT BUTTON */}
      <a
        href="https://zalo.me/0706668296"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-greenify-stamp"
        title="Tư vấn trực tiếp Greenify"
      >
        <span className="stamp-text">Greenify</span>
        <span className="stamp-dot" />
      </a>
    </>
  );
}
