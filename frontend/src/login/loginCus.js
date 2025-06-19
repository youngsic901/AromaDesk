import React, { useState } from 'react';
import '../css/loginCus.css';
import axios from 'axios';

function LoginCus() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/login',
        { id, password },
        { withCredentials: true } 
      );
      console.log('로그인 성공');
    } catch (error) {
      console.error('로그인 실패', error.response?.data?.message);
      alert('로그인 실패: ' + (error.response?.data?.message || '오류 발생'));
    }
  };

  const goToGoogleLogin = () => {
  window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: "dummy-client-id", // 실제 사용 안하니까 더미 값
      redirect_uri: "http://localhost:3000", // 돌아올 주소 (임의)
      response_type: "code",
      scope: "email profile"
    });
};


  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <input
        className="login-input"
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-btn" onClick={login}>로그인</button>

      {/* 소셜 로그인 버튼들은 그대로 둠 */}
      <button className="google-btn" onClick={goToGoogleLogin}>
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="구글" className="icon" />
         구글로 로그인
      </button>

      <button className="kakao-btn">
        <img src="https://www.svgrepo.com/show/448234/kakao.svg" alt="카카오" className="icon" /> 카카오로 로그인
      </button>
      <a href="#" className="signup-link">회원가입</a>
    </div>
  );
}

export default LoginCus;
