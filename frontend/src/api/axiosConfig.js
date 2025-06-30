/**
 * 25.06.28 SUSU  세션 기반 재 수정
 */
//axios.js
import axios from "axios";
import store from '../app/store';
import { logout as logoutAction } from '../app/slices/userSlice';
import { authManager } from './authApi';
//API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:80";
//세션 기반 인증을 위한 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 세션 쿠키(JSESSIONID) 자동 포함
});
// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);
// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "Response Error:",
      error.response?.status,
      error.response?.data
    );
    
    // 스마트 401 처리: 세션 만료 API만 로그아웃 처리
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      
      // 세션 만료로 간주할 API들
      const sessionExpiredApis = [
        '/api/members/me',
        '/api/members/update'
      ];
      
      const isSessionExpired = sessionExpiredApis.some(api => url.includes(api));
      
      if (isSessionExpired) {
        console.log('세션 만료 감지, 로그아웃 처리');
        authManager.handleSessionExpired();
        store.dispatch(logoutAction());
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // 그 외 401은 단순히 에러만 반환 (로그아웃 처리하지 않음)
    }
    
    return Promise.reject(error);
  }
);
export default apiClient;
