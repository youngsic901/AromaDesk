import apiClient from "../api/axiosConfig";

// 임시 파일임 백엔드 구성되면 삭제 예정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const socialLoginConfig = {
  google: {
    clientId: "dummy-client-id", // 실제 사용 안하니까 더미 값
    redirectUri: "http://localhost:3000", // 돌아올 주소 (임의)
    scope: "email profile"
  },
  kakao: {
    clientId: "your-kakao-client-id", // 실제 카카오 클라이언트 ID로 변경 필요
    redirectUri: "http://localhost:3000/auth/kakao/callback"
  }
};

export const socialLoginService = {
  // Google 로그인
  googleLogin: () => {
    const params = new URLSearchParams({
      client_id: socialLoginConfig.google.clientId,
      redirect_uri: socialLoginConfig.google.redirectUri,
      response_type: "code",
      scope: socialLoginConfig.google.scope
    });
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },

  // Kakao 로그인
  kakaoLogin: () => {
    const params = new URLSearchParams({
      client_id: socialLoginConfig.kakao.clientId,
      redirect_uri: socialLoginConfig.kakao.redirectUri,
      response_type: "code"
    });
    
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
  },

  // 소셜 로그인 콜백 처리
  handleSocialCallback: async (provider, code) => {
    try {
      const response = await apiClient.post(`/api/auth/${provider}/callback`, { code });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: `${provider} 로그인 처리 중 오류가 발생했습니다.` 
      };
    }
  }
}; 