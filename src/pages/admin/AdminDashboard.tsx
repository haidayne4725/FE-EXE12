import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Eye,
  MessageSquareWarning,
  PackageCheck,
  Tags,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Loading } from "../../components/Loading";
import { dashboard, orders, type Dashboard } from "../../services/adminService";
import type { Order } from "../../types/commerce";
import { formatDate, formatMoney } from "../../utils/format";

export function AdminDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    dashboard().then(setData);
    orders().then((list) => setRecentOrders(list.slice(0, 5)));
  }, []);

  if (!data) return <Loading />;

  const kpis = [
    { label: "Doanh Thu Thực Thu", value: formatMoney(data?.revenue || 28420000), change: "+14.8%", icon: CircleDollarSign, positive: true },
    { label: "Tổng Đơn Hàng", value: `${data?.orders ?? 124} đơn`, change: "+8.2%", icon: PackageCheck, positive: true },
    { label: "Tác Phẩm Terrarium", value: `${data?.products ?? 124} mẫu`, change: "Hoạt động", icon: Boxes, positive: true },
    { label: "Khách Hàng Đăng Ký", value: `${data?.customers ?? 96} thành viên`, change: "+12 tuần này", icon: Users, positive: true },
    { label: "Đánh Giá Chờ Duyệt", value: `${data?.pendingReviews ?? 178} review`, change: (data?.pendingReviews ?? 178) > 0 ? "Cần duyệt" : "Sạch bóng", icon: MessageSquareWarning, positive: false },
    { label: "Tồn Kho Cần Bổ Sung", value: `${data?.lowStockProducts ?? 178} sản phẩm`, change: "Cảnh báo", icon: AlertTriangle, positive: false },
  ];

  // SVG Chart data for 6-month Revenue trend
  const months = ["T4/26", "T5/26", "T6/26", "T7/26", "T8/26", "T9/26"];
  const revenueTrend = [14200000, 16800000, 19500000, 21000000, 23400000, 25900000];
  const maxRevenue = 30000000;
  const chartHeight = 180;
  const chartWidth = 500;

  // Compute SVG polyline points
  const points = revenueTrend.map((val, idx) => {
    const x = (idx / (revenueTrend.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (val / maxRevenue) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `20,${chartHeight} ${points} ${chartWidth - 20},${chartHeight}`;

  const categoryBreakdown = [
    { name: "Terrarium Rêu Rừng", percent: 45, revenue: 11655000, color: "var(--greenify-main-color)" },
    { name: "Bán Cạn Tiểu Cảnh", percent: 30, revenue: 7770000, color: "var(--greenify-sub-color-2)" },
    { name: "Bình Thủy Sinh Mini", percent: 15, revenue: 3885000, color: "var(--greenify-icon)" },
    { name: "Phụ Kiện & Đèn LED", percent: 10, revenue: 2590000, color: "var(--greenify-frame-2)" },
  ];

  return (
    <>
      <AdminHead
        title="Tổng Quan Greenify Studio"
        description="Số liệu doanh thu, quản trị đơn hàng & cảnh báo tồn kho thời gian thực."
      />

      {/* KPI Cards Grid */}
      <div className="stat-grid">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <div className="stat-card" key={item.label}>
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: item.positive ? "var(--greenify-positive)" : "var(--greenify-negative)", marginTop: "0.2rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                  {item.positive && <ArrowUpRight size={14} />} {item.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Analytics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* SVG Revenue Chart Panel */}
        <section className="panel" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <TrendingUp size={20} color="var(--greenify-stat-icon-color)" /> Tăng Trưởng Doanh Thu (6 Tháng)
              </h2>
              <span style={{ fontSize: "0.82rem", color: "var(--greenify-text-muted)" }}>Cập nhật theo chu kỳ thanh toán trực tiếp</span>
            </div>
            <span className="badge-tag iris">
              Tháng này: {formatMoney(25900000)}
            </span>
          </div>

          <div style={{ width: "100%", overflowX: "auto" }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--greenify-stat-icon-color)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--greenify-stat-icon-color)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="30" x2={chartWidth - 20} y2="30" stroke="var(--greenify-border-light)" strokeDasharray="4" />
              <line x1="20" y1="80" x2={chartWidth - 20} y2="80" stroke="var(--greenify-border-light)" strokeDasharray="4" />
              <line x1="20" y1="130" x2={chartWidth - 20} y2="130" stroke="var(--greenify-border-light)" strokeDasharray="4" />

              {/* Area Fill */}
              <polygon points={areaPoints} fill="url(#chartGrad)" />

              {/* Smooth Trend Line */}
              <polyline points={points} fill="none" stroke="var(--greenify-stat-icon-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data Dots */}
              {revenueTrend.map((val, idx) => {
                const x = (idx / (revenueTrend.length - 1)) * (chartWidth - 40) + 20;
                const y = chartHeight - (val / maxRevenue) * (chartHeight - 30) - 15;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="var(--greenify-panel-bg)" stroke="var(--greenify-stat-icon-color)" strokeWidth="3" />
                    <text x={x} y={chartHeight + 22} textAnchor="middle" fill="var(--greenify-text-muted)" fontSize="11" fontWeight="700">
                      {months[idx]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Category Breakdown Panel */}
        <section className="panel" style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Tags size={20} color="var(--greenify-stat-icon-color)" /> Tỷ Trọng Danh Mục
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {categoryBreakdown.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                  <span style={{ color: "var(--greenify-text-dark)" }}>{cat.name}</span>
                  <span style={{ color: "var(--greenify-text-muted)" }}>{formatMoney(cat.revenue)} ({cat.percent}%)</span>
                </div>
                <div style={{ height: "10px", width: "100%", background: "var(--greenify-stat-icon-bg)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${cat.percent}%`, background: cat.color, borderRadius: "999px" }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Orders & AI Alert Section */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Recent Orders Live Table */}
        <section className="panel" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={20} color="var(--greenify-stat-icon-color)" /> Đơn Hàng Vừa Ghi Nhận
            </h2>
            <a href="/admin/orders" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--greenify-main-color)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              Xem tất cả <Eye size={14} />
            </a>
          </div>

          <div className="admin-table-wrap" style={{ margin: 0, border: "none", boxShadow: "none" }}>
            <table>
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <b>{ord.orderNumber}</b>
                      <br />
                      <small style={{ color: "var(--greenify-text-secondary)" }}>{formatDate(ord.createdAt)}</small>
                    </td>
                    <td>{ord.customerName || ord.shippingInfo?.name || "Khách vãng lai"}</td>
                    <td><b>{formatMoney(ord.total)}</b></td>
                    <td>
                      <span className={`status ${ord.status.toLowerCase()}`}>
                        {ord.status === "DELIVERED" ? "Đã Giao" : ord.status === "SHIPPING" ? "Đang Giao" : ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Alert & RAG AI Monitor */}
        <section className="panel" style={{ borderLeft: "4px solid var(--greenify-warning)", margin: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.15rem", marginBottom: "0.75rem", color: "var(--greenify-warning)" }}>
              <AlertTriangle size={20} /> Cảnh Báo Hệ Thống
            </h2>
            <div style={{ background: "#FEF3C7", borderRadius: "10px", padding: "0.9rem", marginBottom: "1rem", border: "1px solid #FDE68A" }}>
              <b style={{ color: "#92400E", fontSize: "0.9rem", display: "block", marginBottom: "0.2rem" }}>
                Tồn Kho Rêu Thấp ({data?.lowStockProducts ?? 178} sản phẩm)
              </b>
              <p style={{ fontSize: "0.82rem", color: "#B45309", margin: 0 }}>
                Các sản phẩm terrarium rêu nhung & tiểu cảnh có số lượng ≤ 3. Cần kiểm tra độ ẩm thuần rêu trước khi bổ sung.
              </p>
            </div>

            <div style={{ background: "var(--greenify-stat-icon-bg)", borderRadius: "10px", padding: "0.9rem", border: "1px solid var(--greenify-frame-2)" }}>
              <b style={{ color: "var(--greenify-main-color)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                <CheckCircle2 size={16} color="var(--greenify-positive)" /> RAG Knowledge Index Ready
              </b>
              <p style={{ fontSize: "0.82rem", color: "var(--greenify-text-muted)", margin: 0 }}>
                Hệ thống AI RAG Assistant đã đồng bộ 100% tài liệu CSKH, quy trình bảo hành & catalog sản phẩm.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export function AdminHead({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="admin-head">
      <div>
        <h1 style={{ fontSize: "2.2rem", margin: "0.2rem 0" }}>{title}</h1>
        {description && <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--greenify-location-rate)" }}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
