import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/format";

export function CartPage() {
  const { items, update, clear, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="greenify-cart-page container">
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
        <div className="cart-empty-state">
          <ShoppingBag size={56} className="empty-icon" />
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy khám phá bộ sưu tập terrarium độc đáo của Greenify ngay!</p>
          <Link to="/products" className="button">
            Khám phá sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="greenify-cart-page container">
      <Link to="/" className="auth-back-link">
        <ArrowLeft size={16} /> Quay lại trang chủ
      </Link>

      <h1 className="cart-title">Giỏ hàng của bạn</h1>

      <div className="cart-page-layout">
        {/* LEFT COLUMN: CART ITEMS */}
        <div className="cart-left-col">
          {/* TOP ACTION BAR */}
          <div className="cart-action-bar">
            <button type="button" className="cart-top-btn dark" onClick={clear}>
              <Trash2 size={16} /> Xoá đã chọn
            </button>
            <button type="button" className="cart-top-btn outline" onClick={clear}>
              Xoá hết
            </button>
          </div>

          {/* ITEM LIST */}
          <div className="cart-items-list">
            {items.map((item) => {
              const versionVal = Object.values(item.variants)[0] || "Cơ bản";
              return (
                <div key={item.key} className="cart-item-card">
                  <input type="checkbox" defaultChecked className="item-checkbox" />
                  <img
                    src={item.product.images[0] || "/greenify/103030178d272cf117fd67a3e50134fb539ff7d8.png"}
                    alt={item.product.name}
                    className="item-thumb"
                  />
                  
                  <div className="item-info">
                    <span className="item-cat">{item.product.categoryName || "BỂ BASIC"}</span>
                    <h3 className="item-name">{item.product.name}</h3>
                    <div className="item-rating-stub">Chưa có đánh giá</div>

                    <div className="item-version-box">
                      <span className="version-label">CHỌN PHIÊN BẢN</span>
                      <div className="version-pills">
                        <button type="button" className={`version-pill ${versionVal === "Cơ bản" ? "active" : ""}`}>Cơ bản</button>
                        <button type="button" className={`version-pill ${versionVal === "Tiêu chuẩn" ? "active" : ""}`}>Tiêu chuẩn</button>
                        <button type="button" className={`version-pill ${versionVal === "Nâng cao" ? "active" : ""}`}>Nâng cao</button>
                      </div>
                    </div>
                  </div>

                  <div className="item-price-qty-col">
                    <div className="item-price-box">
                      <span className="item-price">{formatMoney(item.unitPrice)}</span>
                      {item.product.basePrice > item.unitPrice && (
                        <del className="item-old-price">{formatMoney(item.product.basePrice)}</del>
                      )}
                    </div>

                    <div className="qty-counter">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => update(item.key, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => update(item.key, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM RETURN BUTTONS */}
          <div className="cart-bottom-actions">
            <Link to="/" className="cart-bottom-btn">Về trang chủ</Link>
            <Link to="/products" className="cart-bottom-btn dark">Tiếp tục mua sắm</Link>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="cart-right-summary">
          <h2 className="summary-title">Tổng đơn hàng</h2>
          
          <div className="summary-rows">
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>Được tính sau khi thanh toán</span>
            </div>
            <div className="summary-row">
              <span>Giảm giá:</span>
              <span>0đ</span>
            </div>
          </div>

          <div className="summary-total-row">
            <span>Tổng cộng:</span>
            <span className="total-amount">{formatMoney(subtotal)}</span>
          </div>

          <div className="promo-input-row">
            <input type="text" placeholder="Nhập mã giảm giá" />
            <button type="button" className="apply-btn">Áp dụng</button>
          </div>

          <button
            type="button"
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </main>
  );
}
