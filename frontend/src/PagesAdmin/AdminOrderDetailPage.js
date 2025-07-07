import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/layout/AdminLayout";
import apiClient from "../api/axiosConfig";
import { AdminBasicModal } from "../components/admin/UnifiedAdminModal";
import "../css/AdminOrderDetailPage.css";

function AdminOrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("");
    const [deliveryStatus, setDeliveryStatus] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const orderStatusMap = {
        ORDERED: "주문 완료",
        PAID: "결제 완료",
        CANCELLED: "주문 취소",
    };

    const deliveryStatusMap = {
        PREPARING: "배송 준비 중",
        SHIPPED: "배송 중",
        DELIVERED: "배송 완료",
        CANCELLED: "배송 취소",
    };

    useEffect(() => {
        apiClient.get(`/api/admin/orders/${orderId}`)
            .then(res => {
                setOrder(res.data);
                setOrderStatus(res.data.orderStatus);
                setDeliveryStatus(res.data.deliveryStatus);
            })
            .catch(() => setOrder(null));
    }, [orderId]);

    const handleConfirm = (message, callback) => {
        setConfirmMessage(message);
        setOnConfirm(() => callback);
        setConfirmOpen(true);
    };

    const updateOrderStatus = async () => {
        await apiClient.put(`/api/admin/orders/${orderId}/order-status`, { orderStatus });
        setConfirmOpen(false);
    };

    const updateDeliveryStatus = async () => {
        const deliveryId = order.deliveryId;
        if (!deliveryId) return;
        await apiClient.post(`/api/admin/delivery/${deliveryId}/status`, { status: deliveryStatus });
        setConfirmOpen(false);
    };

    if (!order) {
        return <AdminLayout><div className="loading">주문 정보를 불러오는 중...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="page-wrapper">
                <div className="top-bar">
                    <button className="back-button" onClick={() => navigate("/admin/orders")}>목록으로</button>
                </div>

                <div className="order-detail-wrapper">
                    <div className="order-detail-card">
                        <div>주문번호: {order.orderId}</div>
                        <div>회원 ID: {order.memberId}</div>
                        <div>총금액: {order.totalPrice?.toLocaleString()}원</div>
                        <div>주문일자: {order.orderDate?.slice(0, 10)}</div>
                        <div>배송지: {order.address}</div>
                        <div>현재 주문 상태: {orderStatusMap[orderStatus]}</div>
                        <div>현재 배송 상태: {deliveryStatusMap[deliveryStatus]}</div>

                        <div className="order-detail-control">
                            <label>주문 상태 변경</label>
                            <select
                                value={orderStatus || ""}
                                onChange={(e) => setOrderStatus(e.target.value)}
                            >
                                <option value="ORDERED">주문 완료</option>
                                <option value="PAID">결제 완료</option>
                                <option value="CANCELLED">주문 취소</option>
                            </select>
                            <button
                                className="save-button"
                                onClick={() => handleConfirm(
                                    <>
                                        <strong>주문 상태를 '{orderStatusMap[order.orderStatus]}' → <span style={{ color: "#dc2626" }}>{orderStatusMap[orderStatus]}</span>' 로 변경하시겠습니까?</strong>
                                    </>,
                                    updateOrderStatus
                                )}
                            >저장</button>
                        </div>

                        <div className="order-detail-control">
                            <label>배송 상태 변경</label>
                            <select
                                value={deliveryStatus || ""}
                                onChange={(e) => setDeliveryStatus(e.target.value)}
                            >
                                <option value="PREPARING">배송 준비 중</option>
                                <option value="SHIPPED">배송 중</option>
                                <option value="DELIVERED">배송 완료</option>
                                <option value="CANCELLED">배송 취소</option>
                            </select>
                            <button
                                className="save-button"
                                onClick={() => handleConfirm(
                                    <>
                                        <strong>배송 상태를 '{deliveryStatusMap[order.deliveryStatus]}' → <span style={{ color: "#dc2626" }}>{deliveryStatusMap[deliveryStatus]}</span>' 로 변경하시겠습니까?</strong>
                                    </>,
                                    updateDeliveryStatus
                                )}
                            >저장</button>
                        </div>
                    </div>
                </div>
            </div>

            <AdminBasicModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={onConfirm}
                title="상태 변경 확인"
                showCancelButton={true}
                confirmText="변경"
                cancelText="취소"
            >
                <div style={{ fontSize: "16px" }}>{confirmMessage}</div>
            </AdminBasicModal>
        </AdminLayout>
    );
}

export default AdminOrderDetailPage;