import React, { useEffect, useState } from "react";
import AdminLayout from "../components/admin/layout/AdminLayout";
import apiClient from "../api/axiosConfig";
import "../css/AdminOrderPage.css";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/admin/orders")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-order-page">
        <h2>주문 관리</h2>
        <div className="admin-order-desc">
          주문 내역의 상태를 확인하는 페이지 입니다
        </div>
        {isLoading ? (
          <div className="admin-order-loading">불러오는 중...</div>
        ) : orders.length === 0 ? (
          <div className="admin-order-empty">주문이 없습니다.</div>
        ) : (
          <table className="admin-order-table">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>회원</th>
                <th>상태</th>
                <th>총금액</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.memberName}</td>
                  <td>{order.status}</td>
                  <td>{order.totalPrice?.toLocaleString()}원</td>
                  <td>{order.orderDate?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminOrderPage;
