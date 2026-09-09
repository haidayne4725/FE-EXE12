import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Loading } from "../../components/Loading";
import { deleteProduct, getCategories, getProducts, saveProduct } from "../../services/catalogService";
import { getApiMessage } from "../../services/axiosClient";
import type { Category, Product } from "../../types/catalog";
import { formatMoney } from "../../utils/format";
import { AdminHead } from "./AdminDashboard";

const empty = {
  name: "",
  slug: "",
  basePrice: 0,
  salePrice: "",
  inventory: 0,
  categoryId: "",
  status: "ACTIVE",
  description: "",
  setupStatus: "READY_TO_DISPLAY",
  careLevel: "EASY",
  image: "/greenify/103030178d272cf117fd67a3e50134fb539ff7d8.png",
  watering: "Kiểm tra ẩm mỗi 3 ngày",
};

export function AdminProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => getProducts({ status: "all", limit: 100 }).then((page) => setProducts(page.products));

  useEffect(() => {
    load();
    getCategories(true).then(setCategories);
  }, []);

  function start(product?: Product) {
    setEditing(product || null);
    setForm(
      product
        ? {
            name: product.name,
            slug: product.slug,
            basePrice: product.basePrice,
            salePrice: product.salePrice ? String(product.salePrice) : "",
            inventory: product.inventory,
            categoryId: product.categoryId,
            status: product.status,
            description: product.description || "",
            setupStatus: product.setupStatus || "READY_TO_DISPLAY",
            careLevel: product.careLevel || "EASY",
            image: product.images[0] || "/logo.png",
            watering: product.careGuide?.watering || "Kiểm tra ẩm mỗi 3 ngày",
          }
        : { ...empty, categoryId: categories[0]?.id || "" }
    );
    setOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await saveProduct(
        {
          slug: form.slug,
          name: form.name,
          description: form.description,
          basePrice: Number(form.basePrice),
          salePrice: form.salePrice ? Number(form.salePrice) : null,
          type: "PRODUCT",
          inventory: Number(form.inventory),
          featured: editing?.featured || false,
          categoryId: form.categoryId,
          status: form.status,
          images: [form.image],
          setupStatus: form.setupStatus,
          careLevel: form.careLevel,
          chatTags: [],
          displayReviewCount: editing?.reviewCount || 0,
          variants: [],
          careGuide: {
            watering: form.watering,
            sunlight: "Ánh sáng gián tiếp",
            temperature: "20-28°C",
            humidity: "Duy trì ẩm",
            commonIssues: "Tránh úng và nắng trực tiếp",
          },
        },
        editing?.id
      );
      setOpen(false);
      await load();
    } catch (error) {
      setMessage(getApiMessage(error));
    }
  }

  return (
    <>
      <AdminHead
        title="Quản Lý Sản Phẩm"
        description="Catalog tác phẩm terrarium, quản lý tồn kho, giá sale và hướng dẫn chăm sóc."
        action={
          <button className="admin-btn-primary" onClick={() => start()}>
            <Plus size={18} /> Thêm Sản Phẩm Mới
          </button>
        }
      />

      {message && <p className="notice error">{message}</p>}

      {!products ? (
        <Loading />
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product">
                      <img src={product.images[0] || "/logo.png"} alt="" />
                      <div>
                        <b>{product.name}</b>
                        <span>{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>{product.categoryName}</td>
                  <td><b>{formatMoney(product.effectivePrice)}</b></td>
                  <td>{product.inventory}</td>
                  <td>
                    <span className={`status ${product.status.toLowerCase()}`}>{product.status}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="icon-button" onClick={() => start(product)} title="Chỉnh sửa">
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={async () => {
                        if (confirm("Lưu trữ sản phẩm này?")) {
                          await deleteProduct(product.id);
                          await load();
                        }
                      }}
                      title="Lưu trữ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="modal-backdrop">
          <form className="modal panel" onSubmit={submit}>
            <div className="modal-head">
              <h2>{editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
              <button type="button" className="ghost" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <div className="form-grid">
              <label>
                Tên sản phẩm
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label>
                Slug
                <input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
              </label>
              <label>
                Giá gốc (VNĐ)
                <input required type="number" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: Number(event.target.value) })} />
              </label>
              <label>
                Giá Khuyến Mãi (VNĐ)
                <input type="number" value={form.salePrice} onChange={(event) => setForm({ ...form, salePrice: event.target.value })} />
              </label>
              <label>
                Số lượng tồn kho
                <input required type="number" value={form.inventory} onChange={(event) => setForm({ ...form, inventory: Number(event.target.value) })} />
              </label>
              <label>
                Danh mục
                <select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Trạng thái
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </label>
              <label>
                Mức độ chăm sóc
                <select value={form.careLevel} onChange={(event) => setForm({ ...form, careLevel: event.target.value })}>
                  <option value="EASY">EASY (Dễ chăm)</option>
                  <option value="MEDIUM">MEDIUM (Trung bình)</option>
                  <option value="ADVANCED">ADVANCED (Nâng cao)</option>
                </select>
              </label>
              <label className="full">
                Mô tả chi tiết
                <textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </label>
              <label className="full">
                Đường dẫn ảnh sản phẩm (URL)
                <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
              </label>
              <label className="full">
                Lịch tưới & Hướng dẫn
                <input value={form.watering} onChange={(event) => setForm({ ...form, watering: event.target.value })} />
              </label>
            </div>
            <button className="wide admin-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Lưu Sản Phẩm
            </button>
          </form>
        </div>
      )}
    </>
  );
}

