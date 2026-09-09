import { ArrowRight, ShoppingBag, Star, Heart, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/catalog";
import mockData from "../mock/mockData.json";
import { formatMoney } from "../utils/format";

export function ExplorePage() {
  const [products] = useState<Product[]>(mockData.products as unknown as Product[]);
  const { add } = useCart();

  const featuredSpotlight = products.find((p) => p.name.includes("Foam")) || products[0];
  const section1Products = products.slice(6, 9);
  const section2Products = products.slice(0, 6);
  const section3Products = products.slice(2, 8);

  return (
    <main className="greenify-explore-page">
      {/* 1. HERO SPOTLIGHT BANNER */}
      {featuredSpotlight && (
        <section className="explore-hero-spotlight container">
          <div className="spotlight-inner">
            <img src={featuredSpotlight.images[0]} alt={featuredSpotlight.name} className="spotlight-bg-img" />
            <div className="spotlight-content">
              <span className="spotlight-category">Phụ kiện</span>
              <h1 className="spotlight-title">{featuredSpotlight.name}</h1>
              
              <div className="spotlight-price-row">
                <span className="discount-tag">-3%</span>
                <span className="spotlight-price">{formatMoney(featuredSpotlight.effectivePrice)}</span>
                <del className="spotlight-old-price">{formatMoney(featuredSpotlight.basePrice)}</del>
              </div>

              <div className="spotlight-actions">
                <Link to={`/products/${featuredSpotlight.slug}`} className="spotlight-btn primary">
                  Xem chi tiết <ArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  className="spotlight-btn secondary"
                  onClick={() => add(featuredSpotlight, 1)}
                >
                  Thêm vào giỏ hàng <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. SECTION 1: SẢN PHẨM NỔI BẬT */}
      <section className="explore-section container">
        <div className="explore-section-header">
          <div className="explore-icon-title">
            <Star size={24} className="section-icon" />
            <div>
              <h2>Sản phẩm nổi bật</h2>
              <p>Được yêu thích và lựa chọn nhiều nhất</p>
            </div>
          </div>
        </div>

        <div className="products-grid-3">
          {section1Products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 3. SECTION 2: ĐƯỢC YÊU THÍCH */}
      <section className="explore-section container">
        <div className="explore-section-header">
          <div className="explore-icon-title">
            <Heart size={24} className="section-icon" />
            <div>
              <h2>Được yêu thích</h2>
              <p>Bình chọn cao nhất từ cộng đồng</p>
            </div>
          </div>
        </div>

        <div className="products-grid-3">
          {section2Products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. SECTION 3: MỚI RỜI XƯỞNG */}
      <section className="explore-section container">
        <div className="explore-section-header">
          <div className="explore-icon-title">
            <Clock size={24} className="section-icon" />
            <div>
              <h2>Mới rời xưởng</h2>
              <p>Vừa ra mắt, sẵn sàng khám phá</p>
            </div>
          </div>
        </div>

        <div className="products-grid-3">
          {section3Products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="explore-bottom-cta">
        <div className="container cta-content">
          <h2>Chưa tìm thấy sản phẩm ưng ý?</h2>
          <p>Xem toàn bộ, bộ sưu tập của chúng tôi hoặc liên hệ để được tư vấn thiết kế Terrarium riêng.</p>
          <div className="cta-btn-group">
            <Link to="/products" className="hero-btn primary">
              Xem tất cả <ArrowRight size={18} />
            </Link>
            <Link to="/consult" className="hero-btn secondary">
              Nhận tư vấn ngay
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
