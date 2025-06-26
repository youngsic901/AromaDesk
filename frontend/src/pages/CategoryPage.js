import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import ProductCard from "../components/common/ProductCard";

const VOLUME_OPTIONS = [
  { code: "", label: "전체" },
  { code: "UNDER_30ML", label: "30ml 이하" },
  { code: "UNDER_50ML", label: "50ml 이하" },
  { code: "LARGE", label: "대용량" },
];

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const [volume, setVolume] = useState("");
  const [price, setPrice] = useState(0);

  // 카테고리 정보는 URL 등에서 받아올 수 있음(여기선 예시로 MALE)
  const gender = "MALE";

  useEffect(() => {
    // 옵션에 맞는 상품 불러오기
    const params = { gender };
    if (volume) params.volume = volume;
    if (price > 0) params.minPrice = price;
    dispatch(fetchFilteredProducts(params));
  }, [dispatch, gender, volume, price]);

  return (
    <main className="flex-grow-1">
      <div className="container-fluid py-4">
        <div className="d-flex align-items-center mb-4 gap-4">
          <div>
            <label className="form-label fw-semibold me-2">용량별</label>
            <select
              className="form-select d-inline-block w-auto"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            >
              {VOLUME_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label fw-semibold me-2">가격대</label>
            <input
              type="range"
              min={0}
              max={500000}
              step={10000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{ width: 200 }}
            />
            <span className="ms-2">{price.toLocaleString()}원</span>
          </div>
        </div>
        <h3 className="fw-bold mb-3">카테고리 상품</h3>
        {/* 상품 리스트 */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-5">상품을 불러오는 중...</div>
          ) : error ? (
            <div className="col-12 text-center text-danger">오류: {error}</div>
          ) : products.length === 0 ? (
            <div className="col-12 text-center text-muted">
              조건에 맞는 상품이 없습니다.
            </div>
          ) : (
            products.map((product) => (
              <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
