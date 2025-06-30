import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import { fetchCartItems } from "../app/slices/cartSlice";
import ProductCard from "../components/common/ProductCard";

const MainPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  // 메인 페이지에서는 추천 상품만 불러오기
  useEffect(() => {
    dispatch(fetchFilteredProducts({})); // 모든 상품 불러오기
    dispatch(fetchCartItems(1)); // memberId = 1 (임시)
  }, [dispatch]);

  return (
    <main className="flex-grow-1">
      {/* 메인 배너 */}
      <section
        className="main-hero-banner d-flex align-items-center justify-content-center mb-4"
        style={{
          minHeight: 220,
          borderRadius: 32,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          background: "linear-gradient(120deg, #7b2ff2 0%, #f357a8 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          margin: "32px 0 0 0",
        }}
      >
        <div className="container py-5">
          <h1
            className="display-3 fw-bold mb-2"
            style={{
              letterSpacing: 1.5,
              textShadow: "0 2px 16px rgba(123,47,242,0.12)",
              fontWeight: 800,
            }}
          >
            AromaDesk
          </h1>
          <p
            className="lead mb-0"
            style={{
              fontSize: 22,
              fontWeight: 500,
              textShadow: "0 1px 8px rgba(243,87,168,0.10)",
            }}
          >
            당신만의 특별한 향기를 찾아보세요
          </p>
        </div>
      </section>

      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">추천 상품</h2>
        </div>
        {loading ? (
          <div className="text-center py-5">상품을 불러오는 중...</div>
        ) : error ? (
          <div className="alert alert-danger">오류: {error}</div>
        ) : (
          <div className="row g-4">
            {products.length === 0 ? (
              <div className="col-12 text-center text-muted">
                상품이 없습니다.
              </div>
            ) : (
              products.map((product) => (
                <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default MainPage;
