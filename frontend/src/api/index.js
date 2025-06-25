import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost", // 백엔드 서버가 80 포트에서 실행 중이므로1
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
