import axios from 'axios';

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: 'https://api.likelion13th-swu.site',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰이 필요한 요청에 자동으로 토큰 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 등의 에러 처리
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 에러 (401) 및 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh 토큰으로 새로운 access 토큰 발급
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('리프레시 토큰이 없습니다.');
        }

        const response = await instance.post('/user/refresh', null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });

        // /user/refresh API는 camelCase 응답 형식
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // 신규 액세스 토큰 저장
        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
        } else {
          throw new Error('새 액세스 토큰이 없습니다.');
        }
        
        // 신규 리프레시 토큰이 있는 경우 함께 저장
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        
        // 인증 상태 변경 알림
        window.dispatchEvent(new Event('auth-change'));

        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (error) {
        // refresh 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_forced');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('auth_checked');
        window.location.href = '/signup';
        return Promise.reject(error);
      }
    }

    // 403 Forbidden 에러 처리
    if (error.response.status === 403) {
      // 에러만 반환하고 리다이렉트는 하지 않음
      return Promise.reject(new Error('권한이 없거나 로그인이 필요합니다.'));
    }

    return Promise.reject(error);
  }
);

// 사용자 인증 상태 확인 (refresh 토큰 유효성 검사)
export const checkAuth = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      return { isAuthenticated: false, message: '리프레시 토큰이 없습니다.' };
    }

    // 리프레시 토큰의 만료 시간 확인
    const tokenData = JSON.parse(atob(refreshToken.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // 밀리초로 변환
    const now = new Date().getTime();

    // 현재 시간이 만료 시간보다 이후인 경우
    if (now >= expirationTime) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_forced');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('auth_checked');
      return { 
        isAuthenticated: false, 
        message: '리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.' 
      };
    }
    
    // 액세스 토큰이 없거나 만료된 경우 리프레시 시도
    if (!accessToken) {
      try {
        // 헤더에 리프레시 토큰을 포함하여 요청
        const response = await instance.post('/user/refresh', null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });
        
        // /user/refresh API는 camelCase 응답 형식
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        if (newAccessToken) {
          localStorage.setItem('access_token', newAccessToken);
          
          // 새 리프레시 토큰이 있으면 함께 저장
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
          }
          
          // 토큰 갱신 후 인증 상태 변경 이벤트 발생
          window.dispatchEvent(new Event('auth-change'));
        } else {
          return { isAuthenticated: false, message: '새 액세스 토큰이 없습니다.' };
        }
      } catch (error) {
        return { isAuthenticated: false, message: '토큰 갱신에 실패했습니다.' };
      }
    }

    return { isAuthenticated: true };
  } catch (error) {
    return { 
      isAuthenticated: false, 
      message: '인증 확인 중 오류가 발생했습니다'
    };
  }
};

// 로그인 처리 후 토큰 저장 및 인증 상태 변경 알림
export const handleLoginSuccess = (tokens) => {
  try {
    // 파라미터는 API 응답 형식 그대로 받을 수 있도록 함
    const accessToken = tokens.access_token || tokens.accessToken;
    const refreshToken = tokens.refresh_token || tokens.refreshToken;
    
    if (!accessToken || !refreshToken) {
      return false;
    }
    
    // 토큰 저장
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    
    // 인증 상태 저장
    localStorage.setItem('auth_forced', 'true');
    sessionStorage.setItem('auth_checked', 'true');
    
    // 인증 상태 변경 이벤트 발생
    window.dispatchEvent(new Event('auth-change'));
    return true;
  } catch (error) {
    console.error('로그인 처리 실패:', error);
    return false;
  }
};

// 로그인 함수
export const login = async (userInfo) => {
  try {
    const response = await instance.post('/user/login', userInfo);
    
    // /user/login API는 snake_case 응답 형식
    const { access_token, refresh_token } = response.data;
    
    if (!access_token || !refresh_token) {
      return { 
        success: false, 
        message: '로그인 응답에 토큰이 없습니다.' 
      };
    }
    
    // 토큰 저장 - API 응답 형식 그대로 사용
    const tokensSaved = handleLoginSuccess({ access_token, refresh_token });
    
    if (!tokensSaved) {
      return { 
        success: false, 
        message: '토큰 저장에 실패했습니다.' 
      };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || '로그인에 실패했습니다.' 
    };
  }
};

export default instance; 