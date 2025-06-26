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

const DUMMY_THUMBNAILS = [
  // 실제로는 상품 이미지 여러 장이 있을 때 사용
  "/placeholder-product.jpg",
  "/placeholder-product.jpg",
  "/placeholder-product.jpg",
];

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

  // 썸네일 이미지 배열 (실제 서비스라면 currentProduct.images 등 활용)
  const thumbnails = [
    currentProduct.imageUrl || "/placeholder-product.jpg",
    ...DUMMY_THUMBNAILS,
  ];

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
            <img
              src={thumbnails[selectedImg]}
              alt={currentProduct.name}
              className="img-fluid rounded"
              style={{
                maxHeight: 380,
                objectFit: "contain",
                background: "#f8f9fa",
              }}
            />
          </div>
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
              />
            ))}
          </div>
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
      {/* 하단: 상세 설명만 */}
      <div className="mt-5">
        <div className="tab-content p-3 border bg-white rounded">
          <div>
            <h5 className="fw-bold mb-3">상품 상세정보</h5>
            <div>{currentProduct.description || "상세 설명 준비중"}</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
