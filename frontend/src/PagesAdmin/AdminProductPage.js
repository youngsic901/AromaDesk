import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/layout/AdminLayout";
import { adminProductApi } from "../api/adminProductApi";
import { productApi } from "../api/productApi";
import "../css/AdminMemberPage.css";

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

  // 상품 목록 조회
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await adminProductApi.getProducts();
      setProducts(products);
      setError(null);
    } catch (err) {
      console.error("상품 목록 조회 실패:", err);
      setError("상품 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      alert("상품이 성공적으로 생성되었습니다.");
    } catch (err) {
      console.error("상품 생성 실패:", err);
      alert("상품 생성에 실패했습니다.");
    }
  };

  // 상품 수정
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    console.log("수정 시작:", editingProduct);
    try {
      const result = await adminProductApi.updateProduct(
        editingProduct.id,
        editingProduct
      );
      console.log("수정 성공:", result);
      setEditingProduct(null);
      await fetchProducts();
      alert("상품이 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("상품 수정 실패:", err);
      alert("상품 수정에 실패했습니다.");
    }
  };

  // 상품 삭제
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      try {
        await adminProductApi.deleteProduct(productId);
        fetchProducts();
        alert("상품이 성공적으로 삭제되었습니다.");
      } catch (err) {
        console.error("상품 삭제 실패:", err);
        alert("상품 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>상품 관리</h1>

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
          <div
            className="modal-overlay"
            onClick={() => setEditingProduct(null)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>상품 수정</h2>
              <form onSubmit={handleUpdateProduct}>
                <div className="form-group">
                  <label>상품명:</label>
                  <input
                    type="text"
                    value={editingProduct.name || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>브랜드:</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        brand: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>성별 카테고리:</label>
                  <select
                    value={editingProduct.genderCategory || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        genderCategory: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="UNISEX">중성</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>용량 카테고리:</label>
                  <select
                    value={editingProduct.volumeCategory || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        volumeCategory: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="UNDER_30ML">30ml</option>
                    <option value="UNDER_50ML">50ml</option>
                    <option value="LARGE">대용량</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>가격:</label>
                  <input
                    type="number"
                    value={editingProduct.price || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>재고:</label>
                  <input
                    type="number"
                    value={editingProduct.stock || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>이미지 URL:</label>
                  <input
                    type="text"
                    value={editingProduct.imageUrl || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        imageUrl: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>설명:</label>
                  <textarea
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="button-group">
                  <button type="submit">수정</button>
                  <button type="button" onClick={() => setEditingProduct(null)}>
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductPage;
