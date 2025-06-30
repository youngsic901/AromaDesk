import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  updateQuantityAction,
  removeFromCartAction,
  clearCart,
} from "../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items = [],
    totalAmount,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ProtectedRoute에서 인증 확인을 하므로 여기서는 단순히 장바구니 데이터만 가져옴
  useEffect(() => {
    const loadCartData = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          setError(null);
          console.log('장바구니 데이터 조회 시작:', user.id);
          dispatch(fetchCartItems(user.id));
        } catch (error) {
          console.error("장바구니 데이터 조회 실패:", error);
          setError("장바구니 데이터를 불러오는데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadCartData();
  }, [user, dispatch]);

  // 수량 변경
  const handleQuantity = (productId, quantity) => {
    if (!productId || quantity < 1 || !user?.id) return;
    dispatch(
      updateQuantityAction({ memberId: user.id, productId, quantity })
    );
  };

  // 상품 삭제
  const handleRemove = (productId) => {
    if (!productId || !user?.id) return;
    dispatch(removeFromCartAction({ memberId: user.id, productId }));
  };

  // 주문 처리
  const handleOrder = async () => {
    if (!user || !user.id) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    const cartItemIds = items.map((item) => item.cartItemId); // cartItemId 기준
    const deliveryId = 1; // 임시 배송지 ID
    const paymentMethod = "MOCK";

    const response = await orderApi.createOrderFromCart({
      cartItemIds,
      deliveryId,
      paymentMethod,
    });

    if (response.success) {
      dispatch(clearCart());
      const orderId = response.data?.orderId;
      if (orderId) {
        navigate(`/order/complete?orderId=${orderId}`);
      } else {
        navigate("/order/complete");
      }
    } else {
      alert("주문 실패: " + response.error);
    }
  };

  if (loading) {
    return (
      <main className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning" role="alert">
          사용자 정보를 찾을 수 없습니다.
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-4">장바구니</h2>
      {cartLoading && (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">장바구니 로딩 중...</span>
          </div>
        </div>
      )}
      {cartError && (
        <div className="alert alert-danger" role="alert">
          장바구니 로딩 실패: {cartError}
        </div>
      )}
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
                  key={item?.productId || Math.random()}
                  className="list-group-item d-flex align-items-center gap-3 py-3"
                >
                  <img
                    src={item?.imageUrl || "/placeholder-product.jpg"}
                    alt={item?.name || "상품"}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      background: "#f8f9fa",
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">
                      {item?.name || "상품명 없음"}
                    </div>
                    <div className="text-muted" style={{ fontSize: 14 }}>
                      {item?.brand || "브랜드 없음"}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-light border"
                      onClick={() =>
                        handleQuantity(
                          item?.productId,
                          (item?.quantity || 0) - 1
                        )
                      }
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-2">{item?.quantity || 0}</span>
                    <button
                      className="btn btn-light border"
                      onClick={() =>
                        handleQuantity(
                          item?.productId,
                          (item?.quantity || 0) + 1
                        )
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div
                    className="fw-bold text-primary"
                    style={{ minWidth: 100, textAlign: "right" }}
                  >
                    {(
                      (item?.price || 0) * (item?.quantity || 0)
                    ).toLocaleString()}
                    원
                  </div>
                  <button
                    className="btn btn-outline-danger ms-2"
                    onClick={() => handleRemove(item?.productId)}
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
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleOrder}
                disabled={cartLoading}
              >
                {cartLoading ? "로딩 중..." : "주문하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
