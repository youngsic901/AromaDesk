import apiClient from "./index";

// 마이페이지 정보 조회
export const getMyPageInfo = async (userId) => {
  try {
    const response = await apiClient.get(`/api/members/${userId}`);
    return response.data;
  } catch (error) {
    console.error('마이페이지 정보 조회 오류:', error);
    throw error;
  }
};

// 마이페이지 정보 수정
export const updateMyPageInfo = async (userId, updateData) => {
  try {
    const response = await apiClient.put(`/api/members/${userId}`, updateData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('마이페이지 정보 수정 오류:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || '수정에 실패했습니다.' 
    };
  }
};

// 비밀번호 확인
export const checkPassword = async (userId, password) => {
  try {
    const response = await apiClient.post(`/api/members/check-password/${userId}`, { password });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('비밀번호 확인 오류:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || '현재 비밀번호가 일치하지 않습니다.' 
    };
  }
};

// 비밀번호 변경
export const changePassword = async (userId, newPassword) => {
  try {
    const response = await apiClient.post(`/api/members/change-password/${userId}`, { newPassword });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || '비밀번호 변경에 실패했습니다.' 
    };
  }
}; 