import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, Loading } from "../components/Loading";
import { getOrders } from "../services/commerceService";
import type { Order } from "../types/commerce";
import { formatDate, formatMoney } from "../utils/format";

export function OrdersPage() { const [orders, setOrders] = useState<Order[] | null>(null); useEffect(() => { getOrders().then(setOrders); }, []); return <main className="page container"><div className="page-title left"><span className="eyebrow">Tài khoản</span><h1>Đơn hàng của tôi</h1></div>{!orders ? <Loading /> : orders.length ? <div className="order-list">{orders.map((order) => <Link className="order-card" key={order.id} to={`/orders/${order.id}`}><Package /><div className="grow"><b>{order.orderNumber}</b><span>{formatDate(order.createdAt)} · {order.items.length} sản phẩm</span></div><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span><strong>{formatMoney(order.total)}</strong></Link>)}</div> : <EmptyState title="Bạn chưa có đơn hàng" />}</main>; }
