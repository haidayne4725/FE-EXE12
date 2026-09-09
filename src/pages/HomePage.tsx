import { ArrowRight, Leaf, Sparkles, Gift, Star, Award, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/catalog";
import mockData from "../mock/mockData.json";

export function HomePage() {
  const [featuredProducts] = useState<Product[]>(
    (mockData.products as unknown as Product[]).slice(0, 3)
  );

  return (
    <main className="greenify-homepage">
      {/* 1. HERO BANNER */}
      <section className="homepage-hero-section">
        <div className="hero-bg-overlay" />
        <img
          src="/greenify/hero-terrarium-banner.png"
          alt="Greenify Crafting Terrarium"
          className="hero-bg-image"
        />
        <div className="hero-content-container">
          <div className="hero-badge">VỀ CHÚNG TÔI</div>
          <h1 className="hero-headline">
            Tạo nên những thiết kế<br />Terrarium mang dấu ấn riêng
          </h1>
          <p className="hero-subtext">
            Mỗi terrarium được tạo hình tỉ mỉ, kết hợp thiết kế thủy tinh đẹp mắt với hệ thực vật được chọn lọc để mang thiên nhiên thanh tạo vào không gian sống của bạn.
          </p>
          <div className="hero-cta-group">
            <Link to="/products" className="hero-btn primary">
              Khám phá cửa hàng <ArrowRight size={18} />
            </Link>
            <Link to="/consult" className="hero-btn secondary">
              Nhận tư vấn ngay
            </Link>
          </div>
        </div>

        {/* 3 FLOATING BENEFIT CARDS BELOW HERO */}
        <div className="hero-benefits-row container">
          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <Leaf size={22} />
            </div>
            <div className="benefit-info">
              <h4>Thiết kế theo cá nhân</h4>
              <p>Terrarium được tạo riêng theo phong cách và nhu cầu của bạn</p>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <Sparkles size={22} />
            </div>
            <div className="benefit-info">
              <h4>Thủ công tỉ mỉ</h4>
              <p>Mỗi sản phẩm handmade được chăm chút trong từng chi tiết.</p>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <Gift size={22} />
            </div>
            <div className="benefit-info">
              <h4>Quà tặng & Trang trí</h4>
              <p>Phù hợp cho bàn làm việc, phòng khách hoặc những món quà tinh tế.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS SECTION */}
      <section className="homepage-section container">
        <div className="section-header-flex">
          <div>
            <span className="section-eyebrow">ĐƯỢC LỰA CHỌN CHO BẠN</span>
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          </div>
          <Link to="/products" className="section-more-btn">
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>

        <div className="products-grid-3">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 3. BLOG SECTION */}
      <section className="homepage-section container">
        <div className="section-header-flex">
          <h2 className="section-title">Góc Chia Sẻ</h2>
          <Link to="/blog" className="section-more-btn">
            Xem tất cả bài viết <ArrowRight size={16} />
          </Link>
        </div>

        <div className="blogs-grid-3">
          {mockData.blogs.map((post) => (
            <article key={post.id} className="greenify-blog-card">
              <Link to={`/blog/${post.slug}`} className="blog-card-thumb">
                <img src={post.image} alt={post.title} />
              </Link>
              <div className="blog-card-body">
                <Link to={`/blog/${post.slug}`} className="blog-card-title-link">
                  <h3 className="blog-card-title">{post.title}</h3>
                </Link>
                <p className="blog-card-summary">{post.summary}</p>
                <div className="blog-card-footer">
                  <span className="blog-date">
                    <Calendar size={14} /> {post.publishDate}
                  </span>
                  <Link to={`/blog/${post.slug}`} className="read-more-link">
                    Đọc thêm <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. CUSTOMER FEEDBACK & PHONE MOCKUP SECTION */}
      <section className="homepage-feedback-section">
        <div className="container">
          <h2 className="feedback-section-title">
            Feedback từ <span className="title-underline">khách hàng đến Greenify</span>
          </h2>

          <div className="feedback-interactive-layout">
            {/* LEFT FEEDBACK CARDS */}
            <div className="feedback-col left">
              <div className="testimonial-card">
                <div className="user-info-row">
                  <div className="user-avatar">NH</div>
                  <div>
                    <strong>Nguyễn Hoàng Nam</strong>
                    <div className="user-meta">Hải Phòng • Đã mua</div>
                  </div>
                  <div className="stars">★★★★★</div>
                </div>
                <p className="quote">"Terrarium hệ kín rất dễ chăm sóc, đúng như quảng cáo. Trợ lý AI Tiệm Rêu hướng dẫn rất chi tiết."</p>
              </div>

              <div className="testimonial-card">
                <div className="user-info-row">
                  <div className="user-avatar">TH</div>
                  <div>
                    <strong>Phạm Thu Hà</strong>
                    <div className="user-meta">Hà Nội • Đã mua</div>
                  </div>
                  <div className="stars">★★★★★</div>
                </div>
                <p className="quote">"Mua làm quà tặng sinh nhật bạn, được khen không ngớt. Thiết kế tinh tế, rất đáng tiền."</p>
              </div>

              <div className="metric-box">
                <div className="metric-icon"><Gift size={20} /></div>
                <div>
                  <strong>2.500+</strong>
                  <span>Khách hàng hài lòng</span>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon"><Sparkles size={20} /></div>
                <div>
                  <strong>500+</strong>
                  <span>Sản phẩm handmade</span>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="user-info-row">
                  <div className="user-avatar">MK</div>
                  <div>
                    <strong>Trần Minh Khoa</strong>
                    <div className="user-meta">Hồ Chí Minh • Đã mua</div>
                  </div>
                  <div className="stars">★★★★★</div>
                </div>
                <p className="quote">"Shop tư vấn rất nhiệt tình, giao hàng nhanh. Terrarium đặt bàn làm việc trông sáng làm."</p>
              </div>
            </div>

            {/* CENTER PHONE MOCKUP */}
            <div className="phone-mockup-wrapper">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="instagram-header">
                    <div className="insta-avatar">
                      <span className="logo-script">Greenify</span>
                    </div>
                    <div className="insta-details">
                      <h4>Greenify</h4>
                      <p>greenify.com.vn@gmail.com</p>
                      <div className="insta-stats">
                        <span><strong>9.3K</strong> followers</span>
                        <span><strong>0</strong> following</span>
                        <span><strong>15</strong> posts</span>
                      </div>
                    </div>
                  </div>
                  <div className="insta-actions">
                    <button className="insta-btn follow">Follow</button>
                    <button className="insta-btn msg">Message</button>
                  </div>
                  <div className="insta-bio">
                    <p>một chút rêu, một chút xanh.</p>
                    <p>📍 Ho Chi Minh City, Vietnam</p>
                    <p>🕒 Open now</p>
                    <p>📍 32/16 Tam Da, Long Truong, Thu Duc City</p>
                    <p>🔗 greenify.com.vn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT FEEDBACK CARDS */}
            <div className="feedback-col right">
              <div className="testimonial-card">
                <div className="user-info-row">
                  <div className="user-avatar">HN</div>
                  <div>
                    <strong>Nguyễn Thị Lan</strong>
                    <div className="user-meta">Hải Phòng • Đã mua</div>
                  </div>
                  <div className="stars">★★★★★</div>
                </div>
                <p className="quote">"Terrarium đẹp hơn hình rất nhiều! Cây rất khỏe, đóng gói cẩn thận. Sẽ mua lại!"</p>
              </div>

              <div className="metric-box">
                <div className="metric-icon"><Star size={20} /></div>
                <div>
                  <strong>98%</strong>
                  <span>Đánh giá 5 sao</span>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon"><Award size={20} /></div>
                <div>
                  <strong>3 năm</strong>
                  <span>Kinh nghiệm</span>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="user-info-row">
                  <div className="user-avatar">TC</div>
                  <div>
                    <strong>Đỗ Thủy Chi</strong>
                    <div className="user-meta">Cần Thơ • Đã mua</div>
                  </div>
                  <div className="stars">★★★★★</div>
                </div>
                <p className="quote">"Bể rêu đẹp lung linh, đóng gói cẩn thận không sứt mẻ gì. Rất thích chính sách bảo hành thực vật của shop."</p>
              </div>

              <div className="testimonial-card">
                <div className="user-info-row">
                  <div className="user-avatar">VH</div>
                  <div>
                    <strong>Lê Văn Hùng</strong>
                    <div className="user-meta">Đà Nẵng • Đã mua</div>
                  </div>
                  <div className="stars">★★★★★</div>
                </div>
                <p className="quote">"Chất lượng tuyệt vời, nhân viên support nhiệt tình. Terrarium vẫn xanh tốt sau 3 tháng!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM SATISFACTION BANNER */}
      <section className="homepage-bottom-quote-banner">
        <div className="container quote-banner-inner">
          <p className="quote-text">
            “Sự hài lòng của quý khách hàng là động lực chăm sóc mảng xanh mỗi ngày của Greenify”
          </p>
          <div className="greenify-stamp-badge">
            Greenify
          </div>
        </div>
      </section>
    </main>
  );
}
