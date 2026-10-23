import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Success from "./pages/Success";
import Wishlist from "./pages/Wishlist";

// Blog & CMS
import BlogHome from "./pages/Blog/BlogHome";
import BlogDetail from "./pages/Blog/BlogDetail";

// Legal, Trust & Content
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import Terms from "./pages/Legal/Terms";
import ReturnPolicy from "./pages/Legal/ReturnPolicy";
import ShippingPolicy from "./pages/Legal/ShippingPolicy";
import CookiePolicy from "./pages/Legal/CookiePolicy";
import ContactUs from "./pages/Legal/ContactUs";
import FAQ from "./pages/Legal/FAQ";
import AboutUs from "./pages/Legal/AboutUs";
import RecommendationDisclosure from "./pages/Legal/RecommendationDisclosure";
import Accessibility from "./pages/Legal/Accessibility";
import TrustCenter from "./pages/Legal/TrustCenter";
import NotFound from "./pages/Legal/NotFound";

// Global Overlay Components
import CartDrawer from "./components/CartDrawer";
import CookieConsentBanner from "./components/CookieConsentBanner";
import RequireAdmin from "./components/RequireAdmin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      
      {/* Global Interactive Overlays */}
      <CartDrawer />
      <CookieConsentBanner />

      <Routes>
        {/* Customer routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />

        {/* Blog & Content */}
        <Route path="/blog" element={<BlogHome />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />

        {/* Legal, Trust & Corporate */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/returns" element={<ReturnPolicy />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/recommendations-disclosure" element={<RecommendationDisclosure />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/trust" element={<TrustCenter />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/success" element={<Success />} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/*" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

        {/* 404 Catch-All */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
