import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import ProductCard from "../components/common/ProductCard";
import Pagination from "../components/common/Pagination";

const SearchPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector(
    (state) => state.product
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      dispatch(fetchFilteredProducts({ name: query }));
    }
  }, [dispatch, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const handlePageChange = (page) => {
    dispatch(fetchFilteredProducts({ name: query, page }));
  };

  return (
    <main className="container py-5">
      {/* 검색 폼 */}
      <div className="mb-4">
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="향수 이름, 브랜드, 노트를 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary btn-lg" type="submit">
              검색
            </button>
          </div>
        </form>
      </div>

      {/* 검색 결과 */}
      {query && (
        <div className="mb-4">
          <h2 className="fw-bold">
            "{query}" 검색 결과
            {!loading && (
              <span className="text-muted fs-6 ms-2">
                ({pagination.total}개)
              </span>
            )}
          </h2>
        </div>
      )}

      {/* 상품 목록 */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">오류: {error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">검색 결과가 없습니다</h4>
          <p className="text-muted">다른 키워드로 검색해보세요.</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {products.map((product) => (
              <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {pagination.total > pagination.size && (
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.size)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </main>
  );
};

export default SearchPage;
