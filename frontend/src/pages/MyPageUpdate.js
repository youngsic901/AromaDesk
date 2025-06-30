import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authManager } from '../api/authApi';
import { logout as logoutAction } from '../app/slices/userSlice';

function MyPageUpdate({ user, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    let updateData = {
      memberId: user.memberId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: user.address // 기존 배송지 유지
    };
    
    // authManager를 통한 중앙 집중식 사용자 정보 업데이트
    const result = await authManager.updateUserInfo(updateData);
    
    if (result.success) {
      const updatedUser = { ...user, ...updateData };
      onUpdate(updatedUser);
      onClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{marginTop: 16}}>
      <h3>개인정보 수정</h3>
      <div className="mypage-info-row">
        <label>닉네임</label>
        <input name="name" value={form.name} onChange={handleChange} />
        <label>이메일</label>
        <input name="email" value={form.email} onChange={handleChange} />
      </div>
      <div className="mypage-info-row">
        <label>휴대폰 번호</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          className="mypage-btn" 
          onClick={handleSave} 
          disabled={loading}
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '저장 중...' : '저장'}
        </button>
        <button 
          className="mypage-btn" 
          onClick={onClose} 
          disabled={loading}
          style={{ 
            backgroundColor: '#6c757d', 
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          취소
        </button>
      </div>
      {error && (
        <div style={{ 
          color: 'red', 
          marginTop: '10px', 
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default MyPageUpdate; 