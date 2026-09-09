import { Droplets, Heart, Leaf, Scissors, Star, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, Loading } from "../components/Loading";
import { ProductCard } from "../components/ProductCard";
import { currentUser, me } from "../services/authService";
import { getCareItems, getFavorites, updateCare } from "../services/commerceService";
import type { UserInfo } from "../types/auth";
import type { Product } from "../types/catalog";
import type { CareItem } from "../types/commerce";
import { formatDate } from "../utils/format";

export function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(() => currentUser());
  const [favorites, setFavorites] = useState<Product[] | null>(null);
  const [care, setCare] = useState<CareItem[] | null>(null);

  useEffect(() => {
    me().then(setUser);
    getFavorites().then(setFavorites);
    getCareItems().then(setCare);
  }, []);

  if (!user)
    return (
      <main className="page container">
        <Loading />
      </main>
    );

  async function careAction(id: string, action: string) {
    const updated = await updateCare(id, action);
    setCare((current) => current?.map((item) => (item.id === id ? updated : item)) || []);
  }

  return (
    <main className="page container">
      {/* PROFILE HERO */}
      <div className="profile-hero" style={{ background: "linear-gradient(135deg, var(--greenify-sub-color) 0%, var(--greenify-main-color) 100%)", color: "#ffffff", padding: "2.5rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", marginBottom: "2.5rem" }}>
        <div className="avatar" style={{ background: "#ffffff", color: "var(--greenify-main-color)", width: "76px", height: "76px" }}>
          <UserRound size={36} />
        </div>

        <div>
          <span className="badge-tag iris" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}>
            Thành Viên Greenify Studio
          </span>
          <h1 style={{ fontSize: "2.4rem", margin: "0.4rem 0 0.2rem", color: "#ffffff" }}>{user.name}</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>{user.email} • {user.phone || "0987654321"}</p>
        </div>

        <div className="loyalty-card" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)" }}>
          <Star size={24} color="var(--greenify-rate-icon)" style={{ margin: "0 auto 0.25rem" }} />
          <b style={{ fontSize: "1.2rem" }}>{user.loyaltyPoints} Điểm Tích Lũy</b>
          <span style={{ fontSize: "0.82rem", color: "var(--greenify-bottom-1)", fontWeight: 600 }}>Hạng: {user.loyaltyTier} Member</span>
        </div>
      </div>

      {/* ACCOUNT TABS */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem" }}>
        <Link to="/orders" className="button outline" style={{ padding: "0.55rem 1.25rem" }}>
          📦 Đơn Hàng Của Tôi
        </Link>
        <a href="#favorites" className="button outline" style={{ padding: "0.55rem 1.25rem" }}>
          💚 Tác Phẩm Yêu Thích
        </a>
        <a href="#care" className="button" style={{ padding: "0.55rem 1.25rem" }}>
          🌿 Lịch Chăm Sóc Cây Cá Nhân
        </a>
      </div>

      {/* FAVORITES SECTION */}
      <section id="favorites" className="section compact" style={{ paddingBlock: "1.5rem" }}>
        <div className="section-head">
          <h2><Heart size={24} color="var(--greenify-discount)" /> Tác Phẩm Đã Lưu</h2>
        </div>

        {favorites === null ? (
          <Loading />
        ) : favorites.length ? (
          <div className="product-grid">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có tác phẩm trong danh sách yêu thích" description="Hãy thả tim các bình Terrarium bạn ưng ý trong quá trình tham quan." />
        )}
      </section>

      {/* CARE CALENDAR SECTION */}
      <section id="care" className="section compact" style={{ paddingBlock: "2.5rem" }}>
        <div className="section-head">
          <div>
            <span className="eyebrow"><Leaf size={14} /> Chăm Sóc Định Kỳ</span>
            <h2>Lịch Tưới & Tỉa Rêu Cá Nhân</h2>
          </div>
        </div>

        {care === null ? (
          <Loading />
        ) : care.length ? (
          <div className="care-list">
            {care.map((item) => (
              <div className="panel" key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem" }}>
                <div>
                  <b style={{ fontSize: "1.15rem", color: "var(--greenify-base-black)" }}>{item.productName}</b>
                  <p style={{ margin: "0.3rem 0 0.5rem", fontSize: "0.92rem", color: "var(--greenify-location-rate)" }}>
                    Lịch khuyến nghị: <b>{item.careSchedule}</b>
                  </p>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.82rem", color: "var(--greenify-icon)" }}>
                    <span>Lần tưới gần nhất: <b>{formatDate(item.lastWateredAt)}</b></span>
                    <span>Lần tưới tiếp theo: <b>{formatDate(item.nextWateringAt)}</b></span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button className="button" onClick={() => careAction(item.id, "water")} style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}>
                    <Droplets size={16} /> Đã Tưới Nước
                  </button>
                  <button className="button outline" onClick={() => careAction(item.id, "prune")} style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}>
                    <Scissors size={16} /> Đã Tỉa Tán
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có lịch chăm sóc cá nhân" description="Khi đơn hàng Terrarium được giao thành công, hệ thống sẽ tự động khởi tạo lịch tưới cho bạn." />
        )}
      </section>
    </main>
  );
}
