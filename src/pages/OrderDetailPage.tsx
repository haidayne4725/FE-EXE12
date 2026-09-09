import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from "../utils/format";

export function OrderSuccessPage() {
  const rawOrder = localStorage.getItem("latest-greenify-order");
  const order = rawOrder
    ? JSON.parse(rawOrder)
    : {
        code: "GREENIFY - 0001",
        date: "12:08:56 - 04/07/2026",
        receiver: "Nguyễn Văn A",
        paymentType: "COD",
        items: [
          {
            product: { name: "Bể bậc thang tịnh tâm" },
            quantity: 1,
            unitPrice: 950000,
          },
        ],
        subtotal: 950000,
        shippingFee: 30000,
        totalAmount: 980000,
      };

  return (
    <main className="greenify-success-page container">
      <Link to="/" className="auth-back-link">
        <ArrowLeft size={16} /> Quay lại trang chủ
      </Link>

      <div className="success-header">
        <div className="success-check-icon">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="success-title">Đặt hàng thành công</h1>
        <p className="success-subtitle">Cảm ơn bạn đã mua hàng tại Greenify</p>
      </div>

      <div className="order-invoice-card">
        <div className="invoice-meta-row">
          <div>
            <span className="meta-label">Mã đơn hàng:</span>
            <strong className="order-code">{order.code}</strong>
          </div>
        </div>

        <div className="invoice-meta-row">
          <div>
            <span className="meta-label">Ngày đặt:</span>
            <div className="meta-val">{order.date}</div>
          </div>
        </div>

        <div className="invoice-receiver-row">
          <div>
            <span className="meta-label">Người nhận:</span>
            <strong className="receiver-name">{order.receiver}</strong>
          </div>
          <div className="text-right">
            <span className="meta-label">Thanh toán:</span>
            <strong className="payment-type">{order.paymentType}</strong>
          </div>
        </div>

        <div className="invoice-products-section">
          <span className="meta-label">Sản phẩm:</span>
          {order.items?.map((it: any, i: number) => (
            <div key={i} className="invoice-item-row">
              <span className="item-name-qty">
                <strong>{it.product?.name}</strong> x{it.quantity}
              </span>
              <span className="item-total">{formatMoney(it.unitPrice * it.quantity)}</span>
            </div>
          ))}
        </div>

        <hr className="invoice-divider" />

        <div className="invoice-calc-rows">
          <div className="calc-row">
            <span>Tạm tính</span>
            <span>{formatMoney(order.subtotal)}</span>
          </div>
          <div className="calc-row">
            <span>Phí vận chuyển</span>
            <span>{formatMoney(order.shippingFee)}</span>
          </div>
          <div className="calc-row">
            <span>Giảm giá</span>
            <span>0đ</span>
          </div>
        </div>

        <div className="invoice-total-row">
          <span>Tổng cộng</span>
          <span className="total-val">{formatMoney(order.totalAmount)}</span>
        </div>
      </div>

      <div className="success-actions-row">
        <Link to="/" className="success-btn light">Về trang chủ</Link>
        <Link to="/products" className="success-btn dark">Tiếp tục mua sắm</Link>
        <Link to="/orders" className="success-btn light">Theo dõi đơn hàng</Link>
      </div>
    </main>
  );
}
