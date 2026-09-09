import { Bot, Check, Heart, Minus, Plus, ShoppingBag, Star, ThumbsUp, Sparkles, ShieldCheck, Sun, Droplets, Thermometer, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import { useCart } from "../context/CartContext";
import { toggleVote } from "../services/catalogService";
import { toggleFavorite } from "../services/commerceService";
import { getApiMessage } from "../services/axiosClient";
import { recommend } from "../services/ragService";
import { currentUser } from "../services/authService";
import type { Product } from "../types/catalog";
import type { Review } from "../types/commerce";
import { formatMoney } from "../utils/format";
import mockData from "../mock/mockData.json";

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [ai, setAi] = useState("");
  const [message, setMessage] = useState("");
  const [selectedImg, setSelectedImg] = useState("");

  useEffect(() => {
    const list = mockData.products as unknown as Product[];
    const item = list.find((p) => p.slug === slug || p.id === slug) || list[0];
    setProduct(item);
    setSelectedImg(item.images[0] || "/greenify/terrarium-khep-kin-1.png");
    const defaults: Record<string, string> = {};
    if (item.variants && Array.isArray(item.variants)) {
      item.variants.forEach((v) => {
        if (typeof v === "object" && v.variantType && !defaults[v.variantType]) {
          defaults[v.variantType] = v.value;
        }
      });
    }
    setVariants(defaults);
  }, [slug]);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const adjustment = product.variants
      .filter((v) => variants[v.variantType] === v.value)
      .reduce((sum, v) => sum + v.priceAdjustment, 0);
    return (product.effectivePrice + adjustment) * quantity;
  }, [product, variants, quantity]);

  if (!product)
    return (
      <main className="page container">
        {message ? <div className="notice error">{message}</div> : <Loading />}
      </main>
    );

  const variantTypes = [...new Set(product.variants.map((v) => v.variantType))];

  return (
    <main className="page container">
      <div className="product-detail">
        {/* IMAGE GALLERY */}
        <div>
          <div
            style={{
              height: "480px",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              background: "#ffffff",
              border: "1px solid var(--greenify-frame-2)",
              marginBottom: "1rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <img src={selectedImg} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setSelectedImg(img)}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  border: selectedImg === img ? "2.5px solid var(--greenify-main-color)" : "1px solid var(--greenify-frame-2)",
                  opacity: selectedImg === img ? 1 : 0.7,
                }}
              />
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="product-info">
          <span className="badge-tag iris">
            <Sparkles size={12} /> {product.categoryName}
          </span>
          <h1 style={{ margin: "0.5rem 0 0.75rem", fontSize: "2.4rem" }}>{product.name}</h1>

          <div className="product-rating" style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>
            <Star fill="currentColor" size={18} />
            <b>{product.rating || "5.0"}</b>
            <span>({product.reviewCount || 12} đánh giá công khai)</span>
            <span style={{ marginInline: "0.5rem" }}>•</span>
            <span style={{ color: "var(--greenify-main-color)", fontWeight: 600 }}>{product.voteCount} lượt bình chọn</span>
          </div>

          <div className="price-box" style={{ fontSize: "1.8rem", margin: "1rem 0 1.5rem" }}>
            <strong>{formatMoney(product.effectivePrice)}</strong>
            {product.salePrice && <del>{formatMoney(product.basePrice)}</del>}
          </div>

          <p style={{ fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            {product.description || "Bể Terrarium khép kín được thực hiện thủ công bởi các nghệ nhân Greenify. Sử dụng lớp rêu rừng thuần hóa kết hợp đá nham thạch và dớn kháng khuẩn."}
          </p>

          <div className="panel" style={{ padding: "1.2rem", background: "var(--greenify-bottom-1)", marginBottom: "1.5rem" }}>
            <div style={{ display: "grid", gap: "0.6rem", fontSize: "0.88rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                <Check size={16} color="var(--greenify-main-color)" /> Trạng thái: {product.setupStatus || "Sẵn sàng trưng bày"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                <Check size={16} color="var(--greenify-main-color)" /> Mức độ chăm sóc: {product.careLevel || "EASY (Rất dễ)"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                <ShieldCheck size={16} color="var(--greenify-main-color)" /> Bảo hành rêu 30 ngày & Hỗ trợ dưỡng lại trọn đời
              </span>
            </div>
          </div>

          {/* VARIANTS */}
          {variantTypes.map((type) => (
            <div className="variant-group" key={type}>
              <b>Tùy Chọn {type}:</b>
              <div>
                {product.variants
                  .filter((v) => v.variantType === type)
                  .map((v) => (
                    <button
                      key={v.id}
                      className={variants[type] === v.value ? "selected" : ""}
                      onClick={() => setVariants((val) => ({ ...val, [type]: v.value }))}
                    >
                      {v.value}
                      {v.priceAdjustment > 0 && ` (+${formatMoney(v.priceAdjustment)})`}
                    </button>
                  ))}
              </div>
            </div>
          ))}

          {/* PURCHASE ROW */}
          <div className="purchase-row">
            <div className="quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}>
                <Plus size={16} />
              </button>
            </div>

            <button
              className="button wide"
              disabled={product.inventory < 1}
              onClick={() => add(product, quantity, variants)}
            >
              <ShoppingBag size={18} /> Thêm Vào Giỏ · {formatMoney(totalPrice)}
            </button>
          </div>

          {/* SECONDARY ACTIONS */}
          <div className="secondary-actions" style={{ marginTop: "1rem" }}>
            <button
              className="outline"
              onClick={async () => {
                if (!currentUser()) return navigate("/login");
                setProduct(await toggleVote(product.id));
              }}
            >
              <ThumbsUp size={16} /> {product.userVoted ? "Bỏ bình chọn" : "Bình chọn Greenify"}
            </button>

            <button
              className="outline"
              onClick={async () => {
                if (!currentUser()) return navigate("/login");
                await toggleFavorite(product.id);
                setMessage("Đã thêm vào danh sách yêu thích của bạn!");
              }}
            >
              <Heart size={16} /> Yêu thích
            </button>

            <button
              className="button"
              style={{ background: "var(--greenify-sub-color)" }}
              onClick={async () => {
                setAi("Đang phân tích điều kiện phòng và ánh sáng cho sản phẩm...");
                try {
                  setAi((await recommend(product.id)).answer);
                } catch (err) {
                  setAi(getApiMessage(err));
                }
              }}
            >
              <Bot size={16} /> AI Hướng Dẫn Chăm Sóc
            </button>
          </div>

          {message && <div className="notice success" style={{ marginTop: "1rem" }}>{message}</div>}
          {ai && (
            <div className="ai-answer" style={{ marginTop: "1rem", borderRadius: "var(--radius-md)" }}>
              <b style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--greenify-main-color)" }}>
                <Bot size={18} /> Trợ Lý Xanh Greenify AI:
              </b>
              <p style={{ marginTop: "0.5rem" }}>{ai}</p>
            </div>
          )}
        </div>
      </div>

      {/* CARE GUIDE SECTION */}
      {product.careGuide && (
        <section style={{ marginTop: "4rem" }}>
          <h2>Cẩm Nang Chăm Sóc Tác Phẩm</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginTop: "1.5rem" }}>
            <div className="panel">
              <Droplets size={24} color="var(--greenify-main-color)" style={{ marginBottom: "0.5rem" }} />
              <b>Tần Suất Tưới Nước</b>
              <p style={{ fontSize: "0.88rem", marginTop: "0.4rem" }}>{product.careGuide.watering}</p>
            </div>

            <div className="panel">
              <Sun size={24} color="var(--greenify-main-color)" style={{ marginBottom: "0.5rem" }} />
              <b>Ánh Sáng Phù Hợp</b>
              <p style={{ fontSize: "0.88rem", marginTop: "0.4rem" }}>{product.careGuide.sunlight}</p>
            </div>

            <div className="panel">
              <Thermometer size={24} color="var(--greenify-main-color)" style={{ marginBottom: "0.5rem" }} />
              <b>Nhiệt Độ & Độ Ẩm</b>
              <p style={{ fontSize: "0.88rem", marginTop: "0.4rem" }}>{product.careGuide.temperature} · {product.careGuide.humidity}</p>
            </div>

            <div className="panel">
              <AlertCircle size={24} color="var(--greenify-warning)" style={{ marginBottom: "0.5rem" }} />
              <b>Lưu Ý Quan Trọng</b>
              <p style={{ fontSize: "0.88rem", marginTop: "0.4rem" }}>{product.careGuide.commonIssues || "Tránh để dưới ánh nắng trực tiếp hoặc nhiệt độ phòng trên 32°C."}</p>
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS SECTION */}
      <section style={{ marginTop: "4rem" }}>
        <h2>Đánh Giá Từ Khách Hàng</h2>
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          {reviews.length ? (
            reviews.map((r) => (
              <div className="panel" key={r.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <b>{r.customerName}</b>
                  <div style={{ color: "var(--greenify-rate-icon)" }}>{"★".repeat(r.rating)}</div>
                </div>
                <h4 style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>{r.title}</h4>
                <p style={{ fontSize: "0.9rem", margin: 0 }}>{r.content}</p>
              </div>
            ))
          ) : (
            <p className="panel">Chưa có đánh giá công khai cho sản phẩm này.</p>
          )}
        </div>
      </section>
    </main>
  );
}
