import { Check, Star, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState, Loading } from "../../components/Loading";
import { moderateReview, reviews } from "../../services/adminService";
import type { Review } from "../../types/commerce";
import { formatDate } from "../../utils/format";
import { AdminHead } from "./AdminDashboard";

export function AdminReviews() {
  const [items, setItems] = useState<Review[] | null>(null);

  const load = () => reviews("PENDING").then(setItems);

  useEffect(() => {
    load();
  }, []);

  async function moderate(id: string, approved: boolean) {
    await moderateReview(id, approved);
    setItems((current) => current?.filter((item) => item.id !== id) || []);
  }

  return (
    <>
      <AdminHead
        title="Duyệt Đánh Giá Khách Hàng"
        description="Chỉ những đánh giá từ khách hàng đã mua & nhận đơn hàng thành công mới được chuyển đến hàng đợi kiểm duyệt."
      />

      {!items ? (
        <Loading />
      ) : items.length ? (
        <div className="review-admin-list">
          {items.map((review) => (
            <article className="panel" key={review.id} style={{ borderLeft: "5px solid var(--greenify-rate-icon)" }}>
              <div className="review-admin-head">
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "var(--greenify-stat-icon-bg)",
                      color: "var(--greenify-stat-icon-color)",
                      fontWeight: 800,
                      display: "grid",
                      placeItems: "center",
                      fontSize: "1.05rem",
                    }}
                  >
                    {review.customerName ? review.customerName.charAt(0).toUpperCase() : "K"}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <b style={{ fontSize: "1rem", color: "var(--greenify-text-dark)" }}>{review.customerName}</b>
                      <span className="badge-tag" style={{ background: "#DCFCE7", color: "var(--greenify-positive)", fontSize: "0.72rem" }}>
                        <UserCheck size={11} /> Đã Mua Hàng
                      </span>
                    </div>
                    <span style={{ fontSize: "0.82rem", color: "var(--greenify-text-muted)" }}>
                      Sản phẩm: <strong style={{ color: "var(--greenify-input-label)" }}>{review.productName}</strong> · {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <Star
                      key={starIndex}
                      size={18}
                      fill={starIndex <= review.rating ? "var(--greenify-rate-icon)" : "none"}
                      color={starIndex <= review.rating ? "var(--greenify-rate-icon)" : "var(--greenify-frame-2)"}
                    />
                  ))}
                </div>
              </div>

              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--greenify-text-dark)", margin: "0.75rem 0 0.4rem" }}>{review.title}</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--greenify-text-light)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>{review.content}</p>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => moderate(review.id, true)}
                  className="admin-btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Check size={16} /> Duyệt Đánh Giá
                </button>
                <button
                  onClick={() => moderate(review.id, false)}
                  className="icon-button danger"
                  style={{ width: "auto", height: "auto", padding: "0.55rem 1.25rem", borderRadius: "8px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <X size={16} /> Từ Chối
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Hiện không có đánh giá nào chờ duyệt." description="Tất cả đánh giá của khách hàng đã được kiểm duyệt và công khai trên trang sản phẩm." />
      )}
    </>
  );
}
