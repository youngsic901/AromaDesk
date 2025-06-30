import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderPaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state || !state.items || !state.product) {
    return <div className="text-center py-5">잘못된 접근입니다.</div>;
  }

  const { items, deliveryId, paymentMethod, product } = state;
  const quantity = items[0].quantity;
  const totalPrice = quantity * product.price;

  const handleConfirm = () => {
    const orderData = {
      items,
      deliveryId,
      paymentMethod,
    };

    fetch("/api/orders/single", {
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
            const orderId = data.orderId; 
            alert("결제가 완료되었습니다.");
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

        <div className="row mb-3">
          <div className="col-md-3 fw-semibold">상품명</div>
          <div className="col-md-9">{product.name}</div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3 fw-semibold">수량</div>
          <div className="col-md-9">{quantity}</div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3 fw-semibold">총 결제금액</div>
          <div className="col-md-9 text-danger fw-bold">
            {totalPrice.toLocaleString()}원
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-3 fw-semibold">결제 수단</div>
          <div className="col-md-9">{paymentMethod}</div>
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