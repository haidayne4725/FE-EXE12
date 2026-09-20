import { ArrowRight, Leaf, Sparkles, Gift } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/catalog";
import mockData from "../mock/mockData.json";

export function HomePage() {
  const [featuredProducts] = useState<Product[]>(
    (mockData.products as unknown as Product[]).slice(0, 3)
  );

  const blogPosts = mockData.blogs;

  return (
    <main className="greenify-homepage-clean">
      <div className="container">
        {/* 1. HERO BANNER CARD CONTAINER */}
        <section className="hero-card-container">
          <div className="hero-card-inner">
            <div className="hero-left-content">
              <span className="hero-badge-clean">VỀ CHÚNG TÔI</span>
              <h1 className="hero-headline-clean">
                Tạo nên những thiết kế<br />Terrarium mang dấu ấn riêng
              </h1>
              <p className="hero-subtext-clean">
                GREENIFY mang thiên nhiên đến gần hơn với cuộc sống hiện đại thông qua những sản phẩm terrarium và moss decor được thiết kế theo phong cách và nhu cầu riêng của mỗi người. Với sự kết hợp giữa công nghệ, cá nhân hóa và lối sống xanh, GREENIFY giúp bạn tạo nên một “thế giới xanh” nhỏ bé, độc đáo và mang dấu ấn của riêng mình.
              </p>
              <div className="hero-cta-row">
                <Link to="/products" className="hero-btn-dark">
                  Khám phá cửa hàng <ArrowRight size={18} />
                </Link>
                <a
                  href="https://zalo.me/0706668296"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-white"
                >
                  Nhận tư vấn ngay
                </a>
              </div>
            </div>

            <div className="hero-right-img-wrap">
              <img
                src="/greenify/1f3424b56b9cde408b8784360e52226ac96b63f9.png"
                alt="Greenify Terrarium Art"
                className="hero-right-img"
              />
            </div>
          </div>

          {/* 3 FLOATING BENEFIT CARDS */}
          <div className="hero-benefits-floating-row">
            <div className="benefit-card-clean">
              <div className="benefit-icon-circle">
                <Leaf size={20} />
              </div>
              <div className="benefit-text-box">
                <h4>Vật liệu cao cấp</h4>
                <p>Chỉ sử dụng nguyên liệu tự nhiên tốt nhất cho sức khỏe hệ sinh thái.</p>
              </div>
            </div>

            <div className="benefit-card-clean">
              <div className="benefit-icon-circle">
                <Sparkles size={20} />
              </div>
              <div className="benefit-text-box">
                <h4>Tay nghề chế tác</h4>
                <p>Từng sản phẩm được hoàn thiện thủ công bởi các nghệ nhân tận tâm.</p>
              </div>
            </div>

            <div className="benefit-card-clean">
              <div className="benefit-icon-circle">
                <Gift size={20} />
              </div>
              <div className="benefit-text-box">
                <h4>Động lực cảm hứng</h4>
                <p>Mang thiên nhiên hùng vĩ vào không gian sống của bạn.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURED PRODUCTS SECTION */}
        <section className="home-section-clean">
          <div className="section-head-clean">
            <span className="eyebrow-text-clean">ĐƯỢC LỰA CHỌN CHO BẠN</span>
            <h2 className="section-title-clean">Sản Phẩm Từ Greenify</h2>
          </div>

          <div className="products-grid-3">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* 3. BLOG SHOWCASE SECTION */}
        <section className="home-section-clean">
          <div className="section-head-flex-clean">
            <h2 className="section-title-clean">Góc Chia Sẻ</h2>
            <Link to="/blog" className="view-all-blog-btn">
              Xem tất cả bài viết <ArrowRight size={16} />
            </Link>
          </div>

          <div className="blogs-grid-3">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card-clean">
                <Link to={`/blog/${post.slug}`} className="blog-thumb-clean">
                  <img src={post.image} alt={post.title} />
                </Link>
                <div className="blog-body-clean">
                  <Link to={`/blog/${post.slug}`} className="blog-title-link">
                    <h3 className="blog-title-clean">{post.title}</h3>
                  </Link>
                  <p className="blog-summary-clean">{post.summary}</p>
                  <div className="blog-date-clean">
                    📅 {post.publishDate}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
