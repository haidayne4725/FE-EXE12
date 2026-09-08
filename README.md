# Terrarium Shop Frontend

React + TypeScript + Vite frontend chuyển từ Terrarium Shop gốc, tổ chức theo mẫu `SWD392_FE_SU26`:

```text
src/
  components/  context/  pages/  routes/  services/  types/  utils/
```

## Chạy local

```bash
npm install
npm run dev
```

Vite chạy tại `http://localhost:5173` và proxy `/api` về `http://localhost:8080`. Có thể đổi API bằng:

```bash
cp .env.example .env
# sửa VITE_API_BASE_URL nếu backend ở host khác
```

## Kiểm tra production

```bash
npm run build
npm run lint
npm run preview
```

Frontend có các luồng: auth + forgot/reset password, catalog/filter, detail/variant/cart, voucher/checkout/order, vote/favorite/profile/care, review, explore, blog like/comment/reply, policy, RAG consult có citation, và admin cho product/category/order/voucher/review/content/RAG.

## Docker

Docker image dùng Nginx, hỗ trợ SPA fallback và reverse proxy `/api` tới service `backend`. Cách chạy đầy đủ nằm trong `../docker-compose.yml`.
