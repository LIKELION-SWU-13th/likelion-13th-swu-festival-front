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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh 토큰으로 새로운 access 토큰 발급
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await instance.post('/user/refresh', {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return instance(originalRequest);
      } catch (error) {
        // refresh 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// 사용자 인증 상태 확인 (refresh 토큰 유효성 검사)
export const checkAuth = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }
    
    const response = await instance.get('/user/auth', {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    });
    return { isAuthenticated: true, message: response.data };
  } catch (error) {
    if (error.response?.status === 401) {
      // 유효하지 않거나 만료된 리프레시 토큰
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { 
        isAuthenticated: false, 
        message: '유효하지 않거나 만료된 리프레시 토큰입니다',
        error
      };
    }
    return { 
      isAuthenticated: false, 
      message: '인증 확인 중 오류가 발생했습니다',
      error
    };
  }
};

export default instance; 