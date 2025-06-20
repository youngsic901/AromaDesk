import React from "react";

// 임시 페이지!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function Home() {
  const handleHealthCheck = () => {
    fetch("http://localhost/api/health")
      .then((response) => response.text())
      .then((data) => {
        console.log("Health Check:", data);
        alert("백엔드 헬스체크 성공! 콘솔을 확인하세요.");
      })
      .catch((error) => {
        console.error("Health Check Error:", error);
        alert("백엔드 헬스체크 실패. 콘솔을 확인하세요.");
      });
  };

  const handleGetProducts = () => {
    fetch("http://localhost/api/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Products:", data);
        alert("상품 목록 가져오기 성공! 콘솔을 확인하세요.");
      })
      .catch((error) => {
        console.error("Get Products Error:", error);
        alert("상품 목록 가져오기 실패. 콘솔을 확인하세요.");
      });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>홈 페이지</h1>
      <a href="/login">로그인으로 이동</a>
      <hr />
      <button onClick={handleHealthCheck}>백엔드 헬스 체크</button>
      <br />
      <br />
      <button onClick={handleGetProducts}>상품 목록 가져오기</button>
    </div>
  );
}

export default Home;
