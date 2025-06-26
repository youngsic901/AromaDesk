import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/SideBar";
import Footer from "./components/layout/Footer";

// Page Components
import MainPage from "./pages/MainPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import BrandPage from "./pages/BrandPage";

// 메인 앱 컴포넌트
const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <Header setSidebarOpen={setSidebarOpen} />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/category/:category" element={<MainPage />} />
            <Route path="/brand/:brand" element={<MainPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
};

// Redux Provider로 감싼 최상위 컴포넌트
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
