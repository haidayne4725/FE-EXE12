import { Pin, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { ProductCard } from "../components/ProductCard";
import { getExplore } from "../services/catalogService";
import type { ExploreData } from "../types/catalog";

export function ExplorePage() {
  const [data, setData] = useState<ExploreData | null>(null);
  useEffect(() => { getExplore().then(setData); }, []);
  if (!data) return <main className="page container"><Loading /></main>;
  const sections = [["pinned", "Được Tiệm Rêu ghim", Pin], ["topVoted", "Được cộng đồng bình chọn", Trophy], ["newArrivals", "Khu vườn mới về", Sparkles]] as const;
  return <main className="page container"><div className="page-title"><span className="eyebrow">Explore · dữ liệu thật</span><h1>Khám phá điều đang được yêu thích</h1><p>Thứ hạng dựa trên bình chọn thật; không sử dụng số vote giả.</p></div>{sections.map(([key, title, Icon]) => <section className="section compact" key={key}><div className="section-heading"><h2><Icon /> {title}</h2></div><div className="product-grid">{data[key].map((product) => <ProductCard key={product.id} product={product} />)}</div></section>)}</main>;
}
