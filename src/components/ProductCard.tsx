import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/catalog";
import { formatMoney } from "../utils/format";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const soldOut = product.inventory <= 0 || product.status === "OUT_OF_STOCK";
  return <article className="product-card">
    <Link to={`/products/${product.slug}`} className="product-image-wrap">
      <img src={product.images[0] || "/logo.png"} alt={product.name} className="product-image" />
      {product.featured && <span className="pill floating">Nổi bật</span>}
      {product.salePrice && <span className="sale-badge">Sale</span>}
    </Link>
    <div className="product-card-body">
      <span className="eyebrow">{product.categoryName}</span>
      <Link to={`/products/${product.slug}`}><h3>{product.name}</h3></Link>
      <div className="rating"><Star size={15} fill="currentColor" /> {product.rating || "Mới"} <span>({product.reviewCount})</span></div>
      <div className="price-row"><strong>{formatMoney(product.effectivePrice)}</strong>{product.salePrice && <del>{formatMoney(product.basePrice)}</del>}</div>
      <div className="card-actions">
        <button className="icon-button ghost" title="Yêu thích"><Heart size={18} /></button>
        <button disabled={soldOut} onClick={() => add(product)}><ShoppingBag size={17} /> {soldOut ? "Hết hàng" : "Thêm giỏ"}</button>
      </div>
    </div>
  </article>;
}
