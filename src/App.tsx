import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AppLayout } from "./components/AppLayout";
import { CartProvider } from "./context/CartContext";
import { ForgotPasswordPage, LoginPage, RegisterPage } from "./pages/AuthPages";
import { BlogDetailPage, BlogListPage } from "./pages/BlogPages";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ConsultPage } from "./pages/ConsultPage";
import { ExplorePage } from "./pages/ExplorePage";
import { HomePage } from "./pages/HomePage";
import { OrderSuccessPage } from "./pages/OrderDetailPage";
import { OrdersPage } from "./pages/OrdersPage";
import { PoliciesPage } from "./pages/PoliciesPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminCategories } from "./pages/admin/AdminCategories";
import { AdminContent } from "./pages/admin/AdminContent";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminRag } from "./pages/admin/AdminRag";
import { AdminReviews } from "./pages/admin/AdminReviews";
import { AdminVouchers } from "./pages/admin/AdminVouchers";
import { ProtectedAdminRoute, ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <AppErrorBoundary>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />
              <Route path="blog" element={<BlogListPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="policies" element={<PoliciesPage />} />
              <Route path="consult" element={<ConsultPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderSuccessPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route element={<ProtectedAdminRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="vouchers" element={<AdminVouchers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="rag" element={<AdminRag />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AppErrorBoundary>
  );
}
