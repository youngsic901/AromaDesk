import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../app/slices/cartSlice";
import { useDispatch } from "react-redux";


const OrderPaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const isCartOrder = !!state?.cartItemIds;
  const isSingleOrder = !!state?.product;

  // 잘못된 접근 방지
  if (
    !state ||
    (!isSingleOrder && (!isCartOrder || !Array.isArray(state.items))) ||
    !state.deliveryId ||
    !state.paymentMethod
  ) {
    return <div className="text-center py-5">잘못된 접근입니다.</div>;
  }

  const deliveryId = state.deliveryId;
  const paymentMethod = state.paymentMethod;

  const product = state.product;
  const quantity = isSingleOrder ? state.items?.[0]?.quantity || 0 : 0;
  const totalPrice = isSingleOrder
    ? quantity * product.price
    : state.totalAmount;

  const handleConfirm = () => {
    const orderData = isSingleOrder
      ? {
          items: state.items,
          deliveryId,
          paymentMethod,
        }
      : {
          cartItemIds: state.cartItemIds,
          deliveryId,
          paymentMethod,
        };

    const apiUrl = isSingleOrder
      ? "/api/orders/single"
      : "/api/orders/from-cart";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("주문 실패");
        return res.json();
      })
      .then((data) => {
        if(isCartOrder){
          dispatch(clearCart());
        }
        const orderId = data.orderId;
        navigate(`/order/complete?orderId=${orderId}`);
      })
      .catch(() => {
        alert("주문 처리 중 오류가 발생했습니다.");
      });
  };

  return (
    <main className="container py-5">
      <div className="card shadow-sm p-4">
        <h3 className="fw-bold mb-4">주문 정보 확인</h3>

        {/* 단일 상품 주문 */}
        {isSingleOrder && (
          <>
            <div className="row mb-3">
              <div className="col-md-3 fw-semibold">상품명</div>
              <div className="col-md-9">{product.name}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-semibold">수량</div>
              <div className="col-md-9">{quantity}</div>
            </div>
          </>
        )}

        {/* 장바구니 주문 */}
        {isCartOrder && Array.isArray(state.items) && (
          <div className="row mb-3">
            <div className="col-md-3 fw-semibold">주문 상품</div>
            <div className="col-md-9">
              <ul className="list-unstyled mb-0">
                {state.items.map((item, index) => (
                  <li key={index}>
                    {item.name} ({item.quantity}개) -{" "}
                    {(item.price * item.quantity).toLocaleString()}원
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 결제 금액 */}
        <div className="row mb-3">
          <div className="col-md-3 fw-semibold">총 결제금액</div>
          <div className="col-md-9 text-danger fw-bold">
            {totalPrice.toLocaleString()}원
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="row mb-3">
          <div className="col-md-3 fw-semibold">결제 수단</div>
          <div className="col-md-9">{paymentMethod}</div>
        </div>

        {/* 배송지 ID */}
        <div className="row mb-4">
          <div className="col-md-3 fw-semibold">배송지 ID</div>
          <div className="col-md-9">{deliveryId}</div>
        </div>

        <div className="text-end">
          <button className="btn btn-success px-4" onClick={handleConfirm}>
            결제하기
          </button>
        </div>
      </div>
    </main>
  );
};

export default OrderPaymentPage;
