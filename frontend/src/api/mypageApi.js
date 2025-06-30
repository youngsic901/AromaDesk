import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";
// 마이페이지 정보 조회
export const getMyPageInfo = async (userId) => {
  try {
    const response = await apiClient.get(`/api/members/${userId}`);
    return handleApiSuccess(response);
  } catch (error) {
    console.error("마이페이지 정보 조회 오류:", error);
    throw handleApiError(error);
  }
};
// 마이페이지 정보 수정
export const updateMyPageInfo = async (userId, updateData) => {
  try {
    const response = await apiClient.put(`/api/members/${userId}`, updateData);
    return { success: true, data: handleApiSuccess(response) };
  } catch (error) {
    console.error("마이페이지 정보 수정 오류:", error);
    const errorMessage = handleApiError(error).message;
    return {
      success: false,
      error: errorMessage
    };
  }
};
// 비밀번호 확인 (백엔드에 없는 기능이므로 클라이언트에서 처리)
export const checkPassword = async (userId, password) => {
  try {
    // 로컬스토리지에서 사용자 정보 조회
    const userInfo = localStorage.getItem('CusUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.password === password) {
        return { success: true, data: { isValid: true } };
      } else {
        return { success: false, error: "현재 비밀번호가 일치하지 않습니다." };
      }
    } else {
      return { success: false, error: "사용자 정보를 찾을 수 없습니다." };
    }
  } catch (error) {
    console.error("비밀번호 확인 오류:", error);
    const errorMessage = handleApiError(error).message;
    return {
      success: false,
      error: errorMessage
    };
  }
};
// 비밀번호 변경 (백엔드에 없는 기능이므로 클라이언트에서 처리)
export const changePassword = async (userId, newPassword) => {
  try {
    // 로컬스토리지에서 사용자 정보 조회 및 업데이트
    const userInfo = localStorage.getItem('CusUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      user.password = newPassword;
      localStorage.setItem("CusUser", JSON.stringify(user));
      return { success: true, data: { message: "비밀번호가 변경되었습니다." } };
    } else {
      return { success: false, error: '사용자 정보를 찾을 수 없습니다.' };
    }
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    const errorMessage = handleApiError(error).message;
    return {
      success: false,
      error: errorMessage
    };
  }
};