import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 장바구니 관련 API 함수들
export const cartApi = {
  // 장바구니 전체 조회
  getCartItems: async (memberId) => {
    try {
      const response = await apiClient.get(`/api/cart/${memberId}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 장바구니에 상품 추가 (중복 시 수량 증가)
  addToCart: async (memberId, productId, quantity) => {
    try {
      const response = await apiClient.post(`/api/members/${memberId}/cart`, {
        productId,
        quantity,
      });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 장바구니 상품 수량 변경 (수량 UI 연동)
  updateQuantity: async (memberId, productId, quantity) => {
    try {
      const response = await apiClient.put(
        `/api/members/${memberId}/cart/${productId}`,
        {
          quantity,
        }
      );
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 장바구니에서 상품 삭제
  removeFromCart: async (memberId, productId) => {
    try {
      const response = await apiClient.delete(
        `/api/members/${memberId}/cart/${productId}`
      );
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// 개별 함수로도 export (기존 코드 호환성)
export const getCartItems = cartApi.getCartItems;
export const addToCart = cartApi.addToCart;
export const updateQuantity = cartApi.updateQuantity;
export const removeFromCart = cartApi.removeFromCart;
