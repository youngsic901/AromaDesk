import React from "react";
const Footer = () => {
  return (
      <footer className="bg-light text-center text-muted py-4 mt-5 border-top">
        <div className="container">
          <div style={{ fontSize: "13px", lineHeight: 1.7, textAlign: "left", maxWidth: 700, margin: "0 auto" }}>
            주소 : 서울 강남구 테헤란로 124 삼원타워 5층 | 사업자번호 : 104-88-77777 | 대표자 : Odeur Team <br />
            이메일 : Oduer@acorn.com<br />
          </div>
          <div style={{ fontSize: "13px", marginTop: 8 }}>
            © 2025-2025 AromaDesk. Proudly crested with Acorn <br />
            본 사이트는 포트폴리오/학습용 데모입니다.
          </div>
        </div>
      </footer>
  );
};
export default Footer;
