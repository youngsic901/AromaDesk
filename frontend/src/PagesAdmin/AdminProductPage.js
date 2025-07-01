import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/layout/AdminLayout";
import { adminProductApi } from "../api/adminProductApi";
import { productApi } from "../api/productApi";
import "../css/AdminProductPage.css";
import Modal from "../components/common/Modal";
import { AdminProductEditModal, AdminSuccessModal } from "../components/admin/UnifiedAdminModal";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    genderCategory: "",
    volumeCategory: "",
    price: "",
    stock: "",
    imageUrl: "",
    description: "",
  });
  // 필터 상태
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [volume, setVolume] = useState("");
  const [keyword, setKeyword] = useState("");
  // 브랜드 목록 상태 (최초 1회만 받아옴)
  const [brandList, setBrandList] = useState([]);
  // 페이징 상태
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // 브랜드 목록 최초 1회만 받아오기
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await adminProductApi.getBrands();
        setBrandList(brands);
      } catch (err) {
        setBrandList([]);
      }
    };
    fetchBrands();
  }, []);

  // 상품 목록 조회 (필터+페이징)
  const fetchProducts = async (pageParam = page) => {
    try {
      setLoading(true);
      const params = {};
      if (brand) params.brand = brand;
      if (gender) params.gender = gender;
      if (volume) params.volume = volume;
      if (keyword) params.keyword = keyword;
      params.page = pageParam;
      params.size = size;
      const response = await adminProductApi.getProducts(params);
      setProducts(response.content || response);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error("상품 목록 조회 실패:", err);
      setError("상품 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1); // 필터 변경 시 1페이지로 이동
    setPage(1);
    // eslint-disable-next-line
  }, [brand, gender, volume, size]);

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line
  }, [page]);

  // 상품 생성
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await adminProductApi.createProduct(newProduct);
      setShowAddForm(false);
      setNewProduct({
        name: "",
        brand: "",
        genderCategory: "",
        volumeCategory: "",
        price: "",
        stock: "",
        imageUrl: "",
        description: "",
      });
      fetchProducts();
      setModalMessage("상품이 성공적으로 생성되었습니다.");
      setModalOpen(true);
    } catch (err) {
      setModalMessage("상품 생성에 실패했습니다.");
      setModalOpen(true);
    }
  };

  // 상품 수정
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await adminProductApi.updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
      await fetchProducts();
      setSuccessModalMessage("상품이 성공적으로 수정되었습니다.");
      setIsError(false);
      setSuccessModalOpen(true);
    } catch (err) {
      setSuccessModalMessage("상품 수정에 실패했습니다.");
      setIsError(true);
      setSuccessModalOpen(true);
    }
  };

  // 상품 삭제
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      try {
        await adminProductApi.deleteProduct(productId);
        fetchProducts();
        setModalMessage("상품이 성공적으로 삭제되었습니다.");
        setModalOpen(true);
      } catch (err) {
        setModalMessage("상품 삭제에 실패했습니다.");
        setModalOpen(true);
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>상품 관리</h1>
        {/* 필터 바 */}
        <div className="filter-bar">
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">브랜드 전체</option>
            {brandList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">성별 전체</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="UNISEX">중성</option>
          </select>
          <select value={volume} onChange={(e) => setVolume(e.target.value)}>
            <option value="">용량 전체</option>
            <option value="UNDER_30ML">30ml</option>
            <option value="UNDER_50ML">50ml</option>
            <option value="LARGE">대용량</option>
          </select>
          <input
            type="text"
            placeholder="상품명/설명 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ flex: 1 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                fetchProducts(1);
              }
            }}
          />
          <button onClick={() => fetchProducts(1)}>검색</button>
        </div>
        {/* 페이지네이션 */}
        <div className="pagination-bar">
          <span>총 {totalElements}개 | </span>
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
            이전
          </button>
          <span style={{ margin: "0 8px" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            다음
          </button>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={10}>10개씩</option>
            <option value={20}>20개씩</option>
            <option value={50}>50개씩</option>
          </select>
        </div>

        {/* 상품 추가 버튼 */}
        <button className="add-button" onClick={() => setShowAddForm(true)}>
          상품 추가
        </button>

        {/* 상품 추가 폼 */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>새 상품 추가</h2>
              <form onSubmit={handleCreateProduct}>
                <div className="form-group">
                  <label>상품명:</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>브랜드:</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, brand: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>성별 카테고리:</label>
                  <select
                    value={newProduct.genderCategory}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        genderCategory: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                    <option value="중성">중성</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>용량 카테고리:</label>
                  <select
                    value={newProduct.volumeCategory}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        volumeCategory: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="30ml">30ml</option>
                    <option value="50ml">50ml</option>
                    <option value="100ml">100ml</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>가격:</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>재고:</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>이미지 URL:</label>
                  <input
                    type="text"
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>설명:</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="button-group">
                  <button type="submit">추가</button>
                  <button type="button" onClick={() => setShowAddForm(false)}>
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 상품 목록 */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>상품명</th>
                <th>브랜드</th>
                <th>성별</th>
                <th>용량</th>
                <th>가격</th>
                <th>재고</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(products) ? products : []).map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.genderCategory}</td>
                  <td>{product.volumeCategory}</td>
                  <td>{product.price?.toLocaleString()}원</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      onClick={() => {
                        console.log("수정 버튼 클릭됨:", product);
                        setEditingProduct(product);
                      }}
                    >
                      수정
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 상품 수정 모달 */}
        {editingProduct && (
          <AdminProductEditModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSubmit={handleUpdateProduct}
            onChange={setEditingProduct}
          />
        )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          {modalMessage}
        </Modal>
        
        <AdminSuccessModal 
          open={successModalOpen} 
          onClose={() => setSuccessModalOpen(false)}
          message={successModalMessage}
          isError={isError}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProductPage;
