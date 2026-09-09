import { Calendar, Percent, Plus, Tag, Ticket } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { campaigns, saveCampaign, type Campaign } from "../../services/adminService";
import { getApiMessage } from "../../services/axiosClient";
import { formatMoney } from "../../utils/format";
import { AdminHead } from "./AdminDashboard";

const localDate = (days: number) => {
  const date = new Date(Date.now() + days * 86400000);
  return date.toISOString().slice(0, 16);
};

export function AdminVouchers() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE",
    value: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 100000,
    startsAt: localDate(0),
    expiresAt: localDate(30),
    usageLimit: 100,
    status: "ACTIVE",
    description: "",
  });
  const [message, setMessage] = useState("");

  const load = () => campaigns().then(setItems);

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await saveCampaign({
        ...form,
        startsAt: new Date(form.startsAt).toISOString(),
        expiresAt: new Date(form.expiresAt).toISOString(),
        applicableTo: "ALL",
        applicableIds: [],
      });
      setMessage("Đã khởi tạo chương trình voucher thành công!");
      setForm({
        code: "",
        type: "PERCENTAGE",
        value: 10,
        minOrderAmount: 0,
        maxDiscountAmount: 100000,
        startsAt: localDate(0),
        expiresAt: localDate(30),
        usageLimit: 100,
        status: "ACTIVE",
        description: "",
      });
      await load();
    } catch (error) {
      setMessage(getApiMessage(error));
    }
  }

  return (
    <>
      <AdminHead
        title="Mã Giảm Giá & Voucher"
        description="Quản lý chương trình khuyến mãi, ưu đãi vận chuyển và voucher độc quyền Greenify."
      />

      <div className="admin-two-columns" style={{ gridTemplateColumns: "400px 1fr", gap: "1.75rem" }}>
        {/* Create Voucher Form Panel */}
        <form className="panel" onSubmit={submit} style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", color: "var(--greenify-base-black)" }}>
            <Plus size={18} color="var(--greenify-main-color)" /> Tạo Chương Trình Mới
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--greenify-base-black)" }}>
              Mã Voucher
              <input
                required
                placeholder="VD: REUVIET2026"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                style={{ padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--greenify-frame-2)", background: "var(--greenify-bg)", width: "100%", boxSizing: "border-box" }}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--greenify-base-black)" }}>
                Loại Giảm
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{ padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--greenify-frame-2)", background: "var(--greenify-bg)", width: "100%", boxSizing: "border-box" }}
                >
                  <option value="PERCENTAGE">Phần trăm (%)</option>
                  <option value="FIXED">Cố định (VNĐ)</option>
                  <option value="FREE_SHIPPING">Freeship</option>
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--greenify-base-black)" }}>
                Giá Trị Giảm
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  style={{ padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--greenify-frame-2)", background: "var(--greenify-bg)", width: "100%", boxSizing: "border-box" }}
                />
              </label>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--greenify-base-black)" }}>
              Đơn Hàng Tối Thiểu (VNĐ)
              <input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                style={{ padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--greenify-frame-2)", background: "var(--greenify-bg)", width: "100%", boxSizing: "border-box" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--greenify-base-black)" }}>
              Ngày Bắt Đầu
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                style={{ padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--greenify-frame-2)", background: "var(--greenify-bg)", fontSize: "0.85rem", width: "100%", boxSizing: "border-box" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--greenify-base-black)" }}>
              Ngày Kết Thúc
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                style={{ padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--greenify-frame-2)", background: "var(--greenify-bg)", fontSize: "0.85rem", width: "100%", boxSizing: "border-box" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--greenify-base-black)" }}>
              Mô Tả Khuyến Mãi
              <input
                placeholder="VD: Ưu đãi rêu việt 10% đơn từ 200k"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--greenify-frame-2)", background: "var(--greenify-bg)", width: "100%", boxSizing: "border-box" }}
              />
            </label>
          </div>

          {message && (
            <p className="notice success" style={{ marginTop: "1rem", marginBottom: 0 }}>
              {message}
            </p>
          )}

          <button style={{ marginTop: "1.25rem", width: "100%", justifyContent: "center", background: "var(--greenify-main-color)", color: "#ffffff", padding: "0.75rem", borderRadius: "var(--radius-sm)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Ticket size={18} /> Tạo Voucher Mới
          </button>
        </form>

        {/* Existing Vouchers Panel */}
        <div className="panel" style={{ margin: 0 }}>
          <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", color: "var(--greenify-base-black)" }}>
            <Tag size={18} color="var(--greenify-main-color)" /> Danh Sách Voucher Hiện Có ({items.length})
          </h2>

          <div style={{ display: "grid", gap: "1rem" }}>
            {items.map((item) => {
              const usagePercent = item.usageLimit ? Math.min(100, Math.round((item.usageCount / item.usageLimit) * 100)) : 0;
              return (
                <div
                  key={item.id}
                  style={{
                    background: "var(--greenify-bg)",
                    border: "1px solid var(--greenify-frame-2)",
                    borderLeft: "5px solid var(--greenify-main-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.2rem 1.35rem",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "#EEF2EB",
                          color: "var(--greenify-main-color)",
                          fontWeight: 800,
                          fontSize: "1.05rem",
                          letterSpacing: "0.05em",
                          padding: "0.2rem 0.75rem",
                          borderRadius: "6px",
                          border: "1px dashed var(--greenify-main-color)",
                        }}
                      >
                        {item.code}
                      </span>
                      <span
                        className="badge-tag"
                        style={{
                          background: item.type === "PERCENTAGE" ? "var(--greenify-iris-bg)" : "#E0F2FE",
                          color: item.type === "PERCENTAGE" ? "var(--greenify-iris-primary)" : "#0369A1",
                        }}
                      >
                        {item.type === "PERCENTAGE" ? (
                          <>
                            <Percent size={12} /> Giảm {item.value}%
                          </>
                        ) : item.type === "FREE_SHIPPING" ? (
                          "Miễn phí vận chuyển"
                        ) : (
                          `Giảm ${formatMoney(item.value)}`
                        )}
                      </span>
                      <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>

                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.88rem", color: "var(--greenify-location-rate)" }}>
                      {item.description || "Ưu đãi đặc quyền từ Greenify Studio"}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.8rem", color: "var(--greenify-sub-title)" }}>
                      <span>
                        <Calendar size={13} style={{ verticalAlign: "-2px", marginRight: "3px" }} />
                        Hạn dùng: {new Date(item.expiresAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span>Đơn tối thiểu: {formatMoney(item.minOrderAmount)}</span>
                    </div>
                  </div>

                  <div style={{ minWidth: "120px", textAlign: "right" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--greenify-main-color)", display: "block", marginBottom: "0.3rem" }}>
                      Đã dùng {item.usageCount}/{item.usageLimit || "∞"}
                    </span>
                    {item.usageLimit ? (
                      <div style={{ height: "6px", width: "100%", background: "var(--greenify-frame-2)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${usagePercent}%`, background: "var(--greenify-main-color)" }} />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}


