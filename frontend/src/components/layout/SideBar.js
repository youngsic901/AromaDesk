import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

// DB와 맞는 브랜드 목록
const BRAND_LIST = [
  { code: "CHANEL", label: "샤넬" },
  { code: "DIOR", label: "디올" },
  { code: "GUCCI", label: "구찌" },
  { code: "YSL", label: "입생로랑" },
  { code: "HERMES", label: "에르메스" },
];

const SideBar = ({ sidebarOpen = true, setSidebarOpen }) => {
  const location = useLocation();
  const [brandOpen, setBrandOpen] = useState(false);

  // 카테고리 메뉴
  const menu = [
    { label: "홈", to: "/" },
    { label: "남자향수", to: "/category/male" },
    { label: "여자향수", to: "/category/female" },
    { label: "남여공용", to: "/category/unisex" },
  ];

  return (
    <nav
      className={`sidebar bg-white border-end px-2 py-4 d-flex flex-column align-items-stretch${
        sidebarOpen ? "" : " d-none d-md-flex"
      }`}
      style={{ width: 220, minWidth: 180, transition: "all 0.2s" }}
    >
      <ul className="nav flex-column w-100">
        {menu.map((item) => (
          <li className="nav-item mb-1" key={item.to}>
            <Link
              to={item.to}
              className={`nav-link fw-semibold rounded ${
                location.pathname === item.to
                  ? "bg-dark text-white"
                  : "text-dark"
              }`}
              style={{ padding: "10px 16px", fontSize: 16 }}
            >
              {item.label}
            </Link>
          </li>
        ))}
        {/* 브랜드별 드롭다운 */}
        <li className="nav-item mb-1">
          <button
            className="nav-link fw-semibold rounded d-flex justify-content-between align-items-center text-dark w-100"
            style={{
              padding: "10px 16px",
              fontSize: 16,
              background: "none",
              border: "none",
            }}
            onClick={() => setBrandOpen((open) => !open)}
            aria-expanded={brandOpen}
          >
            브랜드별
            {brandOpen ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {brandOpen && (
            <ul className="nav flex-column ms-3 mt-1">
              {BRAND_LIST.map((brand) => (
                <li className="nav-item" key={brand.code}>
                  <Link
                    to={`/brand/${brand.code.toLowerCase()}`}
                    className={`nav-link rounded ${
                      location.pathname === `/brand/${brand.code.toLowerCase()}`
                        ? "bg-light text-primary"
                        : "text-dark"
                    }`}
                    style={{ padding: "7px 12px", fontSize: 15 }}
                  >
                    {brand.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default SideBar;
