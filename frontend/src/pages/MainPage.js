import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import { fetchCartItems } from "../app/slices/cartSlice";
import ProductCard from "../components/common/ProductCard";
import CategorySidebar from "../components/layout/CategorySidebar";
import { FaSearch, FaShoppingCart, FaBars } from "react-icons/fa";

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);
  const { totalQuantity } = useSelector((state) => state.cart);

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(fetchFilteredProducts());
    dispatch(fetchCartItems(1)); // memberId = 1 (임시)
  }, [dispatch]);

  // 필터 적용
  const applyFilters = () => {
    const filters = {};
    if (selectedBrand) filters.brand = selectedBrand;
    if (selectedGender) filters.gender = selectedGender;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    dispatch(fetchFilteredProducts(filters));
  };

  // 검색 처리
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(fetchFilteredProducts({ name: searchTerm }));
    }
  };

  // 필터 초기화
  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedGender("");
    setMinPrice("");
    setMaxPrice("");
    dispatch(fetchFilteredProducts());
  };

  // 장바구니 페이지로 이동
  const goToCart = () => {
    navigate("/cart");
  };

  // 브랜드/성별 옵션
  const brandOptions = [
    "CHANEL",
    "DIOR",
    "HERMES",
    "JO MALONE",
    "TOM FORD",
    "YSL",
    "GUCCI",
    "PRADA",
    "BOTTEGA VENETA",
    "BYREDO",
  ];
  const genderOptions = ["남성", "여성", "중성"];

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="py-5 mb-4 bg-primary bg-gradient text-white text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">AromaDesk</h1>
          <p className="lead mb-4">당신만의 특별한 향기를 찾아보세요</p>
          <form
            className="mx-auto"
            style={{ maxWidth: 600 }}
            onSubmit={handleSearch}
          >
            <div className="input-group shadow rounded-pill overflow-hidden">
              <span className="input-group-text bg-white border-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="향수 이름, 브랜드, 노트를 검색해보세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-light text-primary px-4" type="submit">
                검색
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="container-fluid py-4">
        <div className="row">
          {/* 모바일: Offcanvas 사이드바 토글 */}
          <div className="d-md-none mb-3">
            <button
              className="btn btn-outline-secondary"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebarOffcanvas"
            >
              <FaBars /> 카테고리
            </button>
          </div>
          {/* Offcanvas 사이드바 (모바일) */}
          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="sidebarOffcanvas"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">카테고리</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>
            <div className="offcanvas-body">
              <CategorySidebar
                brandOptions={brandOptions}
                genderOptions={genderOptions}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                applyFilters={applyFilters}
                clearFilters={clearFilters}
              />
            </div>
          </div>
          {/* PC용 사이드바 */}
          <aside className="col-md-3 d-none d-md-block">
            <CategorySidebar
              brandOptions={brandOptions}
              genderOptions={genderOptions}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          </aside>
          {/* 상품 그리드 */}
          <main className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">추천 상품</h2>
              <button
                className="btn btn-outline-dark position-relative"
                onClick={goToCart}
              >
                <FaShoppingCart />
                {totalQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalQuantity}
                  </span>
                )}
              </button>
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
