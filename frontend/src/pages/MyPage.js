import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/myPage.css';

import MyPageUpdate from './MyPageUpdate';
import {
  getMyPageInfo,
  checkPassword,
  changePassword,
  getMyOrders
} from '../api/mypageApi';
import apiClient from '../api/axiosConfig';

const TAB_LIST = [
  { key: 'info', label: '내 정보' },
  { key: 'address', label: '배송지 관리' },
  { key: 'orders', label: '주문 내역' }
];

function MyPage() {
  const [activeTab, setActiveTab] = useState('info');
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showPwChange, setShowPwChange] = useState(false);
  const [pwStep, setPwStep] = useState(1);
  const [pwInput, setPwInput] = useState({ current: '', next: '', nextCheck: '' });
  const [pwError, setPwError] = useState('');
  const [orderList, setOrderList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return '결제완료';
      case 'CANCELED':
      case 'CANCELLED':
        return '취소됨';
      case 'PENDING':
        return '결제대기';
      default:
        return status;
    }
  };

  useEffect(() => {
    const cusUserRaw = localStorage.getItem('CusUser');
    if (!cusUserRaw) {
      navigate('/login');
      return;
    }
    let cusUser;
    try {
      cusUser = JSON.parse(cusUserRaw);
    } catch {
      localStorage.removeItem('CusUser');
      navigate('/login');
      return;
    }
    const userId = cusUser?.id;
    if (!userId) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    getMyPageInfo(userId)
      .then(data => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'orders') {
      getMyOrders()
        .then(data => {
          const sorted = [...data].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
          setOrderList(sorted);
        })
        .catch(() => setOrderList([]));
    }
  }, [activeTab]);

  if (isLoading || user === undefined) return <div>로딩 중...</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdate = () => setShowUpdate(true);

  const handlePwChange = () => {
    setShowPwChange(true);
    setPwStep(1);
    setPwInput({ current: '', next: '', nextCheck: '' });
    setPwError('');
  };

  const handlePwCheck = async () => {
    const cusUser = JSON.parse(localStorage.getItem('CusUser') || '{}');
    const result = await checkPassword(cusUser?.id, pwInput.current);
    if (result.success) {
      setPwStep(2);
      setPwError('');
    } else {
      setPwError(result.error);
    }
  };

  const handlePwUpdate = async () => {
    if (pwInput.next !== pwInput.nextCheck) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    const cusUser = JSON.parse(localStorage.getItem('CusUser') || '{}');
    const result = await changePassword(cusUser?.id, pwInput.next);
    if (result.success) {
      alert('비밀번호가 변경되었습니다.');
      setShowPwChange(false);
    } else {
      setPwError(result.error);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/members/logout');
    } catch {}
    localStorage.removeItem('CusUser');
    navigate('/login');
  };

  return (
    <div className="mypage-wrapper">
      {/* 탭 메뉴 */}
      <div className="mypage-tabs">
        {TAB_LIST.map(tab => (
          <button
            key={tab.key}
            className={`mypage-tab-btn${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setShowUpdate(false); setShowPwChange(false); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mypage-content">
        {activeTab === 'info' && !showUpdate && !showPwChange && (
          <div>
            <h3>기본 정보</h3>
            <div className="mypage-info-row">
              <label>닉네임</label>
              <input value={user.name} readOnly />
              <label>이메일</label>
              <input value={user.email} readOnly />
            </div>
            <div className="mypage-info-row">
              <label>휴대폰 번호</label>
              <input value={user.phone} readOnly />
            </div>
            <button className="mypage-btn" onClick={() => handleUpdate('info')}>수정하기</button>
            <h4>비밀번호 변경</h4>
            <button className="mypage-btn" onClick={handlePwChange}>비밀번호 변경</button>
          </div>
        )}

        {activeTab === 'info' && showUpdate && (
          <MyPageUpdate user={user} field="info" onClose={() => setShowUpdate(false)} onUpdate={setUser} />
        )}

        {activeTab === 'info' && showPwChange && (
          <div>
            <h4>비밀번호 변경</h4>
            {pwStep === 1 && (
              <div>
                <input type="password" placeholder="현재 비밀번호 입력" value={pwInput.current} onChange={e => setPwInput({ ...pwInput, current: e.target.value })} />
                <button className="mypage-btn" onClick={handlePwCheck}>확인</button>
                {pwError && <div style={{ color: 'red' }}>{pwError}</div>}
              </div>
            )}
            {pwStep === 2 && (
              <div>
                <input type="password" placeholder="새 비밀번호 입력" value={pwInput.next} onChange={e => setPwInput({ ...pwInput, next: e.target.value })} />
                <input type="password" placeholder="새 비밀번호 확인" value={pwInput.nextCheck} onChange={e => setPwInput({ ...pwInput, nextCheck: e.target.value })} />
                <button className="mypage-btn" onClick={handlePwUpdate}>저장</button>
                <button className="mypage-btn" onClick={() => setShowPwChange(false)}>취소</button>
                {pwError && <div style={{ color: 'red' }}>{pwError}</div>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'address' && !showUpdate && (
          <div>
            <h3>배송지 관리</h3>
            <div className="mypage-info-row">
              <label>배송지</label>
              <input value={user.address} readOnly />
            </div>
            <button className="mypage-btn" onClick={() => handleUpdate('address')}>수정하기</button>
          </div>
        )}

        {activeTab === 'address' && showUpdate && (
          <MyPageUpdate user={user} field="address" onClose={() => setShowUpdate(false)} onUpdate={setUser} />
        )}

        {activeTab === 'orders' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              {['ALL', 'COMPLETED', 'CANCELED'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    marginRight: '8px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: statusFilter === status ? 'rgb(210,234,248)' : '#fff',
                    fontWeight: statusFilter === status ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {status === 'ALL' ? '전체' : getStatusLabel(status)}
                </button>
              ))}
            </div>

            <div className="order-list">
              {orderList
                .filter(order => {
                  if (statusFilter === 'ALL') return true;
                  if (statusFilter === 'COMPLETED') return ['COMPLETED', 'PAID'].includes(order.status);
                  return order.status === statusFilter;
                })
                .map(order => (
                  <div key={order.orderId} className="order-card">
                    <div className="order-header">
                      <span className="order-id">주문번호: {order.orderId}</span>
                      <span className="order-date">{order.orderDate?.slice(0, 10)}</span>
                    </div>
                    <div className="order-body">
                      <div><strong>총금액:</strong> {order.totalPrice?.toLocaleString()}원</div>
                      <div><strong>상태:</strong> {getStatusLabel(order.status)}</div>
                      <div><strong>결제수단:</strong> {order.paymentMethod}</div>
                      <div><strong>상품:</strong> {order.productNames?.join(', ')}</div>
                    </div>
                  </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .order-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }

        .order-card {
          background-color: rgb(251, 247, 255);
          border: 1px solid rgb(203,216,249);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-weight: bold;
          color: rgb(15, 2, 61);
        }

        .order-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.95rem;
          color: #4e342e;
        }
      `}</style>
    </div>
  );
}

export default MyPage;