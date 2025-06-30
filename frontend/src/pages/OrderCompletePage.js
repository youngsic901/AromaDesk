import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import apiClient from "../api/axiosConfig";

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

        // 배송 상태 (없을 수도 있음)
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
      <div style={styles.container}>
        <h2>주문 실패</h2>
        <p style={styles.error}>{error}</p>
        <button style={styles.button} onClick={() => navigate("/")}>
          홈으로 가기
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={styles.container}>
        <h2>주문 정보를 확인 중입니다...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>주문이 완료되었습니다 🎉</h2>
      <p>주문번호: <strong>{order.orderId}</strong></p>
      <p>결제 상태: <strong>{order.status}</strong></p>
      <p>결제 수단: <strong>{order.paymentMethod}</strong></p>
      <p>총 결제 금액: <strong>{order.totalPrice.toLocaleString()}원</strong></p>

      <h4 style={{ marginTop: "2rem" }}>주문 상품</h4>
      <ul>
        {order.productNames?.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>

      <h4 style={{ marginTop: "2rem" }}>배송 상태</h4>
      {delivery ? (
        <div>
          <p><strong>상태:</strong> {delivery.status}</p>
          {delivery.trackingNumber && (
            <p><strong>송장번호:</strong> {delivery.trackingNumber}</p>
          )}
        </div>
      ) : (
        <p style={{ color: "#999" }}>배송 정보가 아직 준비되지 않았습니다.</p>
      )}

      <button style={styles.button} onClick={() => navigate("/mypage/orders")}>
        주문 내역 보러가기
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  button: {
    marginTop: "2rem",
    padding: "0.8rem 1.5rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};

export default OrderCompletePage;
