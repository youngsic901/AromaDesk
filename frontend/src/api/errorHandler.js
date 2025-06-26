// API 에러 처리 공통 함수
export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response) {
    // 서버에서 응답이 왔지만 에러 상태인 경우
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return new Error(data?.message || "잘못된 요청입니다.");
      case 401:
        return new Error("인증이 필요합니다.");
      case 403:
        return new Error("접근 권한이 없습니다.");
      case 404:
        return new Error("요청한 리소스를 찾을 수 없습니다.");
      case 500:
        return new Error("서버 오류가 발생했습니다.");
      default:
        return new Error(data?.message || "알 수 없는 오류가 발생했습니다.");
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    return new Error("서버에 연결할 수 없습니다.");
  } else {
    // 요청 자체를 보내지 못한 경우
    return new Error("네트워크 오류가 발생했습니다.");
  }
};

// 성공 응답 처리 공통 함수
export const handleApiSuccess = (response) => {
  return response.data;
};
