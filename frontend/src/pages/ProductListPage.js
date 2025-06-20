import React, { useState, useEffect } from "react";
import { getProducts } from "../api/productApi";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log("API로부터 받은 데이터:", data);
        console.log("데이터 타입:", typeof data);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("상품 목록을 불러올 수 없습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // []를 사용하여 컴포넌트가 처음 렌더링될 때 한 번만 실행

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h2>상품 목록</h2>
      {products.length === 0 ? (
        <p>상품이 없습니다.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - {product.price}원
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductListPage;
