import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

export const adminLoginAPI = {
  // 관리자 로그인
  login: async (username, password) => {
    try {
      console.log('API 호출: 관리자 로그인 요청');
      console.log('요청 데이터:', { username, password });

      // POST /admin/login으로 관리자 로그인 요청
      const response = await apiClient.post('/admin/login', {
        username: username,
        password: password
      });

      console.log('백엔드 응답:', response.data);
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      console.error('관리자 로그인 API 에러:', error);
      const errorMessage = handleApiError(error).message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // 관리자 로그아웃
  logout: async () => {
    try {
      const response = await apiClient.post('/admin/logout');
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      const errorMessage = handleApiError(error).message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // 관리자 정보 조회
  getAdminInfo: async () => {
    try {
      // 로컬스토리지에서 관리자 정보 조회
      const adminInfo = localStorage.getItem('AdminUser');
      if (adminInfo) {
        return { success: true, data: JSON.parse(adminInfo) };
      } else {
        return { success: false, error: '로그인된 관리자 정보가 없습니다.' };
      }
    } catch (error) {
      const errorMessage = handleApiError(error).message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }
}; 