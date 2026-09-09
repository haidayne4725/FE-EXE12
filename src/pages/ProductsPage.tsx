import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/catalog";
import mockData from "../mock/mockData.json";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products] = useState<Product[]>(mockData.products as unknown as Product[]);

  const selectedCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("q") || "";

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "all" ||
        p.categoryId === selectedCategory ||
        p.categoryName?.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleCategoryChange = (catSlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (catSlug === "all") {
      params.delete("category");
    } else {
      params.set("category", catSlug);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (!val.trim()) {
      params.delete("q");
    } else {
      params.set("q", val);
    }
    setSearchParams(params);
  };

  const categoryPills = [
    { id: "all", name: "Tất cả" },
    { id: "Bể basic", name: "Bể basic" },
    { id: "Bể cao cấp", name: "Bể cao cấp" },
    { id: "Bể cá sinh viên", name: "Bể cá sinh viên" },
    { id: "Cây xanh", name: "Cây xanh" },
    { id: "Phụ kiện", name: "Phụ kiện" },
    { id: "Tranh rêu", name: "Tranh rêu" },
  ];

  return (
    <main className="greenify-products-page container">
      {/* PAGE HEADER ROW */}
      <div className="products-page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-subtitle">{filteredProducts.length} sản phẩm đang có</p>
        </div>

        {/* TOP RIGHT SEARCH BAR */}
        <div className="products-search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button type="button" className="search-btn" title="Tìm kiếm">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* DANH MỤC SECTION BAR */}
      <div className="category-filter-section">
        <div className="category-divider-row">
          <span className="category-label flex-icon">
            <SlidersHorizontal size={14} /> DANH MỤC
          </span>
          <div className="divider-line" />
        </div>

        <div className="category-pills-row">
          {categoryPills.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-pill-btn ${isActive ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCT CARDS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h3>Không tìm thấy sản phẩm phù hợp</h3>
          <p>Thử tìm kiếm với từ khóa khác hoặc chọn lại danh mục sản phẩm.</p>
          <button type="button" className="button" onClick={() => setSearchParams({})}>
            Xem tất cả sản phẩm
          </button>
        </div>
      ) : (
        <div className="products-grid-3">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* BOTTOM CONSULTATION BANNER */}
      <section className="products-custom-cta-banner">
        <div className="custom-cta-content">
          <h2>Chưa tìm thấy sản phẩm ưng ý?</h2>
          <p>
            Greenify cung cấp dịch vụ thiết kế Terrarium theo yêu cầu riêng của bạn. Đội ngũ nghệ nhân sẽ hỗ trợ lên ý tưởng và hiện thực hóa mảng xanh lý tưởng.
          </p>
          <Link to="/consult" className="custom-cta-btn">
            Nhận tư vấn ngay <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
