import apiClient from "./index";

export const loginAPI = {
  // 일반 로그인123
  login: async (memberId, password) => {
    try {
      console.log('API 호출: 로그인 요청');
      console.log('요청 데이터:', { memberId, password });

      const response = await apiClient.post('/api/members/login', { memberId, password });

      console.log('백엔드 응답:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('로그인 API 에러:', error);
      console.error('에러 응답:', error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data || error.message || '로그인 중 오류가 발생했습니다.' 
      };
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const response = await apiClient.post('/api/members/logout');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || '로그아웃 중 오류가 발생했습니다.' 
      };
    }
  },

  // 사용자 정보 조회
  getUserInfo: async () => {
    try {
      const response = await apiClient.get('/api/user/info');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || '사용자 정보 조회 중 오류가 발생했습니다.' 
      };
    }
  }
}; 