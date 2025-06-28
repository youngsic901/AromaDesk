// import axios from "axios";
// // axios 기본 설정
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:80";
// // axios 인스턴스 생성
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // CORS 쿠키 전송을 위해 필요
// });
// // 요청 인터셉터
// apiClient.interceptors.request.use(
//   (config) => {
//     // 토큰이 있으면 헤더에 추가
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log("API Request:", config.method?.toUpperCase(), config.url);
//     return config;
//   },
//   (error) => {
//     console.error("Request Error:", error);
//     return Promise.reject(error);
//   }
// );
// // 응답 인터셉터
// apiClient.interceptors.response.use(
//   (response) => {
//     console.log("API Response:", response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     console.error(
//       "Response Error:",
//       error.response?.status,
//       error.response?.data
//     );
//     // 401 에러 시 토큰 제거
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//     }
//     return Promise.reject(error);
//   }
// );
// export default apiClient;
/**
 * 25.06.28 SUSU  세션 기반 재 수정
 */
//axios.js
import axios from "axios";
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
    // 세션 기반이므로 Authorization 헤더는 사용하지 않음
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
    // 세션 기반이라서 401이 뜨면 로그인 페이지로 이동만 고려
    if (error.response?.status === 401) {
      console.warn("세션 만료 또는 인증되지 않음");
      // location.href = "/login"; // 필요 시 주석 해제
    }
    return Promise.reject(error);
  }
);
export default apiClient;