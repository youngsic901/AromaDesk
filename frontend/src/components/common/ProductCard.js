import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCartAction } from "../../app/slices/cartSlice";

const cardStyle = {
  border: "none",
  borderRadius: "18px",
  boxShadow: "0 4px 24px rgba(80, 80, 120, 0.08)",
  transition: "transform 0.18s, box-shadow 0.18s",
  cursor: "pointer",
  minHeight: 340,
  background: "#fff",
  overflow: "hidden",
};
const cardHoverStyle = {
  transform: "translateY(-6px) scale(1.03)",
  boxShadow: "0 8px 32px rgba(80, 80, 120, 0.16)",
};
const imgStyle = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderTopLeftRadius: "18px",
  borderTopRightRadius: "18px",
  background: "#f4f4f4",
};
const priceStyle = {
  color: "#2563eb",
  fontWeight: 700,
  fontSize: 18,
};
const btnStyle = {
  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 500,
  fontSize: 15,
  padding: "8px 18px",
  marginTop: 8,
  transition: "background 0.2s",
};

const ProductCard = ({ product, memberId = 1 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(
      addToCartAction({
        memberId,
        productId: product.id,
        quantity: 1,
      })
    );
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  return (
    <div
      className="card h-100"
      style={hover ? { ...cardStyle, ...cardHoverStyle } : cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleCardClick}
    >
      <div style={{ position: "relative" }}>
        <img
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          style={imgStyle}
          onError={(e) => {
            e.target.src = "/placeholder-product.jpg";
          }}
        />
        {hover && (
          <button
            style={{
              ...btnStyle,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              boxShadow: "0 2px 8px rgba(80,80,120,0.12)",
            }}
            onClick={handleAddToCart}
          >
            장바구니 추가
          </button>
        )}
      </div>
      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <h5 className="card-title mb-1 fw-bold" style={{ fontSize: 18 }}>
            {product.name}
          </h5>
          <div className="text-muted mb-1" style={{ fontSize: 14 }}>
            {product.brand}
          </div>
          <div className="mb-2" style={{ fontSize: 13 }}>
            {product.genderCategory && (
              <span className="badge bg-light text-dark me-1">
                {product.genderCategory}
              </span>
            )}
            {product.volumeCategory && (
              <span className="badge bg-light text-dark">
                {product.volumeCategory}
              </span>
            )}
          </div>
        </div>
        <div className="d-flex flex-column align-items-start mt-2">
          <span style={priceStyle}>{formatPrice(product.price)}</span>
          {product.createdAt && (
            <span className="text-secondary mt-1" style={{ fontSize: 12 }}>
              등록일: {product.createdAt}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
