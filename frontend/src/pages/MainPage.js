import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import { fetchCartItems } from "../app/slices/cartSlice";
import ProductCard from "../components/common/ProductCard";
import FilterBar from "../components/FilterBar";
import { FaBars } from "react-icons/fa";

const MainPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const { category, brand } = useParams();

  // 필터 상태
  const [filters, setFilters] = useState({
    brand: brand || "",
    volume: "",
    gender: category || "",
    price: "",
  });

  // URL 파라미터가 바뀔 때마다 filters 동기화
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      brand: brand || "",
      gender: category || "",
    }));
  }, [category, brand]);

  // 필터 변경 핸들러
  const handleFilterChange = ({ type, value }) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  // 상품 fetch (필터/카테고리/브랜드 변경 시)
  useEffect(() => {
    const params = {};
    if (filters.brand) params.brand = filters.brand;
    if (filters.volume) params.volume = filters.volume;
    if (filters.gender) params.gender = filters.gender;
    if (filters.price) params.maxPrice = filters.price;
    dispatch(fetchFilteredProducts(params));
    dispatch(fetchCartItems(1)); // memberId = 1 (임시)
  }, [dispatch, filters]);

  // 페이지 제목 설정
  const getPageTitle = () => {
    if (category) {
      const map = {
        MALE: "남자향수",
        FEMALE: "여자향수",
        UNISEX: "남여공용",
      };
      return map[category.toUpperCase()] || "카테고리 상품";
    }
    if (brand) {
      const map = {
        CHANEL: "샤넬",
        DIOR: "디올",
        GUCCI: "구찌",
        YSL: "입생로랑",
        HERMES: "에르메스",
      };
      return map[brand.toUpperCase()] || "브랜드 상품";
    }
    return "추천 상품";
  };

  return (
    <main className="flex-grow-1">
      {/* 홈이 아닐 때만 상단에 필터 바 노출 */}
      {(category || brand) && (
        <div className="bg-light rounded-3 p-4 mb-4">
          <h2 className="fw-bold text-center mb-3">향수 상품 목록</h2>
          <FilterBar
            brand={filters.brand}
            volume={filters.volume}
            gender={filters.gender}
            price={filters.price}
            onChange={handleFilterChange}
          />
        </div>
      )}
      {/* 홈(메인)에서만 배너 노출 */}
      {!category && !brand && (
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
      )}
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">{getPageTitle()}</h2>
        </div>
        {loading ? (
          <div className="text-center py-5">상품을 불러오는 중...</div>
        ) : error ? (
          <div className="alert alert-danger">오류: {error}</div>
        ) : (
          <div className="row g-4">
            {products.length === 0 ? (
              <div className="col-12 text-center text-muted">
                해당 조건의 상품이 없습니다.
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
