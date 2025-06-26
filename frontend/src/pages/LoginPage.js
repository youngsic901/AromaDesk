import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../login/useLogin.js';
import { socialLoginService } from '../login/socialLogin.js';
import '../css/loginCus.css';

const LoginPage = () => {
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!memberId.trim() || !password.trim()) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // 전송할 JSON 데이터 준비
    const loginData = {
      memberId: memberId.trim(),
      password: password.trim()
    };

    console.log('백엔드로 전송할 JSON 데이터:', loginData);

    try {
      const result = await login(memberId, password);
      if (result.success) {
        console.log('로그인 성공:', result.data);
        alert('로그인 성공!');
        // 로그인 성공 시 홈으로 이동
        navigate('/');
      } else {
        console.log('로그인 실패:', result.error);
        alert('로그인 실패: ' + result.error);
      }
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleGoogleLogin = () => {
    socialLoginService.googleLogin();
  };

  const handleKakaoLogin = () => {
    socialLoginService.kakaoLogin();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      
      <div className="login-container">
        <h2 className="login-title">로그인</h2>
        
        <input
          className="login-input"
          type="text"
          placeholder="아이디"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
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
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </div>
        )}

        {/* 소셜 로그인 버튼들 */}
        <button 
          className="google-btn" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="구글" 
            className="icon" 
          />
          구글로 로그인
        </button>

        <button 
          className="kakao-btn"
          onClick={handleKakaoLogin}
          disabled={isLoading}
        >
          <img 
            src="https://www.svgrepo.com/show/448234/kakao.svg" 
            alt="카카오" 
            className="icon" 
          /> 
          카카오로 로그인
        </button>
        
        <a href="/signup" className="signup-link">회원가입</a>
      </div>
    </div>
  );
};

export default LoginPage;
