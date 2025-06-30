import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authManager } from '../api/authApi';
import { logout as logoutAction } from '../app/slices/userSlice';
import '../css/myPage.css';

function AddressUpdate({ onClose, onUpdate }) {
  const [currentAddress, setCurrentAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 컴포넌트 마운트 시 현재 배송지 정보 조회
  useEffect(() => {
    const fetchCurrentAddress = async () => {
      try {
        setIsLoading(true);
        setError('');

        console.log('배송지 정보 조회 시작');
        // authManager를 통한 중앙 집중식 사용자 정보 조회
        const result = await authManager.getUserInfo();
        console.log('사용자 정보 조회 결과:', result);

        if (result.success) {
          const userData = result.data;
          setCurrentAddress(userData.address || '');
          setFormData({
              address: userData.address || '',
              addressDetail: ''
          });
          console.log('배송지 정보 설정 완료:', userData.address);
        } else {
          setError(result.error);
          console.error('배송지 조회 실패:', result.error);
        }
      } catch (error) {
        console.error('배송지 조회 중 예외 발생:', error);
        setError('배송지 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentAddress();
  }, [dispatch, navigate]);

  const handleSave = async () => {
    if (!formData.address.trim()) {
      setError('배송지를 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      console.log('배송지 수정 시작');
      // authManager를 통한 중앙 집중식 사용자 정보 업데이트
      const fullAddress = `${formData.address.trim()} ${formData.addressDetail.trim()}`.trim();

      const result = await authManager.updateUserInfo({ address: fullAddress });
      console.log('배송지 수정 결과:', result);

      if (result.success) {
        // 성공 시 부모 컴포넌트에 업데이트된 정보 전달
          onUpdate({ address: fullAddress });

        alert('배송지가 성공적으로 수정되었습니다.');
        onClose();
      } else {
        setError(result.error);
        console.error('배송지 수정 실패:', result.error);
      }
    } catch (error) {
      console.error('배송지 수정 중 예외 발생:', error);
      setError('배송지 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                setFormData(prev => ({
                    ...prev,
                    address: data.address
                }));
            }
        }).open();
    };

    const [formData, setFormData] = useState({
        address: '',
        addressDetail: ''
    });

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '16px',
        color: '#666'
      }}>
        배송지 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h3>배송지 수정</h3>

      <div className="mypage-info-row">
        <label>현재 배송지</label>
        <input
          value={currentAddress}
          readOnly
          style={{ backgroundColor: '#f5f5f5' }}
        />
      </div>

      <div className="mypage-info-row">
        <label>새 배송지</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) =>
              setFormData((prev) => ({
                  ...prev,
                  address: e.target.value
              }))
          }
          placeholder="새로운 배송지를 입력해주세요"
          style={{ width: '100%' }}
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          disabled={isLoading}
          style={{
              width: '80px',
              padding: '10px 5px',
              backgroundColor: '#FFE812',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              flexShrink: 0
          }}
        >
          주소 검색
        </button>
      </div>
      <div className="mypage-info-row">
        <label>상세 주소</label>
        <input
          type="text"
          value={formData.addressDetail}
          onChange={(e) =>
              setFormData((prev) => ({
                  ...prev,
                  addressDetail: e.target.value
              }))
          }
          placeholder="예: 101동 505호"
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          className="mypage-btn"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.6 : 1
          }}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>

        <button
          className="mypage-btn"
          onClick={handleCancel}
          disabled={isSaving}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.6 : 1
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

export default AddressUpdate;