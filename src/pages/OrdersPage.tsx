import { Package, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, Loading } from "../components/Loading";
import { getOrders } from "../services/commerceService";
import type { Order } from "../types/commerce";
import { formatDate, formatMoney } from "../utils/format";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <main className="page container">
      <div className="page-title left" style={{ marginBottom: "2rem" }}>
        <span className="badge-tag iris" style={{ marginBottom: "0.5rem" }}>
          <Package size={12} /> Tra Cứu Đơn Hàng
        </span>
        <h1>Lịch Sử Đặt Hàng Greenify</h1>
      </div>

      {!orders ? (
        <Loading />
      ) : orders.length ? (
        <div className="order-list">
          {orders.map((order) => (
            <Link className="order-card panel" key={order.id} to={`/orders/${order.id}`} style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.25rem", transition: "var(--transition-fast)" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--greenify-bottom-1)",
                  color: "var(--greenify-main-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Package size={24} />
              </div>

              <div className="grow">
                <b style={{ fontSize: "1.1rem", color: "var(--greenify-base-black)" }}>Mã Đơn: {order.orderNumber}</b>
                <span style={{ fontSize: "0.85rem", color: "var(--greenify-icon)", display: "block", marginTop: "0.2rem" }}>
                  Ngày đặt: {formatDate(order.createdAt)} • {order.items.length} tác phẩm
                </span>
              </div>

              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>

              <strong style={{ fontSize: "1.2rem", color: "var(--greenify-main-color)", marginLeft: "1rem" }}>
                {formatMoney(order.total)}
              </strong>

              <ArrowRight size={18} color="var(--greenify-icon)" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="Bạn chưa có đơn hàng nào" description="Hãy khám phá bộ sưu tập và chọn lựa tác phẩm đầu tiên." />
      )}
    </main>
  );
}
