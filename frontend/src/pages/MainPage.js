import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import FilterBar from '../components/FilterBar';
import { productApi } from '../api';
import { authManager } from '../api/authApi';
import { fetchFilteredProducts } from '../app/slices/productSlice';
import { fetchCartItems } from '../app/slices/cartSlice';

const MainPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector(
    (state) => state.product
  );
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastResponseSize, setLastResponseSize] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [filters, setFilters] = useState({
    brand: '',
    volume: '',
    gender: '',
    price: ''
  });
  
  const navigate = useNavigate();

  // 초기 로드
  useEffect(() => {
    const initializePage = async () => {
      // 상품 데이터 로드
      dispatch(
        fetchFilteredProducts({
          page: 1,
          size: 20, // 한 번에 20개씩 로드
        })
      );

      // 로그인한 사용자의 경우에만 장바구니 데이터 로드
      if (isLoggedIn && user && (user.memberId || user.id)) {
        const userId = user.memberId || user.id;
        dispatch(fetchCartItems(userId));
      }
    };

    initializePage();
  }, [dispatch, isLoggedIn, user]);

  // 무한 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 스크롤이 하단 100px 전에 도달하면 다음 페이지 로드
    if (scrollTop + windowHeight >= documentHeight - 100) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      dispatch(
        fetchFilteredProducts({
          page: nextPage,
          size: 20,
          append: true, // 기존 상품에 추가
        })
      );
    }
  }, [loading, hasMore, currentPage, dispatch]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 더 많은 상품이 있는지 확인 (개선된 로직)
  useEffect(() => {
    if (pagination) {
      // 방법 1: totalPages 기반 확인
      if (pagination.totalPages !== undefined) {
        setHasMore(currentPage < pagination.totalPages);
      }
      // 방법 2: 총 상품 수와 현재 로드된 상품 수 비교
      else if (pagination.total !== undefined) {
        setHasMore(products.length < pagination.total);
      }
      // 방법 3: 마지막 응답 크기로 확인 (빈 배열이면 더 이상 없음)
      else if (lastResponseSize === 0 && currentPage > 1) {
        setHasMore(false);
      }
    }
  }, [pagination, currentPage, products.length, lastResponseSize]);

  // 응답된 상품 개수 추적
  useEffect(() => {
    if (products.length > 0) {
      const currentResponseSize = products.length - (currentPage - 1) * 20;
      setLastResponseSize(currentResponseSize);

      // 응답된 상품이 요청한 size보다 적으면 더 이상 없음
      if (currentResponseSize < 20 && currentPage > 1) {
        setHasMore(false);
      }
    }
  }, [products.length, currentPage]);

  // 사용자 정보 조회 (로그인된 경우에만)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserLoading(true);
        setUserError(null);
        
        // authManager를 통한 중앙 집중식 사용자 정보 조회
        const result = await authManager.getUserInfo();
        
        if (result.success) {
          setUserInfo(result.data);
        } else {
          setUserError(result.error || "사용자 정보를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        setUserError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setUserLoading(false);
      }
    };

    if (user && (user.memberId || user.id)) {
      fetchUserInfo();
    } else {
      setUserLoading(false);
    }
  }, [user]);

  // 필터 변경 핸들러
  const handleFilterChange = ({ type, value }) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleCartClick = () => {
    if (user && (user.memberId || user.id)) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const handleMyPageClick = () => {
    if (user && (user.memberId || user.id)) {
      navigate('/mypage');
    } else {
      navigate('/login');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <main className="flex-grow-1">
      {/* 메인 배너 */}
      <section
        className="main-hero-banner d-flex align-items-center justify-content-center mb-4"
        style={{
          minHeight: 220,
          borderRadius: 32,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          background: "linear-gradient(120deg, #7b2ff2 0%, #f357a8 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          margin: "32px 0 0 0",
        }}
      >
        <div className="container py-5">
          <h1
            className="display-3 fw-bold mb-2"
            style={{
              letterSpacing: 1.5,
              textShadow: "0 2px 16px rgba(123,47,242,0.12)",
              fontWeight: 800,
            }}
          >
            AromaDesk
          </h1>
          <p
            className="lead mb-0"
            style={{
              fontSize: 22,
              fontWeight: 500,
              textShadow: "0 1px 8px rgba(243,87,168,0.10)",
            }}
          >
            당신만의 특별한 향기를 찾아보세요
          </p>
          
          {/* 사용자 정보 표시 (로그인된 경우에만) */}
          {user && (user.memberId || user.id) && !userLoading && userInfo && (
            <div className="mt-3">
              <div className="alert alert-info d-inline-block mb-0" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}>
                <FaUser className="me-2" />
                안녕하세요, {userInfo.name}님! 환영합니다.
              </div>
            </div>
          )}
          
          {/* 사용자 정보 로딩 중 */}
          {user && (user.memberId || user.id) && userLoading && (
            <div className="mt-3">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">로딩 중...</span>
              </div>
              사용자 정보를 불러오는 중...
            </div>
          )}
          
          {/* 사용자 정보 오류 */}
          {user && (user.memberId || user.id) && userError && (
            <div className="mt-3">
              <div className="alert alert-warning d-inline-block mb-0" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}>
                {userError}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">
            전체 상품 ({pagination?.total || products.length}개)
          </h2>
          {hasMore && (
            <small className="text-muted">
              스크롤하여 더 많은 상품을 확인하세요
            </small>
          )}
        </div>
        
        {/* 필터 바 */}
        <div className="mb-4">
          <FilterBar 
            brand={filters.brand}
            volume={filters.volume}
            gender={filters.gender}
            price={filters.price}
            onChange={handleFilterChange}
          />
        </div>

        {error ? (
          <div className="alert alert-danger">
            <strong>오류가 발생했습니다:</strong> {error}
          </div>
        ) : (
          <div className="row g-4">
            {products.length === 0 && !loading ? (
              <div className="col-12 text-center text-muted py-5">
                <FaSearch size={48} className="mb-3" />
                <h4>상품을 찾을 수 없습니다</h4>
                <p>다른 검색 조건을 시도해보세요.</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  key={product.id}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        )}

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">로딩 중...</span>
            </div>
            <p className="mt-2">상품을 불러오는 중...</p>
          </div>
        )}

        {/* 더 이상 로드할 상품이 없을 때 */}
        {!hasMore && products.length > 0 && (
          <div className="text-center py-4">
            <p className="text-muted">모든 상품을 불러왔습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainPage;
