import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../app/slices/cartSlice";
import { useDispatch } from "react-redux";
import "../css/OrderPaymentPage.css";

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
    return <div className="order-payment-error">잘못된 접근입니다.</div>;
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
    <main className="order-payment-container">
      <div className="order-payment-header">
        <h1 className="order-payment-title">주문 정보 확인</h1>
        <p className="order-payment-subtitle">주문하실 상품과 결제 정보를 확인해주세요</p>
      </div>
      
      <div className="order-info-card">
        <div className="order-info-header">
          <h3>주문 상세 정보</h3>
        </div>
        <div className="order-info-body">

        {isSingleOrder && (
          <>
            <div className="order-info-row">
              <div className="order-info-label">상품명</div>
              <div className="order-info-value">{product.name}</div>
            </div>
            <div className="order-info-row">
              <div className="order-info-label">수량</div>
              <div className="order-info-value">{quantity}개</div>
            </div>
          </>
        )}

        {isCartOrder && Array.isArray(items) && (
          <div className="order-items-section">
            <h4 className="order-items-title">주문 상품</h4>
            {items.map((item, index) => (
              <div key={index} className="order-item">
                <img
                  src={item.imageUrl || "/placeholder-product.jpg"}
                  alt={item.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <div className="order-item-name">{item.name}</div>
                  <div className="order-item-brand">{item.brand}</div>
                  <div className="order-item-quantity">수량: {item.quantity}개</div>
                </div>
                <div className="order-item-price">
                  {(item.price * item.quantity).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="order-info-row">
          <div className="order-info-label">총 결제금액</div>
          <div className="order-info-value danger">
            {totalPrice.toLocaleString()}원
          </div>
        </div>

        <div className="order-info-row">
          <div className="order-info-label">결제 수단</div>
          <div className="order-info-value">{paymentMethod}</div>
        </div>

        <div className="order-info-row">
          <div className="order-info-label">배송지 ID</div>
          <div className="order-info-value">{deliveryId}</div>
        </div>
        </div>
        
        <div className="order-payment-actions">
          <button className="order-payment-button order-payment-button-primary" onClick={handleConfirm}>
            결제하기
          </button>
        </div>
      </div>
    </main>
  );
};

export default OrderPaymentPage;