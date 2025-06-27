import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

export const loginAPI = {
  // 일반 로그인
  login: async (memberId, password) => {
    try {
      console.log('API 호출: 로그인 요청');
      console.log('요청 데이터:', { memberId, password });

      // POST /api/members/login으로 로그인 요청
      const response = await apiClient.post('/api/members/login', {
        memberId: memberId,
        password: password
      });

      console.log('백엔드 응답:', response.data);
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      console.error('로그인 API 에러:', error);
      const errorMessage = handleApiError(error).message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const response = await apiClient.post('/api/members/logout');
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      const errorMessage = handleApiError(error).message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // 사용자 정보 조회 (백엔드 세션 확인)
  getUserInfo: async () => {
    try {
      console.log('=== getUserInfo API 호출 시작 ===');
      console.log('요청 URL:', '/api/members/me');
      console.log('withCredentials:', true);
      
      const response = await apiClient.get('/api/members/me');
      console.log('백엔드 응답 성공:', response);
      console.log('응답 데이터:', response.data);
      
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      console.log('=== getUserInfo API 오류 발생 ===');
      console.error('전체 오류 객체:', error);
      console.error('응답 상태:', error.response?.status);
      console.error('응답 데이터:', error.response?.data);
      console.error('요청 설정:', error.config);
      
      // 401 에러는 로그인되지 않은 상태이므로 에러로 처리하지 않음
      if (error.response?.status === 401) {
        console.log('401 에러: 로그인되지 않은 사용자');
        return { success: false, error: '로그인되지 않은 사용자입니다.' };
      }
      const errorMessage = handleApiError(error).message;
      console.log('기타 오류 메시지:', errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }
}; 