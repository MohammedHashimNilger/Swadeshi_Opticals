import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import StoreLocator from "./pages/StoreLocator";
import NotFound from "./pages/NotFound";

import ShippingPolicy from "./pages/policies/ShippingPolicy";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import Terms from "./pages/policies/Terms";
import RefundPolicy from "./pages/policies/RefundPolicy";
import PrescriptionGuide from "./pages/policies/PrescriptionGuide";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import ProductForm from "./pages/admin/ProductForm";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import Customers from "./pages/admin/Customers";
import Prescriptions from "./pages/admin/Prescriptions";
import Banners from "./pages/admin/Banners";
import Settings from "./pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      {/* Customer-facing routes — wrapped with Header + Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop/:categorySlug?" element={<Shop />} />
        <Route path="/product/:productSlug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/store-locator" element={<StoreLocator />} />

        <Route path="/policies/shipping" element={<ShippingPolicy />} />
        <Route path="/policies/privacy" element={<PrivacyPolicy />} />
        <Route path="/policies/terms" element={<Terms />} />
        <Route path="/policies/refund" element={<RefundPolicy />} />
        <Route path="/policies/prescription-guide" element={<PrescriptionGuide />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes — separate layout, no customer Header/Footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:productId/edit" element={<ProductForm />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="banners" element={<Banners />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
