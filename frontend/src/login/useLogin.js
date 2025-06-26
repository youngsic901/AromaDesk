import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginAPI } from '../api/loginApi.js';
import { login as loginAction, logout as logoutAction } from '../app/slices/userSlice.js';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  // 로그인 함수
  const login = useCallback(async (memberId, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loginAPI.login(memberId, password);
      
      if (result.success) {
        // 백엔드에서 세션에 CusUser로 저장하고 Member 엔티티를 반환
        const userData = result.data;
        setUser(userData);
        
        // Redux 스토어에 로그인 상태 저장
        dispatch(loginAction(userData));
        
        // localStorage에도 CusUser 키로 저장 (마이페이지에서 사용)
        localStorage.setItem('CusUser', JSON.stringify(userData));
        
        console.log('로그인 성공:', userData);
        return { success: true, data: userData };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // 로그아웃 함수
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loginAPI.logout();
      
      if (result.success) {
        setUser(null);
        // Redux 스토어에서 로그아웃 상태 저장
        dispatch(logoutAction());
        // localStorage에서도 CusUser 정보 삭제
        localStorage.removeItem('CusUser');
        console.log('로그아웃 성공');
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = '로그아웃 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // 사용자 정보 조회 (세션에서 확인)
  const getUserInfo = useCallback(async () => {
    try {
      const result = await loginAPI.getUserInfo();
      
      if (result.success) {
        setUser(result.data);
        // Redux 스토어에 사용자 정보 저장
        dispatch(loginAction(result.data));
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = '사용자 정보 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    getUserInfo,
    clearError
  };
}; 