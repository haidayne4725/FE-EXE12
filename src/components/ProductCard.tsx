import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/catalog";
import { formatMoney } from "../utils/format";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [selectedVersion, setSelectedVersion] = useState<string>("Cơ bản");
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const versions = product.variants?.length ? product.variants : (product.hasVersions ? ["Cơ bản", "Tiêu chuẩn", "Nâng cao"] : []);
  const soldOut = product.inventory <= 0 || product.status === "OUT_OF_STOCK";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soldOut) return;
    add(product, quantity, versions.length > 0 ? { "Phiên bản": selectedVersion } : {});
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="greenify-product-card">
      <Link to={`/products/${product.slug}`} className="greenify-card-thumb">
        <img src={product.images[0] || "/greenify/103030178d272cf117fd67a3e50134fb539ff7d8.png"} alt={product.name} loading="lazy" />
        {product.salePrice && product.salePrice < product.basePrice && !product.hasVersions && (
          <span className="discount-badge">-{Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)}%</span>
        )}
      </Link>

      <div className="greenify-card-content">
        <span className="card-category">{product.categoryName || "BỂ BASIC"}</span>
        
        <div className="card-header-row">
          <Link to={`/products/${product.slug}`} className="card-title-link">
            <h3 className="card-title">{product.name}</h3>
          </Link>
          <div className="card-price-box">
            <span className="current-price">{formatMoney(product.effectivePrice || product.salePrice || product.basePrice)}</span>
            {product.basePrice > (product.salePrice || product.effectivePrice) && (
              <del className="original-price">{formatMoney(product.basePrice)}</del>
            )}
          </div>
        </div>

        <div className="card-rating">
          {(product.rating || 0) > 0 ? (
            <span>{"★".repeat(Math.round(product.rating || 0))} ({product.reviewCount})</span>
          ) : (
            <span className="no-review">Chưa có đánh giá</span>
          )}
        </div>

        {versions.length > 0 && (
          <div className="version-selector">
            <span className="version-label">CHỌN PHIÊN BẢN</span>
            <div className="version-pills">
              {versions.map((ver) => {
                const name = typeof ver === "string" ? ver : (ver.name || ver.value);
                const isActive = selectedVersion === name;
                return (
                  <button
                    key={name}
                    type="button"
                    className={`version-pill ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedVersion(name)}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="card-action-row">
          <div className="qty-counter">
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="qty-val">{quantity}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className={`add-cart-btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={soldOut}
          >
            {added ? "Đã thêm ✓" : soldOut ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>
    </article>
  );
}
