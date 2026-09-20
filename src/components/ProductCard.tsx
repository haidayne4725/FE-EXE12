import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/catalog";
import { formatMoney } from "../utils/format";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.inventory <= 0 || product.status === "OUT_OF_STOCK";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soldOut) return;
    add(product, quantity, {});
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="greenify-product-card-clean">
      <Link to={`/products/${product.slug}`} className="card-thumb-wrap-clean">
        <img src={product.images[0] || "/greenify/103030178d272cf117fd67a3e50134fb539ff7d8.png"} alt={product.name} loading="lazy" />
      </Link>

      <div className="card-body-clean">
        <span className="card-category-clean">{product.categoryName || "BỂ BASIC"}</span>

        <div className="card-title-price-row">
          <Link to={`/products/${product.slug}`} className="card-title-link">
            <h3 className="card-title-clean">{product.name}</h3>
          </Link>
          <div className="card-price-box-clean">
            <span className="current-price-clean">{formatMoney(product.effectivePrice || product.salePrice || product.basePrice)}</span>
            {product.basePrice > (product.salePrice || product.effectivePrice) && (
              <del className="original-price-clean">{formatMoney(product.basePrice)}</del>
            )}
          </div>
        </div>

        <div className="card-rating-clean">
          {(product.rating || 0) > 0 ? (
            <span>{"★".repeat(Math.round(product.rating || 0))} ({product.reviewCount})</span>
          ) : (
            <span className="no-review-clean">Chưa có đánh giá</span>
          )}
        </div>

        <div className="card-action-row-clean">
          <div className="qty-counter-clean">
            <button
              type="button"
              className="qty-btn-clean"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="qty-val-clean">{quantity}</span>
            <button
              type="button"
              className="qty-btn-clean"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className={`add-cart-btn-clean ${added ? "added" : ""}`}
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
