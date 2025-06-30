import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../login/useLogin.js";
import "../css/loginCus.css";
import axios from "axios";

const LoginPage = () => {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!memberId.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const result = await login(memberId.trim(), password.trim());
      if (result.success) {
        console.log("로그인 성공:", result.data);
        alert("로그인 성공!");
        // 로그인 성공 시 홈으로 이동
        navigate("/");
      } else {
        console.log("로그인 실패:", result.error);
        alert("로그인 실패: " + result.error);
      }
    } catch (error) {
      console.error("로그인 처리 중 오류:", error);
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
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
          {isLoading ? "로그인 중..." : "로그인"}
        </button>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginTop: "10px" }}
          >
            {error}
          </div>
        )}

        {/* 소셜 로그인 버튼들 */}
        <a
          className="google-btn"
          href="http://localhost/oauth2/authorization/google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          구글로 로그인
        </a>
        <a
          className="kakao-btn"
          href="http://localhost/oauth2/authorization/kakao"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          카카오로 로그인
        </a>
        <a
          className="naver-btn"
          href="http://localhost/oauth2/authorization/naver"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          네이버로 로그인
        </a>

        <button
          className="signup-link"
          style={{
            background: "none",
            border: "none",
            color: "#0076ff",
            fontSize: "1rem",
            cursor: "pointer",
            padding: 0,
            marginTop: "12px",
            textDecoration: "none",
          }}
          onClick={async () => {
            try {
              await axios.get("/auth/clear-social-session", {
                withCredentials: true,
              });
            } catch (e) {}
            navigate("/signup");
          }}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
