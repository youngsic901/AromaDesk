import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaEdit, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MyPageUpdate from "./MyPageUpdate";
import AddressUpdate from "../components/AddressUpdate";
import { authManager } from "../api/authApi";
import MyOrders from "./MyOrders";
import { useLocation } from "react-router-dom";

const MyPage = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "info");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // ProtectedRoute에서 인증 확인을 하므로 여기서는 단순히 사용자 정보만 가져옴
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await authManager.getUserInfo();

        if (result.success) {
          setUserInfo(result.data);
        } else {
          setError(result.error || "사용자 정보를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleUpdateSuccess = (updatedUser) => {
    setUserInfo(updatedUser);
    setShowUpdateForm(false);
  };

  const handleAddressUpdateSuccess = (updatedUser) => {
    setUserInfo(prev => ({
      ...prev,
      ...updatedUser
    }));
    setShowAddressForm(false);
  };

  const handleEditClick = () => {
    setShowUpdateForm(true);
  };

  const handleAddressEditClick = () => {
    setShowAddressForm(true);
  };

  // 로딩 상태
  if (loading) {
    return (
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">로딩 중...</span>
            </div>
          </div>
        </Container>
    );
  }

  // 에러 상태
  if (error) {
    return (
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
    );
  }

  return (
      <Container className="py-5">
        <Row>
          <Col lg={3}>
            {/* 사이드바 */}
            <Card className="mb-4">
              <Card.Body>
                <div className="text-center mb-3">
                  <div
                      className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                          userInfo ? "bg-primary" : "bg-light"
                      }`}
                      style={{ width: 80, height: 80 }}
                  >
                    <FaUser className={userInfo ? "text-white" : "text-muted"} size={40} />
                  </div>
                  <h5 className="mt-2 mb-0">
                    {userInfo ? userInfo.name : "마이페이지"}
                  </h5>
                  <small className="text-muted">
                    {userInfo ? userInfo.email : "로그인하여 개인정보를 관리하세요"}
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* 네비게이션 메뉴 */}
            <Card>
              <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                  <button
                      className={`list-group-item list-group-item-action d-flex align-items-center ${
                          activeTab === "info" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("info")}
                  >
                    <FaUser className="me-2" />
                    개인정보
                  </button>
                  <button
                      className={`list-group-item list-group-item-action d-flex align-items-center ${
                          activeTab === "address" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("address")}
                  >
                    <FaMapMarkerAlt className="me-2" />
                    배송지 관리
                  </button>
                  <button
                      className={`list-group-item list-group-item-action d-flex align-items-center ${
                          activeTab === "orders" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("orders")}
                  >
                    <FaShoppingBag className="me-2" />
                    주문내역
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            {/* 메인 콘텐츠 */}
            {activeTab === "info" && (
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">개인정보</h5>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleEditClick}
                    >
                      <FaEdit className="me-1" />
                      {userInfo ? "수정" : "로그인하여 수정"}
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {userInfo ? (
                        <Row>
                          <Col md={6}>
                            <p><strong>이름:</strong> {userInfo.name}</p>
                            <p><strong>이메일:</strong> {userInfo.email}</p>
                            <p><strong>전화번호:</strong> {userInfo.phone || "미등록"}</p>
                          </Col>
                          <Col md={6}>
                            <p><strong>가입일:</strong> {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('ko-KR') : "미등록"}</p>
                          </Col>
                        </Row>
                    ) : (
                        <div className="text-center py-4">
                          <p className="text-muted mb-3">로그인하여 개인정보를 확인하고 관리하세요.</p>
                          <Button variant="primary" onClick={() => navigate('/login', { state: { from: '/mypage' } })}>
                            <FaSignInAlt className="me-2" />
                            로그인하기
                          </Button>
                        </div>
                    )}
                  </Card.Body>
                </Card>
            )}

            {activeTab === "address" && (
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">배송지 관리</h5>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleAddressEditClick}
                    >
                      <FaEdit className="me-1" />
                      {userInfo ? "수정" : "로그인하여 수정"}
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {userInfo ? (
                        <div>
                          <p><strong>우편번호:</strong> {userInfo.zipCode || "미등록"}</p>
                          <p><strong>주소:</strong> {userInfo.address || "미등록"}</p>
                          <p><strong>상세주소:</strong> {userInfo.addressDetail || "미등록"}</p>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                          <p className="text-muted mb-3">로그인하여 배송지 정보를 확인하고 관리하세요.</p>
                          <Button variant="primary" onClick={() => navigate('/login', { state: { from: '/mypage' } })}>
                            <FaSignInAlt className="me-2" />
                            로그인하기
                          </Button>
                        </div>
                    )}
                  </Card.Body>
                </Card>
            )}

            {activeTab === "orders" && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">주문내역</h5>
                </Card.Header>
                <Card.Body>
                  {userInfo ? (
                    <MyOrders/>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-3">로그인하여 주문내역을 확인하세요.</p>
                      <Button
                        variant="primary"
                        onClick={() => navigate("/login", { state: { from: "/mypage" } })}
                      >
                        <FaSignInAlt className="me-2" />
                        로그인하기
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

          </Col>
        </Row>

        {/* 개인정보 수정 모달 */}
        {showUpdateForm && (
            <MyPageUpdate
                user={userInfo}
                field="info"
                onUpdate={handleUpdateSuccess}
                onClose={() => setShowUpdateForm(false)}
            />
        )}

        {/* 배송지 수정 모달 */}
        {showAddressForm && (
            <AddressUpdate
                user={userInfo}
                onUpdate={handleAddressUpdateSuccess}
                onClose={() => setShowAddressForm(false)}
            />
        )}
      </Container>
  );
};

export default MyPage;