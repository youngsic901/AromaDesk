import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaEdit } from "react-icons/fa";
import MyPageUpdate from "./MyPageUpdate";
import AddressUpdate from "../components/AddressUpdate";
import { authManager } from "../api/authApi";

const MyPage = () => {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("info");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 정보 가져오기 (authManager 사용)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // authManager를 통한 중앙 집중식 사용자 정보 조회
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

    if (user && user.id) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateSuccess = (updatedUser) => {
    setUserInfo(updatedUser);
    setShowUpdateForm(false);
  };

  const handleAddressUpdateSuccess = (updatedUser) => {
    setUserInfo(updatedUser);
    setShowAddressForm(false);
  };

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

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!userInfo) {
    return (
      <Container className="py-5">
        <Alert variant="warning">사용자 정보를 찾을 수 없습니다.</Alert>
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
                  className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center"
                  style={{ width: 80, height: 80 }}
                >
                  <FaUser className="text-white" size={40} />
                </div>
                <h5 className="mt-2 mb-0">{userInfo.name}</h5>
                <small className="text-muted">{userInfo.email}</small>
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
                  onClick={() => setShowUpdateForm(true)}
                >
                  <FaEdit className="me-1" />
                  수정
                </Button>
              </Card.Header>
              <Card.Body>
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
                  onClick={() => setShowAddressForm(true)}
                >
                  <FaEdit className="me-1" />
                  수정
                </Button>
              </Card.Header>
              <Card.Body>
                <div>
                  <p><strong>우편번호:</strong> {userInfo.zipCode || "미등록"}</p>
                  <p><strong>주소:</strong> {userInfo.address || "미등록"}</p>
                  <p><strong>상세주소:</strong> {userInfo.addressDetail || "미등록"}</p>
                </div>
              </Card.Body>
            </Card>
          )}

          {activeTab === "orders" && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">주문내역</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted">주문내역 기능은 준비 중입니다.</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* 개인정보 수정 모달 */}
      {showUpdateForm && (
        <MyPageUpdate
          user={userInfo}
          onSuccess={handleUpdateSuccess}
          onClose={() => setShowUpdateForm(false)}
        />
      )}

      {/* 배송지 수정 모달 */}
      {showAddressForm && (
        <AddressUpdate
          user={userInfo}
          onSuccess={handleAddressUpdateSuccess}
          onClose={() => setShowAddressForm(false)}
        />
      )}
    </Container>
  );
};

export default MyPage;
