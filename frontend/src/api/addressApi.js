import { handleApiError } from "./errorHandler";
import { authManager } from "./authApi";

// 현재 배송지 정보 조회 (authManager 사용)
export const getCurrentAddress = async () => {
  try {
    console.log('=== 배송지 조회 시작 ===');
    
    const result = await authManager.getUserInfo();
    
    if (result.success) {
      const userData = result.data;
      console.log('사용자 정보:', userData);
      
      return { 
        success: true, 
        data: { 
          address: userData.address || '',
          zipCode: userData.zipCode || '',
          addressDetail: userData.addressDetail || ''
        } 
      };
    } else {
      return { 
        success: false, 
        error: result.error 
      };
    }
  } catch (error) {
    console.error('배송지 조회 오류:', error);
    return { 
      success: false, 
      error: handleApiError(error).message 
    };
  }
};

// 배송지 수정 (authManager 사용)
export const updateAddress = async (addressData) => {
  try {
    console.log('=== 배송지 수정 시작 ===');
    console.log('새 배송지:', addressData);
    
    const result = await authManager.updateUserInfo(addressData);
    
    if (result.success) {
      console.log('배송지 수정 성공:', result.data);
      return { 
        success: true, 
        data: result.data 
      };
    } else {
      return { 
        success: false, 
        error: result.error 
      };
    }
  } catch (error) {
    console.error('배송지 수정 오류:', error);
    return { 
      success: false, 
      error: handleApiError(error).message 
    };
  }
}; 