import React, { useState, useEffect } from "react";
import { getProducts } from "../api/productApi";

const ProductListPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log("API로부터 받은 데이터:", data);
        setPageData(data);
      } catch (err) {
        setError("상품 목록을 불러올 수 없습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  const products =
    pageData && Array.isArray(pageData.content) ? pageData.content : [];

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
