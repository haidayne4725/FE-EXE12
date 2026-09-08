import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import { orders, updateOrderStatus } from "../../services/adminService";
import type { Order } from "../../types/commerce";
import { formatDate, formatMoney } from "../../utils/format";
import { AdminHead } from "./AdminDashboard";

const states = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
export function AdminOrders() { const [items, setItems] = useState<Order[] | null>(null); const load = () => orders().then(setItems); useEffect(() => { load(); }, []); return <><AdminHead title="Đơn hàng" description="Cập nhật trạng thái và kích hoạt loyalty/care khi giao thành công." action={<button className="outline" onClick={load}><RefreshCw /> Làm mới</button>} />{!items ? <Loading /> : <div className="admin-table-wrap"><table><thead><tr><th>Mã đơn</th><th>Khách</th><th>Ngày đặt</th><th>Tổng</th><th>Thanh toán</th><th>Trạng thái</th></tr></thead><tbody>{items.map((order) => <tr key={order.id}><td><b>{order.orderNumber}</b><br /><small>{order.items.length} sản phẩm</small></td><td>{order.customerName || order.shippingInfo?.name || "Khách vãng lai"}</td><td>{formatDate(order.createdAt)}</td><td>{formatMoney(order.total)}</td><td>{order.paymentMethod}<br /><small>{order.paymentStatus}</small></td><td><select value={order.status} onChange={async (event) => { const updated = await updateOrderStatus(order.id, event.target.value); setItems((current) => current?.map((item) => item.id === order.id ? updated : item) || []); }}>{states.map((state) => <option key={state}>{state}</option>)}</select></td></tr>)}</tbody></table></div>}</>; }
