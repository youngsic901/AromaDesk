import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import apiClient from "../api/axiosConfig";
import "../css/OrderCompletePage.css";

const statusMap = {
  PAID: "결제 완료",
  UNPAID: "결제 대기",
  CANCELLED: "주문 취소",
  REFUNDED: "환불 완료",
  MOCK: "모의 결제",
  PREPARING: "배송 준비 중",
  SHIPPED: "배송 중",
  DELIVERED: "배송 완료",
};

const OrderCompletePage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      setError("주문 정보가 없습니다.");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await orderApi.getOrder(orderId);
        if (res.success) {
          setOrder(res.data);
        } else {
          setError(res.error || "주문 정보를 불러올 수 없습니다.");
          return;
        }

        try {
          const deliveryRes = await apiClient.get(`/api/orders/${orderId}/delivery`);
          setDelivery(deliveryRes.data);
        } catch (err) {
          setDelivery(null); // 배송 정보가 아직 없을 수 있음
        }
      } catch (e) {
        setError("주문 조회 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [orderId]);

  if (error) {
    return (
      <div className="order-complete-container">
        <div className="order-complete-error">
          <h2>주문 실패</h2>
          <p>{error}</p>
          <div className="order-complete-actions">
            <button
              className="order-complete-button order-complete-button-secondary"
              onClick={() => navigate("/main")}
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-complete-container">
        <div className="order-complete-loading">
          <h2>주문 정보를 확인 중입니다...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="order-complete-container">
      <div className="order-complete-success">
        <div className="order-complete-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <h1 className="order-complete-title">주문이 완료되었습니다! :짠:</h1>
        <p className="order-complete-subtitle">주문이 성공적으로 처리되었습니다.</p>
      </div>

      <div className="order-complete-info">
        <div className="order-complete-info-header">
          <h3>주문 상세 정보</h3>
        </div>
        <div className="order-complete-info-body">
          <div className="order-complete-row">
            <div className="order-complete-label">주문번호</div>
            <div className="order-complete-value highlight">{order.orderId}</div>
          </div>
          <div className="order-complete-row">
            <div className="order-complete-label">결제 상태</div>
            <div className="order-complete-value success">{statusMap[order.status] || order.status}</div>
          </div>
          <div className="order-complete-row">
            <div className="order-complete-label">결제 수단</div>
            <div className="order-complete-value">{statusMap[order.paymentMethod] || order.paymentMethod}</div>
          </div>
          <div className="order-complete-row">
            <div className="order-complete-label">총 결제 금액</div>
            <div className="order-complete-value highlight">{order.totalPrice.toLocaleString()}원</div>
          </div>

          {order.productNames && order.productNames.length > 0 && (
            <div className="order-complete-products">
              <h4>주문 상품</h4>
              <ul className="order-complete-product-list">
                {order.productNames.map((name, index) => (
                  <li key={index} className="order-complete-product-item">{name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="order-complete-delivery">
            <h4>배송 상태</h4>
            <div className="order-complete-delivery-info">
              <div className="order-complete-delivery-row">
                <div className="order-complete-delivery-label">상태</div>
                <div className="order-complete-delivery-value">
                  {delivery ? (statusMap[delivery.status] || delivery.status) : "배송 정보가 아직 준비되지 않았습니다."}
                </div>
              </div>
              {delivery?.trackingNumber && (
                <div className="order-complete-delivery-row">
                  <div className="order-complete-delivery-label">송장번호</div>
                  <div className="order-complete-delivery-value">{delivery.trackingNumber}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="order-complete-actions">
        <button
          className="order-complete-button order-complete-button-primary"
          onClick={() => navigate("/mypage", { state: { activeTab: "orders" } })}
        >
          주문 내역 보러가기
        </button>
        <button
          className="order-complete-button order-complete-button-secondary"
          onClick={() => navigate("/main")}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default OrderCompletePage;
