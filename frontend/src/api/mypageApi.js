import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";
import { authManager } from "./authApi";

// 마이페이지 정보 조회 (authManager 사용)
export const getMyPageInfo = async (userId) => {
  try {
    const result = await authManager.getUserInfo();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("마이페이지 정보 조회 오류:", error);
    throw handleApiError(error);
  }
};

// 마이페이지 정보 수정 (authManager 사용)
export const updateMyPageInfo = async (updateData) => {
  try {
    console.log("수정 요청 데이터:", updateData);
    const result = await authManager.updateUserInfo(updateData);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("마이페이지 정보 수정 오류:", error);
    const errorMessage = handleApiError(error).message;
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 비밀번호 확인 (클라이언트에서 처리)
export const checkPassword = async (userId, password) => {
  try {
    const userInfo = localStorage.getItem("CusUser");
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

    const userInfo = result.data;

    if (userInfo.password === password) {
      return { success: true, data: { isValid: true } };
    } else {
      return { success: false, error: "현재 비밀번호가 일치하지 않습니다." };
    }
  } catch (error) {
    console.error("비밀번호 확인 오류:", error);
    const errorMessage = handleApiError(error).message;
    return { success: false, error: errorMessage };
  }
};

// 비밀번호 변경 (클라이언트에서 처리)
export const changePassword = async (userId, newPassword) => {
  try {
    const userInfo = localStorage.getItem("CusUser");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      user.password = newPassword;
      localStorage.setItem("CusUser", JSON.stringify(user));
      return { success: true, data: { message: "비밀번호가 변경되었습니다." } };
    } else {
      return { success: false, error: updateResult.error };
    }
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    const errorMessage = handleApiError(error).message;
    return { success: false, error: errorMessage };
  }
};

// 로그인한 사용자의 주문 목록 조회
export const getMyOrders = async () => {
  try {
    const response = await apiClient.get("/api/orders");
    return handleApiSuccess(response);
  } catch (error) {
    console.error("주문 내역 조회 오류:", error);
    throw handleApiError(error);
  }
};
