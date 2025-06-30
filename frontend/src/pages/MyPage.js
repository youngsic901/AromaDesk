import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/myPage.css';
import MyPageUpdate from './MyPageUpdate';
import { getMyPageInfo, checkPassword, changePassword } from '../api/mypageApi';
import apiClient from '../api/axiosConfig'; // axios 인스턴스 import

const TAB_LIST = [
  { key: 'info', label: '내 정보' },
  { key: 'address', label: '배송지 관리' },
  { key: 'orders', label: '주문 내역' }
];

function MyPage() {
  const [activeTab, setActiveTab] = useState('info');
  const [user, setUser] = useState(undefined); // null 대신 undefined로 초기화
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [showUpdate, setShowUpdate] = useState(false);
  const [showPwChange, setShowPwChange] = useState(false);
  const [pwStep, setPwStep] = useState(1); // 1: 현재 비번 확인, 2: 새 비번 입력
  const [pwInput, setPwInput] = useState({ current: '', next: '', nextCheck: '' });
  const [pwError, setPwError] = useState('');
  const navigate = useNavigate();
  
  // 로그인 여부 및 id 체크, 데이터 fetch
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
        // API 호출 실패 시 로그인 페이지로 리다이렉트
        navigate('/login');
      });
  }, [navigate]);

  // 로딩 중이거나 사용자 정보가 없으면 로딩 화면 표시
  if (isLoading || user === undefined) {
    return <div>로딩 중...</div>;
  }

  // 사용자 정보가 null이면 로그인 페이지로 리다이렉트
  if (!user) {
    navigate('/login');
    return null;
  }

  // 내 정보 수정
  const handleUpdate = (field) => {
    setShowUpdate(true);
  };

  // 비밀번호 변경
  const handlePwChange = () => {
    setShowPwChange(true);
    setPwStep(1);
    setPwInput({ current: '', next: '', nextCheck: '' });
    setPwError('');
  };
  
  const handlePwCheck = async () => {
    const cusUserRaw = localStorage.getItem('CusUser');
    const cusUser = cusUserRaw ? JSON.parse(cusUserRaw) : null;
    const userId = cusUser?.id;
    
    const result = await checkPassword(userId, pwInput.current);
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
    
    const cusUserRaw = localStorage.getItem('CusUser');
    const cusUser = cusUserRaw ? JSON.parse(cusUserRaw) : null;
    const userId = cusUser?.id;
    
    const result = await changePassword(userId, pwInput.next);
    if (result.success) {
      alert('비밀번호가 변경되었습니다.');
      setShowPwChange(false);
    } else {
      setPwError(result.error);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await apiClient.post('/api/members/logout');
    } catch (e) {
      // 실패해도 강제 로그아웃 처리
    }
    localStorage.removeItem('CusUser');
    navigate('/login');
  };

  return (
    <div className="mypage-wrapper" style={{position:'relative'}}>
      {/* 로그아웃 버튼 우측 상단 배치 */}
      <button
        style={{position:'absolute', top:20, right:20, zIndex:10, background:'#eee', border:'1px solid #ccc', borderRadius:6, padding:'6px 16px', fontWeight:'bold', cursor:'pointer'}}
        onClick={handleLogout}
      >
        로그아웃
      </button>
      <div className="mypage-profile">
        <div className="mypage-profile-icon">
          <span role="img" aria-label="profile" style={{fontSize: '48px'}}>👤</span>
        </div>
        <div className="mypage-profile-info">
          <div className="mypage-profile-name">{user.name}님</div>
          <div className="mypage-profile-email">{user.email}</div>
          <div className="mypage-profile-date">계정생성일: {user.createdAt?.slice(0,10)}</div>
        </div>
      </div>
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
                {pwError && <div style={{color:'red'}}>{pwError}</div>}
              </div>
            )}
            {pwStep === 2 && (
              <div>
                <input type="password" placeholder="새 비밀번호 입력" value={pwInput.next} onChange={e => setPwInput({ ...pwInput, next: e.target.value })} />
                <input type="password" placeholder="새 비밀번호 확인" value={pwInput.nextCheck} onChange={e => setPwInput({ ...pwInput, nextCheck: e.target.value })} />
                <button className="mypage-btn" onClick={handlePwUpdate}>저장</button>
                <button className="mypage-btn" onClick={()=>setShowPwChange(false)}>취소</button>
                {pwError && <div style={{color:'red'}}>{pwError}</div>}
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
          <div>
            <h3>주문 내역</h3>
            <div className="mypage-info-row">주문 내역이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
