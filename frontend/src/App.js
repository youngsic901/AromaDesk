import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./app/store";

// Bootstrap CSS and JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Layout Components
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/SideBar";
import Footer from "./components/layout/Footer";

// Page Components
import IntroPage from "./pages/IntroPage";
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

// API
import { loginAPI } from "./api/loginApi";
import {
  login as loginAction,
  logout as logoutAction,
} from "./app/slices/userSlice";

// 관리자 인증 라우트
function AdminRoute({ children }) {
  const isAdmin = !!localStorage.getItem("AdminUser");
  const location = useLocation();
  if (!isAdmin) {
    return <Navigate to="/adminLogin" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log("=== 앱 시작: 로그인 상태 확인 시작 ===");
      try {
        console.log("백엔드 세션 확인 API 호출 중...");
        const result = await loginAPI.getUserInfo();
        console.log("백엔드 응답 결과:", result);

        if (result.success) {
          console.log("로그인된 상태 확인됨:", result.data);
          // 로그인된 상태: Redux 스토어에 사용자 정보 저장
          dispatch(loginAction(result.data));
          // localStorage에도 저장 (기존 호환성 유지)
          localStorage.setItem("CusUser", JSON.stringify(result.data));
          console.log("Redux 스토어와 localStorage에 사용자 정보 저장 완료");
        } else {
          console.log("로그인되지 않은 상태:", result.error);
          // 로그인되지 않은 상태: Redux 스토어 초기화
          dispatch(logoutAction());
          localStorage.removeItem("CusUser");
          console.log("Redux 스토어와 localStorage 초기화 완료");
        }
      } catch (error) {
        console.error("로그인 상태 확인 중 오류:", error);
        console.error("오류 상세:", error.response?.data);
        // 오류 발생 시 로그아웃 상태로 설정
        dispatch(logoutAction());
        localStorage.removeItem("CusUser");
        console.log("오류로 인한 로그아웃 상태 설정 완료");
      } finally {
        console.log("=== 로그인 상태 확인 완료 ===");
        setIsInitialized(true);
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  // 초기화가 완료될 때까지 로딩 표시
  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        로딩 중...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* 소개 페이지 (루트 경로) */}
        <Route path="/" element={<IntroPage />} />

        {/* 관리자 페이지 라우팅: 별도 레이아웃 */}
        <Route path="/adminLogin" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminMainPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrderPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <AdminRoute>
              <AdminMemberPage />
            </AdminRoute>
          }
        />
        {/* 일반 사용자 페이지 라우팅: 기존 레이아웃 */}
        <Route
          path="/*"
          element={
            <>
              <Header setSidebarOpen={setSidebarOpen} />
              <div className="d-flex" style={{ minHeight: "100vh" }}>
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-grow-1 p-4">
                  <Routes>
                    <Route path="/main" element={<MainPage />} />
                    <Route
                      path="/category/:category"
                      element={<CategoryPage />}
                    />
                    <Route path="/brand" element={<BrandPage />} />
                    <Route path="/brand/:brand" element={<BrandPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route
                      path="/products/:id"
                      element={<ProductDetailPage />}
                    />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route
                      path="/order/complete"
                      element={<OrderCompletePage />}
                    />
                  </Routes>
                </main>
              </div>
              <Footer />
            </>
          }
        />
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
