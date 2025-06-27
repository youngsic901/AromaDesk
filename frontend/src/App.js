import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";

// Layout Components
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/SideBar";
import Footer from "./components/layout/Footer";

// Page Components
import MainPage from "./pages/MainPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminLoginPage from "./PagesAdmin/AdminLoginPage";
import AdminMainPage from "./PagesAdmin/AdminMainPage";
import AdminDashboardPage from "./PagesAdmin/AdminDashboardPage";
import AdminProductPage from "./PagesAdmin/AdminProductPage";
import AdminOrderPage from "./PagesAdmin/AdminOrderPage";
import AdminMemberPage from "./PagesAdmin/AdminMemberPage";
import CategoryPage from "./pages/CategoryPage";
import BrandPage from "./pages/BrandPage";
import SearchPage from "./pages/SearchPage";
import OrderCompletePage from "./pages/OrderCompletePage";

// 관리자 인증 라우트
function AdminRoute({ children }) {
  const isAdmin = !!localStorage.getItem('AdminUser');
  const location = useLocation();
  if (!isAdmin) {
    return <Navigate to="/adminLogin" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <Routes>
        {/* 관리자 페이지 라우팅: 별도 레이아웃 */}
        <Route path="/adminLogin" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminMainPage />
          </AdminRoute>
        } />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute>
            <AdminProductPage />
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <AdminOrderPage />
          </AdminRoute>
        } />
        <Route path="/admin/members" element={
          <AdminRoute>
            <AdminMemberPage />
          </AdminRoute>
        } />
        {/* 일반 사용자 페이지 라우팅: 기존 레이아웃 */}
        <Route path="/*" element={
          <>
            <Header setSidebarOpen={setSidebarOpen} />
            <div className="d-flex" style={{ minHeight: "100vh" }}>
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <main className="flex-grow-1 p-4">
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/brand/:brand" element={<BrandPage />} />
                  <Route path="/products" element={<ProductListPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/order/complete" element={<OrderCompletePage />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

// Redux Provider로 감싸기
const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
