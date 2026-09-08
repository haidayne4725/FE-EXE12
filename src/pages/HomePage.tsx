import { ArrowRight, Droplets, Gift, Leaf, ShieldCheck, Sparkles, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../components/Loading";
import { ProductCard } from "../components/ProductCard";
import { getProducts } from "../services/catalogService";
import type { Product } from "../types/catalog";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getProducts({ featured: true, limit: 4 }).then((page) => setProducts(page.products)).finally(() => setLoading(false)); }, []);
  return <main>
    <section className="hero"><div className="hero-overlay" /><img src="/home-hero-full-banner.png" alt="Terrarium Tiệm Rêu" />
      <div className="container hero-content"><span className="hero-kicker"><Sparkles size={16} /> Khu vườn thu nhỏ, bình yên thật gần</span><h1>Mang thiên nhiên<br />vào từng góc nhỏ.</h1>
      <p>Terrarium được làm thủ công, chọn lọc rêu và cây khỏe, đi kèm hướng dẫn chăm sóc riêng.</p><div className="hero-actions"><Link className="button" to="/products">Khám phá sản phẩm <ArrowRight size={18} /></Link><Link className="button outline light" to="/consult">Nhờ tư vấn</Link></div></div>
    </section>
    <section className="benefits container"><div><Leaf /><b>Thủ công tỉ mỉ</b><span>Mỗi bố cục là một khu rừng riêng</span></div><div><ShieldCheck /><b>Đóng gói an toàn</b><span>Hỗ trợ nhanh khi có sự cố</span></div><div><Droplets /><b>Hướng dẫn chăm sóc</b><span>Phù hợp cả với người mới</span></div><div><Gift /><b>Quà tặng xanh</b><span>Nhỏ xinh và giàu ý nghĩa</span></div></section>
    <section className="section container"><div className="section-heading"><div><span className="eyebrow">Bộ sưu tập được yêu thích</span><h2>Một mảng xanh dành cho bạn</h2></div><Link to="/products">Xem tất cả <ArrowRight size={17} /></Link></div>
      {loading ? <Loading /> : <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
    </section>
    <section className="story-section"><div className="container story-grid"><img src="/terrarium_hero_split.png" alt="Terrarium thủ công" /><div><span className="eyebrow">Chăm một khu rừng nhỏ</span><h2>Đủ xanh để dịu lại.<br />Đủ nhỏ để ở bên bạn.</h2><p>Chúng mình tin rằng một chiếc terrarium không chỉ là món décor. Đó là thói quen quan sát, chăm sóc và dành một khoảng chậm cho bản thân.</p><div className="story-points"><span><Sun /> Ánh sáng gián tiếp</span><span><Droplets /> Độ ẩm vừa đủ</span><span><Leaf /> Chăm sóc nhẹ nhàng</span></div><Link className="text-link" to="/blog">Đọc góc chăm cây <ArrowRight size={16} /></Link></div></div></section>
  </main>;
}
