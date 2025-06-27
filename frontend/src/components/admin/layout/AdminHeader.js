import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("AdminUser") || '{}');
  const { memberId, email } = adminUser || {};

  const handleLogout = async () => {
    try {
      await fetch("/api/members/logout", { method: "POST", credentials: "include" });
    } catch {}
    localStorage.removeItem("AdminUser");
    navigate("/adminLogin");
  };

  return (
    <header style={{
      width: "100%", background: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 64, position: "sticky", top: 0, zIndex: 100
    }}>
      <span style={{ fontWeight: 800, fontSize: 24, color: "#2563eb", cursor: "pointer" }} onClick={() => navigate("/admin/dashboard")}>AromaDesk Admin</span>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "right", marginRight: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{memberId || "관리자"}</div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{email}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: "#eee", border: "1px solid #ccc", borderRadius: 6, padding: "6px 16px", fontWeight: "bold", cursor: "pointer" }}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default AdminHeader; 