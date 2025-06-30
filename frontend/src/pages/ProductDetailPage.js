import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../app/slices/productSlice";
import { addToCartAction } from "../app/slices/cartSlice";
import {
  FaTruck,
  FaHeart,
  FaStar,
  FaRegStar,
  FaRegCommentDots,
} from "react-icons/fa";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector(
    (state) => state.product
  );
  const [selectedImg, setSelectedImg] = React.useState(0);

  React.useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <div className="text-center py-5">로딩 중...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!currentProduct) return null;

  // 실제 이미지가 있는 경우에만 썸네일 생성
  const thumbnails = currentProduct.imageUrl ? [currentProduct.imageUrl] : [];

  // description에서 이미지 URL 추출 (jpg, png, gif 등)
  const extractImagesFromDescription = (description) => {
    if (!description) return [];

    const imageRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi;
    const matches = description.match(imageRegex);
    return matches || [];
  };

  const detailImages = extractImagesFromDescription(currentProduct.description);

  // 장바구니 담기 핸들러
  const handleAddToCart = () => {
    dispatch(
      addToCartAction({
        memberId: 1, // 임시
        productId: currentProduct.id,
        quantity: 1,
      })
    );
  };

  return (
    <main className="container py-5">
      <div className="row g-4">
        {/* 좌측: 이미지/썸네일 */}
        <div className="col-md-5">
          <div className="bg-white rounded shadow-sm p-3 mb-3 text-center">
            {thumbnails.length > 0 ? (
              <img
                src={thumbnails[selectedImg]}
                alt={currentProduct.name}
                className="img-fluid rounded"
                style={{
                  maxHeight: 380,
                  objectFit: "contain",
                  background: "#f8f9fa",
                }}
                onError={(e) => {
                  e.target.src = "/placeholder-product.jpg";
                }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: 380,
                  background: "#f8f9fa",
                  borderRadius: "0.375rem",
                }}
              >
                <span className="text-muted">이미지 준비중</span>
              </div>
            )}
          </div>

          {/* 썸네일이 있을 때만 표시 */}
          {thumbnails.length > 1 && (
            <div className="d-flex justify-content-center gap-2">
              {thumbnails.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="썸네일"
                  className={`rounded border ${
                    selectedImg === idx ? "border-primary" : "border-light"
                  }`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedImg(idx)}
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 우측: 상품 정보/구매 */}
        <div className="col-md-7">
          <h2 className="fw-bold mb-2">{currentProduct.name}</h2>
          <div className="mb-2 text-muted">{currentProduct.brand}</div>
          <div className="mb-3">{currentProduct.description}</div>
          <div className="mb-3">
            <span className="fs-2 fw-bold text-primary">
              {currentProduct.price.toLocaleString()}원
            </span>
            <span
              className="badge bg-warning text-dark ms-2 align-middle"
              style={{ fontSize: 15 }}
            >
              <FaTruck className="me-1 mb-1" /> 내일(빠른배송)
            </span>
          </div>
          <div className="mb-3">
            <span className="badge bg-light text-dark me-2">
              {currentProduct.genderCategory}
            </span>
            <span className="badge bg-light text-dark">
              {currentProduct.volumeCategory}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-success fw-semibold">무료배송</span>
            <span className="ms-3 text-secondary">지금 주문 시 내일 도착</span>
          </div>
          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-primary btn-lg flex-grow-1 shadow-sm"
              onClick={handleAddToCart}
            >
              장바구니 담기
            </button>
            <button className="btn btn-danger btn-lg flex-grow-1 shadow-sm">
              바로구매
            </button>
            <button className="btn btn-outline-secondary btn-lg" title="찜하기">
              <FaHeart />
            </button>
          </div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="text-warning">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaRegStar />
            </span>
            <span className="text-muted" style={{ fontSize: 15 }}>
              (리뷰 12)
            </span>
            <span className="ms-3 text-secondary" style={{ fontSize: 15 }}>
              <FaRegCommentDots className="me-1" /> 문의 3
            </span>
          </div>
        </div>
      </div>

      {/* 하단: 상세 설명 및 이미지 */}
      <div className="mt-5">
        <div className="tab-content p-3 border bg-white rounded">
          <div>
            <h5 className="fw-bold mb-3">상품 상세정보</h5>

            {/* 상세정보 이미지들 */}
            {detailImages.length > 0 && (
              <div className="mb-4">
                {detailImages.map((imageUrl, index) => (
                  <div key={index} className="mb-3 text-center">
                    <img
                      src={imageUrl}
                      alt={`상품 상세정보 ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ maxWidth: "100%" }}
                      onError={(e) => {
                        console.warn(`이미지 로드 실패: ${imageUrl}`);
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 텍스트 설명 */}
            <div className="mb-3">
              {currentProduct.description || "상세 설명 준비중"}
            </div>

            {/* 상품 정보 테이블 */}
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th className="bg-light" style={{ width: "30%" }}>
                      브랜드
                    </th>
                    <td>{currentProduct.brand}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">성별</th>
                    <td>{currentProduct.genderCategory}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">용량</th>
                    <td>{currentProduct.volumeCategory}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">가격</th>
                    <td>{currentProduct.price.toLocaleString()}원</td>
                  </tr>
                  <tr>
                    <th className="bg-light">재고</th>
                    <td>{currentProduct.stock}개</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
