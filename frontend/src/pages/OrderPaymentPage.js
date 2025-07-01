import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../app/slices/cartSlice";
import { useDispatch } from "react-redux";

const OrderPaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("pendingOrder");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setOrderData(parsed);
    } catch (e) {
      console.error("주문 정보 파싱 실패", e);
    }
  }, []);

  if (!orderData || !orderData.paymentMethod || !orderData.deliveryId) {
    return <div className="text-center py-5">잘못된 접근입니다.</div>;
  }

  const {
    type,
    product,
    items,
    cartItemIds,
    deliveryId,
    paymentMethod,
    totalAmount,
  } = orderData;

  const isSingleOrder = type === "single";
  const isCartOrder = type === "cart";
  const quantity = isSingleOrder ? items?.[0]?.quantity || 0 : 0;
  const totalPrice = isSingleOrder
    ? quantity * product.price
    : totalAmount || 0;

  const handleConfirm = () => {
    const payload = isSingleOrder
      ? { items, deliveryId, paymentMethod }
      : { cartItemIds, deliveryId, paymentMethod };

    const url = isSingleOrder
      ? "/api/orders/single"
      : "/api/orders/from-cart";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("주문 실패");
        return res.json();
      })
      .then((data) => {
        localStorage.removeItem("pendingOrder");
        if (isCartOrder) dispatch(clearCart());
        navigate(`/order/complete?orderId=${data.orderId}`);
      })
      .catch(() => {
        alert("주문 처리 중 오류가 발생했습니다.");
      });
  };

  return (
    <main className="container py-5">
      <div className="card shadow-sm p-4">
        <h3 className="fw-bold mb-4">주문 정보 확인</h3>

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

        {isCartOrder && Array.isArray(items) && (
          <div className="row mb-3">
            <div className="col-md-3 fw-semibold">주문 상품</div>
            <div className="col-md-9">
              <ul className="list-unstyled mb-0">
                {items.map((item, index) => (
                  <li key={index}>
                    {item.name} ({item.quantity}개) -{" "}
                    {(item.price * item.quantity).toLocaleString()}원
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="row mb-3">
          <div className="col-md-3 fw-semibold">총 결제금액</div>
          <div className="col-md-9 text-danger fw-bold">
            {totalPrice.toLocaleString()}원
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-semibold">결제 수단</div>
          <div className="col-md-9">{paymentMethod}</div>
        </div>

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