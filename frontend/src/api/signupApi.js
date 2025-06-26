import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 회원가입 API 함수
export const signUpAPI = async (signUpData) => {
  try {
    const response = await apiClient.post('/api/members', signUpData);
    return {
      success: true,
      data: handleApiSuccess(response)
    };
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    const errorMessage = handleApiError(error).message;
    return {
      success: false,
      error: errorMessage
    };
  }
};

// 아이디 중복 확인 API (백엔드에 없는 기능이므로 클라이언트에서 처리)
export const checkMemberIdAPI = async (memberId) => {
  try {
    // 전체 회원 목록을 가져와서 클라이언트에서 중복 확인
    const response = await apiClient.get('/api/members');
    const members = handleApiSuccess(response);
    const isAvailable = !members.some(member => member.memberId === memberId);
    
    return {
      success: true,
      isAvailable: isAvailable
    };
  } catch (error) {
    console.error('아이디 중복 확인 API 오류:', error);
    const errorMessage = handleApiError(error).message;
    return {
      success: false,
      error: errorMessage
    };
  }
};

// 이메일 중복 확인 API (백엔드에 없는 기능이므로 클라이언트에서 처리)
export const checkEmailAPI = async (email) => {
  try {
    // 전체 회원 목록을 가져와서 클라이언트에서 중복 확인
    const response = await apiClient.get('/api/members');
    const members = handleApiSuccess(response);
    const isAvailable = !members.some(member => member.email === email);
    
    return {
      success: true,
      isAvailable: isAvailable
    };
  } catch (error) {
    console.error('이메일 중복 확인 API 오류:', error);
    const errorMessage = handleApiError(error).message;
    return {
      success: false,
      error: errorMessage
    };
  }
}; 