import { ChevronDown, ChevronUp, ShieldCheck, MessageCircle } from "lucide-react";
import { useState } from "react";

export function PoliciesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const policySections = [
    {
      id: "warranty",
      title: "Chính sách bảo hành",
      content: (
        <div className="policy-text-block">
          <p>Chúng tôi cam kết bảo hành tất cả các sản phẩm terrarium trong vòng 30 ngày kể từ ngày mua.</p>
          <br />
          <p><strong>Điều kiện bảo hành:</strong></p>
          <ul className="policy-bullet-list">
            <li>Sản phẩm bị lỗi do nhà sản xuất</li>
            <li>Cây cối phai úa hoặc chết trong vòng 30 ngày (điều kiện đã được hướng dẫn chăm sóc)</li>
            <li>Sản phẩm không đúng mô tả</li>
          </ul>
          <br />
          <p>Để được bảo hành, vui lòng liên hệ qua email hoặc hotline với hình ảnh và hóa đơn mua hàng.</p>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Chính sách vận chuyển",
      content: (
        <div className="policy-text-block">
          <p><strong>Thông tin vận chuyển:</strong></p>
          <ul className="policy-bullet-list">
            <li>Miễn phí vận chuyển cho đơn hàng từ 500,000đ trở lên</li>
            <li>Phí vận chuyển tiêu chuẩn: 30,000đ - 50,000đ</li>
            <li>Thời gian giao hàng: 2-5 ngày làm việc (tại HCM), 3-7 ngày (toàn quốc)</li>
            <li>Đối tác vận chuyển: GHN, Grab Express</li>
          </ul>
          <br />
          <p><strong>Theo dõi đơn hàng:</strong></p>
          <p>Số tracking sẽ được gửi qua SMS/Email sau khi đơn hàng đã được xác nhận.</p>
        </div>
      ),
    },
    {
      id: "return",
      title: "Chính sách đổi trả",
      content: (
        <div className="policy-text-block">
          <p>Chúng tôi chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu:</p>
          <ol className="policy-numbered-list" style={{ paddingLeft: "1.2rem", marginBlock: "0.5rem" }}>
            <li>Sản phẩm bị lỗi do nhà sản xuất</li>
            <li>Sản phẩm không đúng mẫu mã, kích thước</li>
            <li>Sản phẩm không hoạt động (nếu là sản phẩm có đèn, bơm...)</li>
          </ol>
          <br />
          <p><strong>Điều kiện:</strong></p>
          <ul className="policy-bullet-list">
            <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
            <li>Có đầy đủ bao bì, phụ kiện</li>
            <li>Không áp dụng cho các sản phẩm đã được cá nhân hóa theo yêu cầu</li>
          </ul>
          <br />
          <p><strong>Chi phí đổi trả:</strong> Miễn phí nếu lỗi từ phía chúng tôi.</p>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "Chính sách bảo mật",
      content: (
        <div className="policy-text-block">
          <p>Cam kết bảo vệ thông tin cá nhân của khách hàng:</p>
          <br />
          <p><strong>Thông tin thu thập:</strong></p>
          <ul className="policy-bullet-list">
            <li>Họ tên, địa chỉ email, số điện thoại</li>
            <li>Địa chỉ giao hàng</li>
            <li>Lịch sử mua hàng (nếu có tài khoản)</li>
          </ul>
          <br />
          <p><strong>Mục đích sử dụng:</strong></p>
          <ul className="policy-bullet-list">
            <li>Xử lý đơn hàng và giao hàng</li>
            <li>Gửi thông tin khuyến mãi (có thể hủy đăng ký bất kỳ lúc nào)</li>
            <li>Cải thiện dịch vụ</li>
          </ul>
          <br />
          <p><strong>Bảo mật:</strong></p>
          <ul className="policy-bullet-list">
            <li>Không bán hoặc chia sẻ thông tin với bên thứ ba</li>
            <li>Sử dụng SSL mã hóa mọi giao dịch</li>
            <li>Lưu trữ an toàn theo tiêu chuẩn</li>
          </ul>
        </div>
      ),
    },
    {
      id: "faq",
      title: "Câu hỏi thường gặp",
      content: (
        <div className="policy-text-block">
          <div className="faq-qa-item" style={{ marginBottom: "1.2rem" }}>
            <p><strong>Terrarium cần chăm sóc như thế nào?</strong></p>
            <p style={{ color: "#66705E" }}>Terrarium của chúng tôi được thiết kế để tự cân bằng. Chỉ cần đặt nơi có ánh sáng nhẹ và tưới nước rất ít (1-2 lần/tuần).</p>
          </div>
          <div className="faq-qa-item" style={{ marginBottom: "1.2rem" }}>
            <p><strong>Có thể tùy chỉnh terrarium không?</strong></p>
            <p style={{ color: "#66705E" }}>Có! Chúng tôi cung cấp dịch vụ custom terrarium theo yêu cầu.</p>
          </div>
          <div className="faq-qa-item" style={{ marginBottom: "1.2rem" }}>
            <p><strong>Cây trong terrarium có sống lâu không?</strong></p>
            <p style={{ color: "#66705E" }}>Các loại cây được chọn lọc kỹ để sống trong môi trường kín. Với chăm sóc đúng, có thể sống từ 1-3 năm.</p>
          </div>
          <div className="faq-qa-item">
            <p><strong>Có hỗ trợ giao hàng quốc tế không?</strong></p>
            <p style={{ color: "#66705E" }}>Hiện tại chúng tôi chỉ giao hàng trong Việt Nam.</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="greenify-policies-page container">
      {/* HEADER SECTION (EXACT TO FIGMA DESIGN) */}
      <div className="policies-header">
        <div className="blog-eyebrow-badge">
          <ShieldCheck size={16} /> Minh bạch & Tin cậy
        </div>
        <h1 className="page-title">Chính sách & Hướng dẫn của Greenify</h1>
        <p className="page-subtitle">Tìm hiểu về các chính sách, điều khoản và thông tin hữu ích khi mua sắm tại Greenify</p>
      </div>

      {/* FULL ACCORDION CARD (EXACT TO FIGMA DESIGN) */}
      <div className="policies-accordion-card" style={{ marginTop: "2rem" }}>
        {policySections.map((sec, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={sec.id} className={`accordion-item ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="accordion-header"
                onClick={() => toggleAccordion(idx)}
              >
                <span className="accordion-title" style={{ fontSize: "1.15rem", fontWeight: "700" }}>
                  {sec.title}
                </span>
                {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </button>
              {isOpen && <div className="accordion-body">{sec.content}</div>}
            </div>
          );
        })}
      </div>

      {/* BOTTOM HELP CTA BANNER (EXACT TO FIGMA DESIGN) */}
      <div className="policies-help-cta-box" style={{ background: "#1F291C", borderRadius: "16px", padding: "3rem 2rem", marginTop: "3.5rem" }}>
        <h2 style={{ color: "#ffffff", fontSize: "2.2rem", fontWeight: "800", marginBottom: "0.6rem" }}>
          Cần hỗ trợ thêm?
        </h2>
        <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "1rem", marginBottom: "1.75rem" }}>
          Nếu bạn không tìm thấy thông tin cần thiết, đội ngũ chúng tôi luôn sẵn sàng hỗ trợ.
        </p>
        <a
          href="https://zalo.me/0706668296"
          target="_blank"
          rel="noopener noreferrer"
          className="button dark large-pill"
          style={{ background: "#556649", color: "#ffffff" }}
        >
          Liên hệ ngay <MessageCircle size={18} />
        </a>
      </div>
    </main>
  );
}
