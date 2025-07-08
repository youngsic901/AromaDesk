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
        await apiClient.put(`/api/deliveries/${deliveryId}/status/${deliveryStatus}`);
        setConfirmOpen(false);
    };

    if (!order) {
        return (
            <AdminLayout>
                <div className="admin-page">
                    <div className="loading">주문 정보를 불러오는 중...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 style={{fontSize: '28px', fontWeight: '700', marginBottom: '8px'}}>주문 상세 정보</h1>
                <h2 style={{fontSize: '16px', color: '#888', marginBottom: '24px'}}>주문번호: {order.orderId}</h2>

                <div className="top-bar">
                    <button className="back-button" onClick={() => navigate("/admin/orders")}>
                        ← 목록으로 돌아가기
                    </button>
                </div>

                <div className="order-detail-wrapper">
                    <div className="order-detail-card">
                        <div className="order-info-section">
                            <h3>주문 정보</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>주문번호</label>
                                    <span>{order.orderId}</span>
                                </div>
                                <div className="info-item">
                                    <label>회원 ID</label>
                                    <span>{order.memberId}</span>
                                </div>
                                <div className="info-item">
                                    <label>총금액</label>
                                    <span>{order.totalPrice?.toLocaleString()}원</span>
                                </div>
                                <div className="info-item">
                                    <label>주문일자</label>
                                    <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('ko-KR') : '-'}</span>
                                </div>
                                <div className="info-item">
                                    <label>배송지</label>
                                    <span>{order.address}</span>
                                </div>
                            </div>
                        </div>

                        <div className="status-section">
                            <h3>현재 상태</h3>
                            <div className="status-grid">
                                <div className="status-item">
                                    <label>주문 상태</label>
                                    <span className={`status-badge ${orderStatus.toLowerCase()}`}>
                                        {orderStatusMap[orderStatus]}
                                    </span>
                                </div>
                                <div className="status-item">
                                    <label>배송 상태</label>
                                    <span className={`status-badge ${deliveryStatus.toLowerCase()}`}>
                                        {deliveryStatusMap[deliveryStatus]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="control-section">
                            <h3>상태 변경</h3>
                            
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