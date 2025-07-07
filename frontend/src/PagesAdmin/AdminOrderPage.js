import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/layout/AdminLayout";
import apiClient from "../api/axiosConfig";
import "../css/AdminOrderPage.css";

/*
    전체 흐름도
    1. 컴포넌트 마운트 시 주문 목록 조회
    2. 주문 데이터 출력 (회원 이름 클릭 시 상세 페이지 이동)
    3. 주문 상태, 배송 상태를 한글로 변환해서 표시
*/

function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 주문 상태 한글 매핑
    const orderStatusMap = {
        ORDERED: "주문 완료",
        PAID: "결제 완료",
        CANCELLED: "주문 취소",
    };

    // 배송 상태 한글 매핑
    const deliveryStatusMap = {
        PREPARING: "배송 준비 중",
        SHIPPED: "배송 중",
        DELIVERED: "배송 완료",
        CANCELLED: "배송 취소",
    };

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
                                <th>주문 상태</th>
                                <th>배송 상태</th>
                                <th>총금액</th>
                                <th>날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>
                                        <span
                                            onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                                            style={{ cursor: "pointer", textDecoration: "underline", color: "#1b5e20" }}
                                        >
                                            {order.memberName}
                                        </span>
                                    </td>
                                    <td>{orderStatusMap[order.orderStatus] || order.orderStatus}</td>
                                    <td>{deliveryStatusMap[order.deliveryStatus] || order.deliveryStatus}</td>
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
