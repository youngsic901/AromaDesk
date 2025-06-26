import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLoginAPI } from '../api/adminLoginApi';
import '../css/loginCus.css';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await adminLoginAPI.login(username.trim(), password.trim());
      
      if (result.success) {
        console.log('관리자 로그인 성공:', result.data);
        
        // 로컬스토리지에 관리자 정보 저장
        localStorage.setItem('AdminUser', JSON.stringify(result.data));
        
        alert('관리자 로그인 성공!');
        // 관리자 메인 페이지로 이동
        navigate('/admin');
      } else {
        console.log('관리자 로그인 실패:', result.error);
        setError(result.error);
        alert('로그인 실패: ' + result.error);
      }
    } catch (error) {
      console.error('관리자 로그인 처리 중 오류:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
      alert('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">관리자 로그인</h2>
        
        <input
          className="login-input"
          type="text"
          placeholder="관리자 아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <button 
          className="login-btn" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '관리자 로그인'}
        </button>

        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
