import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import apiClient from "../api/axiosConfig"; // 배송 상태 요청을 위해 사용

const OrderCompletePage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setError("주문 정보가 없습니다.");
      return;
    }

    const fetchData = async () => {
      // 주문 정보
      const orderRes = await orderApi.getOrder(orderId);
      if (orderRes.success) {
        setOrder(orderRes.data);
      } else {
        setError(orderRes.error || "주문 조회 실패");
        return;
      }

      // 배송 상태
      try {
        const res = await apiClient.get(`/api/orders/${orderId}/delivery`);
        setDelivery(res.data);
      } catch (err) {
        console.warn("배송 정보 없음 (아직 생성 안 됐을 수 있음)");
        setDelivery(null);
      }
    };

    fetchData();
  }, [orderId]);

  if (error) {
    return (
      <div className="container py-5">
        <h2>주문 실패</h2>
        <p className="text-danger">{error}</p>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          홈으로
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <h2>주문 확인 중...</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">주문이 완료되었습니다 🎉</h2>
      <p className="mb-2">주문번호: <strong>{order.orderId}</strong></p>
      <p className="mb-2">결제 상태: <strong>{order.status}</strong></p>
      <p className="mb-4">총 금액: <strong>{order.totalPrice.toLocaleString()}원</strong></p>

      <h5 className="mt-4 mb-2">주문 상품</h5>
      <ul className="list-group mb-4">
        {order.items?.map((item) => (
          <li key={item.productId} className="list-group-item">
            {item.name} - {item.quantity}개 ({(item.price * item.quantity).toLocaleString()}원)
          </li>
        ))}
      </ul>

      {/* 배송 상태 블록 */}
      {delivery ? (
        <div className="mb-4">
          <h5 className="mb-2">배송 상태</h5>
          <p>
            <strong>상태:</strong> {delivery.status} <br />
            {delivery.trackingNumber && (
              <>
                <strong>송장번호:</strong> {delivery.trackingNumber} <br />
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <h5 className="mb-2">배송 상태</h5>
          <p className="text-muted">배송 정보가 아직 준비되지 않았습니다.</p>
        </div>
      )}

      <button className="btn btn-primary" onClick={() => navigate("/mypage")}>
        주문 내역 보기
      </button>
    </div>
  );
};

export default OrderCompletePage;