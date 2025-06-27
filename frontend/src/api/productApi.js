import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 상품 관련 API 함수들
export const productApi = {
  // 필터링된 상품 목록 조회 (페이징 포함)
  getFilteredProducts: async (params = {}) => {
    try {
      const {
        brand,
        gender,
        volume,
        name,
        maxPrice,
        page = 1,
        size = 10,
      } = params;

      // 백엔드 API 엔드포인트와 파라미터 구조 맞춤
      const queryParams = {};
      if (brand) queryParams.brand = brand;
      if (gender) queryParams.gender = gender;
      if (volume) queryParams.volume = volume;
      if (page) queryParams.page = page;
      if (size) queryParams.size = size;

      const response = await apiClient.get("/api/products", {
        params: queryParams,
      });

      // 백엔드 응답 구조: { content: [], totalElements: number, page: number, size: number, totalPages: number }
      let result = handleApiSuccess(response);

      // 프론트엔드에서 추가 필터링 처리
      if (result.content) {
        let filteredContent = result.content;

        // name 검색 필터링
        if (name) {
          filteredContent = filteredContent.filter(
            (product) =>
              product.name.toLowerCase().includes(name.toLowerCase()) ||
              product.brand.toLowerCase().includes(name.toLowerCase())
          );
        }

        // 가격 필터링 (maxPrice)
        if (maxPrice) {
          filteredContent = filteredContent.filter(
            (product) => product.price <= parseInt(maxPrice)
          );
        }

        // 필터링된 결과로 업데이트
        result = {
          ...result,
          content: filteredContent,
          totalElements: filteredContent.length,
        };
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 상품 상세 조회
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/api/products/${productId}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 상품 생성 (관리자용)
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post("/api/products", productData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 상품 수정 (관리자용)
  updateProduct: async (productId, productData) => {
    try {
      const response = await apiClient.put(
        `/api/products/${productId}`,
        productData
      );
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 상품 삭제 (관리자용)
  deleteProduct: async (productId) => {
    try {
      const response = await apiClient.delete(`/api/products/${productId}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 단일 상품 주문 생성 (바로 구매)
   * @param {Object} orderData - { items: [{ productId, quantity }], deliveryId, paymentMethod }
   */
  createSingleOrder: async (orderData) => {
    try {
      const response = await apiClient.post("/api/orders/single", orderData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 장바구니 기반 주문 생성
   * @param {Object} orderData - { cartItemIds: number[], deliveryId: number, paymentMethod: string }
   */
  createOrderFromCart: async (orderData) => {
    try {
      const response = await apiClient.post("/api/orders/from-cart", orderData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// 개별 함수로도 export (기존 코드 호환성)
export const getFilteredProducts = productApi.getFilteredProducts;
export const getProductById = productApi.getProductById;
export const createProduct = productApi.createProduct;
export const updateProduct = productApi.updateProduct;
export const deleteProduct = productApi.deleteProduct;
export const createSingleOrder = productApi.createSingleOrder;
export const createOrderFromCart = productApi.createOrderFromCart;
