import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authManager } from '../../api/authApi';
import { login as loginAction, logout as logoutAction } from '../../app/slices/userSlice';

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, user: reduxUser } = useSelector((state) => state.user);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('=== ProtectedRoute 인증 확인 시작 ===');
        console.log('현재 Redux 상태 - isLoggedIn:', isLoggedIn);
        console.log('현재 Redux 상태 - user:', reduxUser);
        console.log('현재 경로:', location.pathname);
        
        // 1. 먼저 세션 상태 확인
        console.log('세션 상태 확인 중...');
        const sessionResult = await authManager.checkSession();
        
        if (!sessionResult.success) {
          console.log('세션 확인 실패:', sessionResult.error);
          dispatch(logoutAction());
          setIsAuthenticated(false);
          return;
        }
        
        if (!sessionResult.isValid) {
          console.log('세션이 유효하지 않음');
          dispatch(logoutAction());
          setIsAuthenticated(false);
          return;
        }
        
        console.log('세션 유효, 사용자 정보 조회 중...');
        
        // 2. 세션이 유효하면 사용자 정보 조회
        const result = await authManager.getUserInfo();
        console.log('authManager 결과:', result);
        
        if (result.success && result.data && result.data.id) {
          console.log('인증 성공, 사용자 정보:', result.data);
          // Redux 상태 동기화
          if (!isLoggedIn || !reduxUser || reduxUser.id !== result.data.id) {
            console.log('Redux 상태 업데이트');
            dispatch(loginAction(result.data));
          }
          setIsAuthenticated(true);
        } else {
          console.log('인증 실패:', result.error);
          // 인증 실패
          dispatch(logoutAction());
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('인증 확인 실패:', error);
        dispatch(logoutAction());
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [dispatch, isLoggedIn, reduxUser, location.pathname]);
  
  // 로딩 중이면 로딩 화면 표시
  if (isChecking) {
    console.log('ProtectedRoute: 로딩 중...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        인증 확인 중...
      </div>
    );
  }
  
  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    console.log('ProtectedRoute: 인증 실패, 로그인 페이지로 리다이렉트');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 인증된 경우 자식 컴포넌트 렌더링
  console.log('ProtectedRoute: 인증 성공, 페이지 렌더링');
  return children;
};

export default ProtectedRoute; 