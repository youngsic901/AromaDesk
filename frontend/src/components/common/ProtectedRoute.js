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
        // authManager를 통한 중앙 집중식 사용자 정보 조회
        const result = await authManager.getUserInfo();
        
        if (result.success && result.data) {
          // Redux 상태 동기화
          if (!isLoggedIn || !reduxUser) {
            dispatch(loginAction(result.data));
          }
          setIsAuthenticated(true);
        } else {
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
  }, [dispatch, isLoggedIn, reduxUser]);
  
  // 로딩 중이면 로딩 화면 표시
  if (isChecking) {
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute; 