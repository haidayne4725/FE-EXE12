import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { getPolicies } from "../services/contentService";
import type { Policy } from "../types/content";

export function PoliciesPage() { const [policies, setPolicies] = useState<Policy[] | null>(null); useEffect(() => { getPolicies().then(setPolicies); }, []); return <main className="page container"><div className="page-title"><span className="eyebrow">Thông tin minh bạch</span><h1>Chính sách Tiệm Rêu</h1><p>Thông tin được lấy trực tiếp từ nội dung quản trị và cũng là nguồn dữ liệu cho RAG.</p></div>{!policies ? <Loading /> : <div className="policy-list">{policies.map((policy) => <article id={policy.slug} key={policy.id}><ShieldCheck /><div><span className="eyebrow">{policy.type}</span><h2>{policy.title}</h2><p>{policy.content}</p></div></article>)}</div>}</main>; }
