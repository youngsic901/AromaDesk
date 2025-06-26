import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaUser, FaBars } from "react-icons/fa";

const Header = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { totalQuantity } = useSelector((state) => state.cart);
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value.trim();
    if (searchTerm) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        {/* 모바일 사이드바 토글 버튼 */}
        <button
          className="btn btn-link d-lg-none me-2"
          onClick={toggleSidebar}
          style={{ padding: 0, fontSize: 20 }}
        >
          <FaBars />
        </button>

        {/* 로고 */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          AromaDesk
        </Link>

        {/* 검색 폼 */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form
            className="d-flex mx-auto align-items-center"
            style={{ maxWidth: 400, minHeight: 48 }}
            onSubmit={handleSearch}
          >
            <input
              className="form-control me-2"
              type="search"
              name="search"
              placeholder="향수 검색..."
              aria-label="Search"
              style={{ height: 44, fontSize: 16 }}
            />
            <button
              className="btn btn-outline-primary"
              type="submit"
              style={{ height: 44, minWidth: 64, fontSize: 16 }}
            >
              검색
            </button>
          </form>
        </div>

        {/* 우측 메뉴 */}
        <div className="d-flex align-items-center gap-2">
          {/* 장바구니 */}
          <Link
            to="/cart"
            className="btn btn-outline-primary position-relative"
            style={{ height: 44, minWidth: 44 }}
          >
            <FaShoppingCart />
            {totalQuantity > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* 로그인/마이페이지 */}
          {isLoggedIn ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                style={{ height: 44, minWidth: 44 }}
              >
                <FaUser />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/mypage">
                    마이페이지
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item">로그아웃</button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ height: 44, minWidth: 80 }}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
