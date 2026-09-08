import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState, Loading } from "../../components/Loading";
import { moderateReview, reviews } from "../../services/adminService";
import type { Review } from "../../types/commerce";
import { formatDate } from "../../utils/format";
import { AdminHead } from "./AdminDashboard";

export function AdminReviews() { const [items, setItems] = useState<Review[] | null>(null); const load = () => reviews("PENDING").then(setItems); useEffect(() => { load(); }, []); async function moderate(id: string, approved: boolean) { await moderateReview(id, approved); setItems((current) => current?.filter((item) => item.id !== id) || []); } return <><AdminHead title="Duyệt đánh giá" description="Chỉ review đã mua và giao thành công mới được gửi; review phải duyệt trước khi public." />{!items ? <Loading /> : items.length ? <div className="review-admin-list">{items.map((review) => <article className="panel" key={review.id}><div className="review-admin-head"><div><b>{review.customerName}</b><span>{review.productName} · {formatDate(review.createdAt)}</span></div><strong>{"★".repeat(review.rating)}</strong></div><h3>{review.title}</h3><p>{review.content}</p><div><button onClick={() => moderate(review.id, true)}><Check /> Duyệt</button><button className="outline danger" onClick={() => moderate(review.id, false)}><X /> Từ chối</button></div></article>)}</div> : <EmptyState title="Không có đánh giá chờ duyệt" />}</>; }
