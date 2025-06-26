import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const Header = () => {
  const { totalQuantity } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          AromaDesk
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form
            className="d-flex mx-auto align-items-center"
            style={{ maxWidth: 400, minHeight: 48 }}
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/products");
            }}
          >
            <input
              className="form-control me-2"
              type="search"
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item me-3">
              <button
                className="btn position-relative"
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart size={20} />
                {totalQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button className="btn" onClick={() => navigate("/login")}>
                <FaUser size={20} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
