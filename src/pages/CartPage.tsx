import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/Loading";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/format";

export function CartPage() {
  const { items, subtotal, update, remove } = useCart();
  if (!items.length) return <main className="page container"><EmptyState title="Giỏ hàng đang trống" description="Một khu vườn nhỏ đang chờ bạn khám phá." /><div className="center"><Link className="button" to="/products">Xem sản phẩm</Link></div></main>;
  return <main className="page container"><div className="page-title left"><span className="eyebrow">Giỏ hàng</span><h1>{items.length} sản phẩm đã chọn</h1></div><div className="cart-layout"><div className="cart-list">{items.map((item) => <article className="cart-item" key={item.key}><img src={item.product.images[0] || "/logo.png"} alt={item.product.name} /><div className="grow"><Link to={`/products/${item.product.slug}`}><h3>{item.product.name}</h3></Link><p>{Object.entries(item.variants).map(([key, value]) => `${key}: ${value}`).join(" · ")}</p><strong>{formatMoney(item.unitPrice)}</strong></div><div className="quantity"><button onClick={() => update(item.key, item.quantity - 1)}><Minus /></button><span>{item.quantity}</span><button onClick={() => update(item.key, item.quantity + 1)}><Plus /></button></div><button className="icon-button danger" onClick={() => remove(item.key)}><Trash2 /></button></article>)}</div><aside className="order-summary"><h2>Tóm tắt</h2><div><span>Tạm tính</span><b>{formatMoney(subtotal)}</b></div><div><span>Phí vận chuyển</span><span>Tính ở bước tiếp theo</span></div><hr /><div className="total"><span>Tổng dự kiến</span><strong>{formatMoney(subtotal)}</strong></div><Link className="button wide" to="/checkout"><ShoppingBag /> Tiến hành thanh toán</Link></aside></div></main>;
}
