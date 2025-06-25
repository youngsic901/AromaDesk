import apiClient from "./index";

// 회원가입 API 함수1
export const signUpAPI = async (signUpData) => {
  try {
    const response = await apiClient.post('/api/signup', signUpData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '회원가입에 실패했습니다.'
    };
  }
};

// 아이디 중복 확인 API
export const checkMemberIdAPI = async (memberId) => {
  try {
    const response = await apiClient.get(`/api/check-member-id?memberId=${memberId}`);
    return {
      success: true,
      isAvailable: response.data.isAvailable
    };
  } catch (error) {
    console.error('아이디 중복 확인 API 오류:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '아이디 확인에 실패했습니다.'
    };
  }
};

// 이메일 중복 확인 API
export const checkEmailAPI = async (email) => {
  try {
    const response = await apiClient.get(`/api/check-email?email=${email}`);
    return {
      success: true,
      isAvailable: response.data.isAvailable
    };
  } catch (error) {
    console.error('이메일 중복 확인 API 오류:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '이메일 확인에 실패했습니다.'
    };
  }
}; 