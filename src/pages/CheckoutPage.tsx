import { ArrowLeft, Truck, Banknote } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currentUser } from "../services/authService";
import { formatMoney } from "../utils/format";

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const user = currentUser();
  const navigate = useNavigate();

  const [address, setAddress] = useState("32/16 Tam Đa, P. Long Trường");
  const [city, setCity] = useState("TP. Hồ Chí Minh");
  const [district, setDistrict] = useState("Quận 9");
  const [ward, setWard] = useState("Phường 5");

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking">("cod");

  const shippingFee = shippingMethod === "standard" ? 30000 : 50000;
  const totalAmount = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      code: "GREENIFY - 0001",
      date: new Date().toLocaleString("vi-VN"),
      receiver: user ? user.name : "Nguyễn Văn A",
      paymentType: paymentMethod === "cod" ? "COD" : "Ngân hàng",
      items,
      subtotal,
      shippingFee,
      totalAmount,
    };
    localStorage.setItem("latest-greenify-order", JSON.stringify(orderData));
    clear();
    navigate("/order-success");
  };

  return (
    <main className="greenify-checkout-page container">
      <Link to="/" className="auth-back-link">
        <ArrowLeft size={16} /> Quay lại trang chủ
      </Link>

      <h1 className="checkout-title">Thanh toán</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-layout">
        {/* LEFT CARDS */}
        <div className="checkout-left-col">
          {/* CARD 1: ADDRESS */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <Truck size={20} /> <h2>Địa chỉ giao hàng</h2>
            </div>

            <div className="form-group">
              <label>Địa chỉ *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, tên đường"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Tỉnh / Thành Phố *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quận / Huyện *</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phường / Xã *</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                required
              />
            </div>
          </div>

          {/* CARD 2: SHIPPING METHOD */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <Truck size={20} /> <h2>Phương thức vận chuyển</h2>
            </div>

            <div className="shipping-options">
              <label className={`radio-option-card ${shippingMethod === "standard" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === "standard"}
                  onChange={() => setShippingMethod("standard")}
                />
                <div className="radio-content">
                  <strong>Giao hàng tiêu chuẩn</strong>
                  <span>3-5 ngày làm việc</span>
                </div>
                <span className="radio-price">30.000đ</span>
              </label>

              <label className={`radio-option-card ${shippingMethod === "express" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === "express"}
                  onChange={() => setShippingMethod("express")}
                />
                <div className="radio-content">
                  <strong>Giao hàng nhanh</strong>
                  <span>1 -2 ngày làm việc</span>
                </div>
                <span className="radio-price">50.000đ</span>
              </label>
            </div>
          </div>

          {/* CARD 3: PAYMENT METHOD */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <Banknote size={20} /> <h2>Phương thức thanh toán</h2>
            </div>

            <div className="payment-options">
              <label className={`radio-option-card ${paymentMethod === "cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div className="radio-content">
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <span>Thanh toán tiền mặt</span>
                </div>
                <span className="radio-price">30.000đ</span>
              </label>

              <label className={`radio-option-card ${paymentMethod === "banking" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "banking"}
                  onChange={() => setPaymentMethod("banking")}
                />
                <div className="radio-content">
                  <strong>Thanh toán bằng ngân hàng</strong>
                  <span>Chuyển khoản hoặc thanh toán bằng Visa</span>
                </div>
                <span className="radio-price">50.000đ</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN SUMMARY */}
        <div className="checkout-right-col">
          <div className="checkout-summary-card">
            <h2 className="summary-title">Tổng đơn hàng</h2>

            <div className="checkout-items-preview">
              {items.map((item) => (
                <div key={item.key} className="preview-item">
                  <img
                    src={item.product.images[0] || "/greenify/103030178d272cf117fd67a3e50134fb539ff7d8.png"}
                    alt={item.product.name}
                  />
                  <div className="preview-info">
                    <h4>{item.product.name}</h4>
                    <span>Phân loại: {Object.values(item.variants)[0] || "Gói cơ bản"}</span>
                    <span>Số lượng: {item.quantity}</span>
                    <strong className="preview-price">{formatMoney(item.unitPrice * item.quantity)}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>{formatMoney(shippingFee)}</span>
              </div>
            </div>

            <div className="summary-total-row">
              <span>Tổng cộng</span>
              <span className="total-amount">{formatMoney(totalAmount)}</span>
            </div>
          </div>

          <button type="submit" className="place-order-btn">
            Đặt hàng
          </button>
        </div>
      </form>
    </main>
  );
}
