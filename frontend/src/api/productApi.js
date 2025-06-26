import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 상품 관련 API 함수들
export const productApi = {
  // 필터링된 상품 목록 조회 (페이징 포함)
  getFilteredProducts: async (params = {}) => {
    try {
      const { brand, gender, volume, page = 1, size = 10 } = params;

      const response = await apiClient.get("/api/products", {
        params: {
          brand,
          gender,
          volume,
          page,
          size,
        },
      });

      return handleApiSuccess(response);
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
};

// 개별 함수로도 export (기존 코드 호환성)
export const getFilteredProducts = productApi.getFilteredProducts;
export const getProductById = productApi.getProductById;
export const createProduct = productApi.createProduct;
export const updateProduct = productApi.updateProduct;
export const deleteProduct = productApi.deleteProduct;
