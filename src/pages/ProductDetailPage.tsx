import { Bot, Check, Heart, Minus, Plus, ShoppingBag, Star, ThumbsUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import { useCart } from "../context/CartContext";
import { getProduct, toggleVote } from "../services/catalogService";
import { getReviews, toggleFavorite } from "../services/commerceService";
import { getApiMessage } from "../services/axiosClient";
import { recommend } from "../services/ragService";
import { currentUser } from "../services/authService";
import type { Product } from "../types/catalog";
import type { Review } from "../types/commerce";
import { formatMoney } from "../utils/format";

export function ProductDetailPage() {
  const { slug = "" } = useParams(); const navigate = useNavigate(); const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null); const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1); const [variants, setVariants] = useState<Record<string, string>>({});
  const [ai, setAi] = useState(""); const [message, setMessage] = useState("");
  useEffect(() => { getProduct(slug).then((item) => { setProduct(item); const defaults: Record<string, string> = {}; item.variants.forEach((variant) => { if (!defaults[variant.variantType]) defaults[variant.variantType] = variant.value; }); setVariants(defaults); getReviews(item.id).then(setReviews); }).catch((error) => setMessage(getApiMessage(error))); }, [slug]);
  const totalPrice = useMemo(() => { if (!product) return 0; const adjustment = product.variants.filter((variant) => variants[variant.variantType] === variant.value).reduce((sum, variant) => sum + variant.priceAdjustment, 0); return (product.effectivePrice + adjustment) * quantity; }, [product, variants, quantity]);
  if (!product) return <main className="page container">{message ? <div className="notice error">{message}</div> : <Loading />}</main>;
  const variantTypes = [...new Set(product.variants.map((variant) => variant.variantType))];
  return <main className="page container"><div className="product-detail">
    <div className="gallery"><img src={product.images[0] || "/logo.png"} alt={product.name} />{product.images.slice(1).map((image) => <img key={image} src={image} alt="" />)}</div>
    <div className="product-info"><span className="eyebrow">{product.categoryName}</span><h1>{product.name}</h1><div className="rating"><Star fill="currentColor" size={17} /> {product.rating || "Mới"} · {product.reviewCount} đánh giá · {product.voteCount} bình chọn</div>
      <div className="detail-price">{formatMoney(product.effectivePrice)}{product.salePrice && <del>{formatMoney(product.basePrice)}</del>}</div><p>{product.description || product.shortConsultNote}</p>
      <div className="product-facts"><span><Check /> {product.setupStatus || "Sản phẩm hoàn thiện"}</span><span><Check /> Mức chăm sóc: {product.careLevel || "Dễ"}</span><span><Check /> Còn {product.inventory} sản phẩm</span></div>
      {variantTypes.map((type) => <div className="variant-group" key={type}><b>{type}</b><div>{product.variants.filter((variant) => variant.variantType === type).map((variant) => <button className={variants[type] === variant.value ? "selected" : ""} key={variant.id} onClick={() => setVariants((value) => ({ ...value, [type]: variant.value }))}>{variant.value}{variant.priceAdjustment > 0 && ` +${formatMoney(variant.priceAdjustment)}`}</button>)}</div></div>)}
      <div className="purchase-row"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus /></button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}><Plus /></button></div><button className="wide" disabled={product.inventory < 1} onClick={() => add(product, quantity, variants)}><ShoppingBag /> Thêm vào giỏ · {formatMoney(totalPrice)}</button></div>
      <div className="secondary-actions"><button onClick={async () => { if (!currentUser()) return navigate("/login"); setProduct(await toggleVote(product.id)); }}><ThumbsUp /> {product.userVoted ? "Bỏ bình chọn" : "Bình chọn"}</button><button onClick={async () => { if (!currentUser()) return navigate("/login"); await toggleFavorite(product.id); setMessage("Đã cập nhật danh sách yêu thích"); }}><Heart /> Yêu thích</button><button onClick={async () => { setAi("Đang tạo gợi ý..."); try { setAi((await recommend(product.id)).answer); } catch (error) { setAi(getApiMessage(error)); } }}><Bot /> AI tư vấn</button></div>
      {message && <div className="notice">{message}</div>}{ai && <div className="ai-answer"><b>Trợ lý Tiệm Rêu</b><p>{ai}</p></div>}
    </div></div>
    {product.careGuide && <section className="care-guide"><h2>Hướng dẫn chăm sóc</h2><div><article><b>Tưới nước</b><p>{product.careGuide.watering}</p></article><article><b>Ánh sáng</b><p>{product.careGuide.sunlight}</p></article><article><b>Nhiệt độ & độ ẩm</b><p>{product.careGuide.temperature} · {product.careGuide.humidity}</p></article><article><b>Lưu ý</b><p>{product.careGuide.commonIssues}</p></article></div></section>}
    <section className="reviews"><h2>Đánh giá đã duyệt</h2>{reviews.length ? reviews.map((review) => <article key={review.id}><div><b>{review.customerName}</b><span>{"★".repeat(review.rating)}</span></div><h4>{review.title}</h4><p>{review.content}</p></article>) : <p>Chưa có đánh giá công khai.</p>}</section>
  </main>;
}
