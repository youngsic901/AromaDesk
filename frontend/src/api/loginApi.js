import apiClient from "./index";

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
      return { success: true, data: response.data };
    } catch (error) {
      console.error('로그인 API 에러:', error);
      console.error('에러 응답:', error.response?.data);
      
      // 에러 객체에서 message 필드만 추출
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
      return { success: true, data: response.data };
    } catch (error) {
      // 에러 객체에서 message 필드만 추출
      let errorMessage = '로그아웃 중 오류가 발생했습니다.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // 사용자 정보 조회
  getUserInfo: async () => {
    try {
      // 로컬스토리지에서 사용자 정보 조회
      const userInfo = localStorage.getItem('CusUser');
      if (userInfo) {
        return { success: true, data: JSON.parse(userInfo) };
      } else {
        return { success: false, error: '로그인된 사용자 정보가 없습니다.' };
      }
    } catch (error) {
      // 에러 객체에서 message 필드만 추출
      let errorMessage = '사용자 정보 조회 중 오류가 발생했습니다.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }
}; 