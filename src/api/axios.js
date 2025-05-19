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

// 토큰 갱신을 위한 전역 상태
let isRefreshingToken = false;
let failedQueue = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// 리프레시 토큰으로 새 액세스 토큰 가져오기
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다');
  }
  
  try {
    // 로그인 시간을 확인하여 3분이 지났으면 완전히 새 로그인 시도 (더 빠르게 설정)
    const loginTime = localStorage.getItem('login_time');
    const now = new Date().getTime();
    const elapsed = loginTime ? now - parseInt(loginTime) : 0;
    
    // 3분이 지났으면 새 로그인 시도 (타이밍을 더 앞당김)
    if (loginTime && elapsed > 180000) { // 3분 = 180,000 밀리초
      // 현재 저장된 사용자 정보로 새 로그인 시도
      const studentNum = localStorage.getItem('student_num');
      const name = localStorage.getItem('name');
      const major = localStorage.getItem('major');
      
      if (studentNum && name && major) {
        try {
          // 직접 axios 호출로 변경 (instance 대신 axios 사용)
          const response = await axios.post('https://api.likelion13th-swu.site/user/login', {
            student_num: studentNum,
            name: name,
            major: major
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (response.status === 200 && response.data) {
            const { access_token, refresh_token } = response.data;
            
            if (!access_token || !refresh_token) {
              throw new Error('토큰이 없습니다');
            }
            
            // 토큰 저장
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('login_time', new Date().getTime().toString());
            
            // 세션 스토리지에도 저장
            sessionStorage.setItem('access_token', access_token);
            sessionStorage.setItem('refresh_token', refresh_token);
            sessionStorage.setItem('auth_checked', 'true');
            localStorage.setItem('auth_forced', 'true');
            
            // 인증 상태 변경 알림
            window.dispatchEvent(new Event('auth-change'));
            
            return { 
              accessToken: access_token, 
              refreshToken: refresh_token 
            };
          } else {
            throw new Error('로그인 실패');
          }
        } catch (error) {
          // 새 로그인 실패시 일반 갱신으로 계속 진행
        }
      }
    }
    
    // 일반 토큰 갱신 프로세스
    const response = await axios({
      method: 'get',
      url: 'https://api.likelion13th-swu.site/user/refresh',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    if (!accessToken) {
      throw new Error('새 액세스 토큰이 없습니다');
    }
    
    // 토큰 저장
    localStorage.setItem('access_token', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    }
    
    // 인증 상태 변경 알림
    window.dispatchEvent(new Event('auth-change'));
    window.dispatchEvent(new Event('token-expired'));
    
    return { accessToken, refreshToken: newRefreshToken || refreshToken };
  } catch (error) {
    throw error;
  }
};

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

    // 토큰 관련 에러 (401, 403) 및 재시도하지 않은 요청인 경우
    if ((error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes('만료'))) && !originalRequest._retry) {
      if (isRefreshingToken) {
        // 이미 토큰 갱신 중이라면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshingToken = true;

      try {
        // refresh 토큰으로 새로운 access 토큰 발급
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          throw new Error('리프레시 토큰이 없습니다');
        }
        
        // 토큰 만료 확인
        const tokenData = JSON.parse(atob(refreshToken.split('.')[1]));
        const expirationTime = tokenData.exp * 1000;
        const now = new Date().getTime();
        
        if (now >= expirationTime) {
          throw new Error('리프레시 토큰이 만료되었습니다');
        }
        
        const { accessToken } = await refreshAccessToken(refreshToken);
        
        // 대기 중인 요청들 처리
        processQueue(null, accessToken);
        
        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (error) {
        // 실패한 큐 처리
        processQueue(error, null);
        
        // 사용자에게 알림 (선택적)
        window.dispatchEvent(new CustomEvent('auth-error', { 
          detail: { message: '인증이 만료되었습니다. 다시 로그인해주세요.' } 
        }));
        
        // 액세스 토큰 만료 시 로그아웃 처리
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_forced');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('auth_checked');
        
        // 현재 페이지가 인증이 필요한 페이지인 경우에만 리다이렉트
        const protectedRoutes = ['/booth', '/perform', '/constellation', '/quiz', '/coupon', '/artist'];
        const currentPath = window.location.pathname;
        
        if (protectedRoutes.some(route => currentPath.startsWith(route))) {
          window.location.href = '/signup';
        }
        
        return Promise.reject(error);
      } finally {
        isRefreshingToken = false;
      }
    }

    // 403 Forbidden 에러 처리
    if (error.response?.status === 403) {
      // 명시적으로 토큰 만료 메시지가 포함된 경우 토큰 갱신 시도
      if (error.response?.data?.message?.includes('만료')) {
        const event = new Event('token-expired');
        window.dispatchEvent(event);
      }
      
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
      clearTokens();
      return { 
        isAuthenticated: false, 
        message: '리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.' 
      };
    }
    
    // 액세스 토큰이 없거나 만료된 경우 리프레시 시도
    if (!accessToken) {
      try {
        await refreshAccessToken(refreshToken);
        return { isAuthenticated: true };
      } catch (error) {
        console.error('인증 갱신 오류:', error);
        return { isAuthenticated: false, message: '토큰 갱신에 실패했습니다.' };
      }
    }

    return { isAuthenticated: true };
  } catch (error) {
    console.error('인증 확인 오류:', error);
    return { 
      isAuthenticated: false, 
      message: '인증 확인 중 오류가 발생했습니다'
    };
  }
};

/**
 * JWT 토큰의 만료 시간을 계산합니다.
 * 
 * 이 함수는 다음과 같은 상황에서 사용됩니다:
 * 1. 토큰 자동 갱신 기능 - 토큰이 만료되기 전에 미리 갱신하기 위한 타이밍 계산
 * 2. 클라이언트 측에서 토큰 유효성 빠른 확인 - 불필요한 API 요청 방지
 * 3. 사용자 세션 관리 - 세션 만료 알림이나 자동 로그아웃 구현 시 활용
 * 4. 디버깅 - 토큰 관련 이슈 발생 시 만료 시간 확인용
 * 
 * App.js 또는 다른 컴포넌트에서 토큰 만료 전에 갱신 타이머를 설정할 때 사용됩니다.
 * 
 * @param {string} token - 만료 시간을 계산할 JWT 토큰 (주로 액세스 토큰)
 * @returns {number|null} 토큰의 만료 시간 (밀리초 단위 타임스탬프) 또는 에러 발생 시 null
 */
export const getTokenExpiry = (token) => {
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.exp * 1000; // Unix 타임스탬프(초)를 JavaScript 타임스탬프(밀리초)로 변환
  } catch (error) {
    console.error('토큰 만료 시간 계산 오류:', error);
    return null;
  }
};

// 토큰 클리어
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_forced');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('auth_checked');
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
    
    // 로그인 시간 저장 - 세션 갱신 타이밍에 사용
    localStorage.setItem('login_time', new Date().getTime().toString());
    
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
    
    // 사용자 정보 저장 - 세션 갱신에 사용
    localStorage.setItem('student_num', userInfo.student_num);
    localStorage.setItem('name', userInfo.name);
    localStorage.setItem('major', userInfo.major);
    
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