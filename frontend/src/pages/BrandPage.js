import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import ProductCard from "../components/common/ProductCard";
import apiClient from "../api/axiosConfig";

const VOLUME_OPTIONS = [
  { code: "", label: "전체" },
  { code: "UNDER_30ML", label: "30ml 이하" },
  { code: "UNDER_50ML", label: "50ml 이하" },
  { code: "LARGE", label: "대용량" },
];

const PRICE_OPTIONS = [
  { code: "", label: "가격 전체" },
  { code: "100000", label: "10만원 이하" },
  { code: "200000", label: "20만원 이하" },
  { code: "300000", label: "30만원 이하" },
  { code: "500000", label: "50만원 이하" },
];

const BrandPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const { brand } = useParams();

  const [volume, setVolume] = useState("");
  const [price, setPrice] = useState("");
  const [allBrands, setAllBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);

  // URL에서 받아온 브랜드를 백엔드 API 형식에 맞게 변환
  const brandCode = brand ? brand.toUpperCase() : "";

  // 브랜드 이름 매핑
  const getBrandName = (code) => {
    const brandMap = {
      CHANEL: "샤넬",
      DIOR: "디올",
      GUCCI: "구찌",
      YSL: "입생로랑",
      HERMES: "에르메스",
      DIPTYQUE: "딥티크",
      TOMFORD: "톰포드",
      "MAISON MARGIELA": "메종마르지엘라",
      "ACQUA DI PARMA": "아쿠아 디 파르마",
      BYREDO: "바이레도",
      CLEAN: "클린",
      "ELIZABETH ARDEN": "엘리자베스아덴",
      LANVIN: "랑방",
      "CALVIN KLEIN": "캘빈클라인",
      "JO MALONE": "조말론",
      BURBERRY: "버버리",
      VERSACE: "베르사체",
      ARMANI: "아르마니",
      "BOTTEGA VENETA": "보테가 베네타",
      BALENCIAGA: "발렌시아가",
    };
    return brandMap[code] || code;
  };

  // 모든 브랜드 목록 가져오기
  useEffect(() => {
    const fetchBrands = async () => {
      setBrandsLoading(true);
      try {
        const response = await apiClient.get("/api/products/brands");
        setAllBrands(response.data);
      } catch (error) {
        console.error("브랜드 목록 가져오기 실패:", error);
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    // 페이지 마운트 시 필터링 상태 초기화
    setVolume("");
    setPrice("");
  }, [brand]);

  useEffect(() => {
    // 브랜드와 필터 옵션에 맞는 상품 불러오기
    const params = { brand: brandCode };
    if (volume) params.volume = volume;
    if (price) params.maxPrice = price;

    console.log("BrandPage 필터링 파라미터:", params);
    dispatch(fetchFilteredProducts(params));
  }, [dispatch, brandCode, volume, price]);

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
            <select
              className="form-select d-inline-block w-auto"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              {PRICE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <h3 className="fw-bold mb-3">{getBrandName(brandCode)} 상품</h3>

        {/* 브랜드 목록 표시 */}
        {!brandsLoading && allBrands.length > 0 && (
          <div className="mb-4">
            <h5 className="fw-semibold mb-2">
              전체 브랜드 ({allBrands.length}개)
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {allBrands.map((brandName) => (
                <a
                  key={brandName}
                  href={`/brand/${brandName.toLowerCase()}`}
                  className={`badge text-decoration-none ${
                    brandCode === brandName
                      ? "bg-primary"
                      : "bg-light text-dark"
                  }`}
                  style={{ fontSize: "0.9rem" }}
                >
                  {getBrandName(brandName)}
                </a>
              ))}
            </div>
          </div>
        )}

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

export default BrandPage;
