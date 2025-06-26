import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateQuantityAction,
  removeFromCartAction,
} from "../app/slices/cartSlice";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );

  // 수량 변경
  const handleQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantityAction({ memberId: 1, productId, quantity }));
  };

  // 상품 삭제
  const handleRemove = (productId) => {
    dispatch(removeFromCartAction({ memberId: 1, productId }));
  };

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-4">장바구니</h2>
      {items.length === 0 ? (
        <div className="text-center text-muted py-5">
          장바구니에 담긴 상품이 없습니다.
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="list-group mb-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="list-group-item d-flex align-items-center gap-3 py-3"
                >
                  <img
                    src={item.imageUrl || "/placeholder-product.jpg"}
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      background: "#f8f9fa",
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{item.name}</div>
                    <div className="text-muted" style={{ fontSize: 14 }}>
                      {item.brand}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-light border"
                      onClick={() =>
                        handleQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-light border"
                      onClick={() =>
                        handleQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div
                    className="fw-bold text-primary"
                    style={{ minWidth: 100, textAlign: "right" }}
                  >
                    {(item.price * item.quantity).toLocaleString()}원
                  </div>
                  <button
                    className="btn btn-outline-danger ms-2"
                    onClick={() => handleRemove(item.productId)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* 결제 요약/주문 */}
          <div className="col-lg-4">
            <div className="card shadow-sm p-4 sticky-top" style={{ top: 100 }}>
              <h5 className="fw-bold mb-3">결제 예상금액</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>총 상품금액</span>
                <span>{totalAmount.toLocaleString()}원</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>배송비</span>
                <span className="text-success">무료</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                <span>결제예정금액</span>
                <span className="text-primary">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
              <button className="btn btn-primary btn-lg w-100">주문하기</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
