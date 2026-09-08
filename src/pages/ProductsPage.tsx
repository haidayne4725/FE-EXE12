import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState, Loading } from "../components/Loading";
import { ProductCard } from "../components/ProductCard";
import { getCategories, getProducts } from "../services/catalogService";
import type { Category, ProductPage } from "../types/catalog";

export function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<ProductPage | null>(null);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { getCategories().then(setCategories); }, []);
  useEffect(() => { const timer = setTimeout(() => { setLoading(true); getProducts({ search: search || undefined, categoryId: categoryId || undefined, limit: 24 }).then(setPage).finally(() => setLoading(false)); }, 250); return () => clearTimeout(timer); }, [search, categoryId]);
  return <main className="page container"><div className="page-title"><span className="eyebrow">Terrarium & phụ kiện</span><h1>Tìm khu vườn của riêng bạn</h1><p>Mỗi sản phẩm đều có thông tin setup, mức chăm sóc và tồn kho thật từ hệ thống.</p></div>
    <div className="catalog-toolbar"><label className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên sản phẩm..." /></label><label className="select-box"><SlidersHorizontal size={18} /><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">Tất cả danh mục</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label></div>
    {loading ? <Loading /> : page?.products.length ? <><div className="result-count">{page.total} sản phẩm</div><div className="product-grid">{page.products.map((product) => <ProductCard key={product.id} product={product} />)}</div></> : <EmptyState title="Chưa tìm thấy sản phẩm" description="Hãy thử từ khóa hoặc danh mục khác." />}
  </main>;
}
