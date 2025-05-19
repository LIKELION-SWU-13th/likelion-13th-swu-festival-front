import React, { useEffect, useState, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BoothPage from './Booth/pages/BoothPage';
import PerformPage from './Perform/pages/PerformPage';
import ArtistPage from './Perform/pages/ArtistPage';
import SongPage from './Perform/components/SongModal';
import Signup from './Signup/Signup';
import ConstellationPage from './Constellation/pages/ConstellationPage';
import QuizPage from './Constellation/pages/QuizPage';
import CouponPage from './Constellation/pages/CouponPage';
import QuizType from './Constellation/pages/QuizType'
import { checkAuth, getTokenExpiry } from './api/axios';
import axios from 'axios';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [reloginTimer, setReloginTimer] = useState(null); // 새 로그인 타이머 - 비활성화
  
  // 함수 참조를 저장하기 위한 ref 생성
  const refreshTokenRef = useRef(null);
  const handleLogoutRef = useRef(null);
  // const performReloginRef = useRef(null); // 재로그인 함수 ref - 비활성화

  // 로그아웃 처리 함수
  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_forced');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('auth_checked');
    setIsAuthenticated(false);
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
      setTokenRefreshTimer(null);
    }
    // if (reloginTimer) {
    //   clearTimeout(reloginTimer);
    //   setReloginTimer(null);
    // }
    window.location.href = '/signup';
  }, [/* tokenRefreshTimer 의존성 제거 */]);
  
  // 함수 참조 업데이트
  handleLogoutRef.current = handleLogout;

  // 완전히 새로운 로그인 수행 함수 - 비활성화
  /*
  const performRelogin = useCallback(async () => {
    console.log('완전히 새 로그인 시도 - App.js');
    
    try {
      const studentNum = localStorage.getItem('student_num');
      const name = localStorage.getItem('name');
      const major = localStorage.getItem('major');
      
      if (!studentNum || !name || !major) {
        console.error('저장된 사용자 정보 부족, 새 로그인 불가');
        return;
      }
      
      console.log('저장된 사용자 정보로 새 로그인 시도');
      
      const response = await axios.post('https://api.likelion13th-swu.site/user/login', {
        student_num: studentNum,
        name: name,
        major: major
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('새 로그인 응답:', response.status, response.data);
      
      if (response.status === 200 && response.data) {
        const { access_token, refresh_token } = response.data;
        
        if (!access_token || !refresh_token) {
          console.error('새 로그인 응답에 토큰이 없음');
          return;
        }
        
        // 토큰 저장
        console.log('새 토큰 저장');
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
        
        console.log('새 로그인 성공! 타이머 재설정');
        
        // 2분 30초 후에 다시 로그인하는 타이머 설정
        if (reloginTimer) {
          clearTimeout(reloginTimer);
        }
        
        const newTimer = setTimeout(() => {
          if (performReloginRef.current) {
            performReloginRef.current();
          }
        }, 150000); // 2분 30초 = 150,000ms
        
        setReloginTimer(newTimer);
      }
    } catch (error) {
      console.error('새 로그인 실패:', error.message, error.response?.data);
      
      // 30초 후 재시도
      setTimeout(() => {
        if (performReloginRef.current) {
          console.log('재로그인 재시도...');
          performReloginRef.current();
        }
      }, 30000);
    }
  }, [reloginTimer]);
  
  // 함수 참조 업데이트
  performReloginRef.current = performRelogin;
  */

  // 토큰 갱신 함수
  const refreshToken = useCallback(async () => {
    // 이미 갱신 중이라면 건너뛰기
    if (isRefreshing) return;
    
    try {
      // 갱신 상태 설정
      setIsRefreshing(true);
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        handleLogoutRef.current();
        return;
      }

      // 토큰 만료 확인
      const refreshTokenExpiry = getTokenExpiry(refreshToken);
      if (!refreshTokenExpiry) {
        handleLogoutRef.current();
        return;
      }
      
      const currentTime = new Date().getTime();
      if (currentTime >= refreshTokenExpiry) {
        handleLogoutRef.current();
        return;
      }

      // 백엔드 토큰 갱신 요청 시도
      let response = null;
      
      try {
        response = await axios({
          method: 'get',
          url: 'https://api.likelion13th-swu.site/user/refresh',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        throw err;
      }

      if (!response) {
        throw new Error('토큰 갱신 응답이 없습니다.');
      }

      // /user/refresh API는 camelCase 응답 형식
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      if (!accessToken) {
        handleLogoutRef.current();
        return;
      }

      // 새로운 토큰 저장
      localStorage.setItem('access_token', accessToken);
      
      // 새 리프레시 토큰이 있으면 함께 저장
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }

      // 다음 갱신 타이머 설정
      const accessTokenExpiry = getTokenExpiry(accessToken);
      const nowTime = new Date().getTime();
      const timeUntilExpiry = accessTokenExpiry - nowTime;
      
      // 액세스 토큰 만료 30초 전에 갱신 시도
      const refreshTime = Math.max(timeUntilExpiry - 30000, 10000);

      // 이전 타이머 제거
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }

      // 새로운 타이머 설정
      const timer = setTimeout(() => {
        if (refreshTokenRef.current) {
          refreshTokenRef.current();
        }
      }, refreshTime);
      setTokenRefreshTimer(timer);

      // 인증 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('auth-change'));
      
      // 인증 상태 업데이트
      setIsAuthenticated(true);
      
    } catch (error) {
      // 인증 실패 시 로그아웃
      handleLogoutRef.current();
    } finally {
      setIsRefreshing(false);
    }
  }, []);
  
  // 함수 참조 업데이트
  refreshTokenRef.current = refreshToken;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // 강제 인증 플래그 확인 - Success 페이지에서 설정됨
        const forcedAuth = localStorage.getItem('auth_forced');
        const authChecked = sessionStorage.getItem('auth_checked');
        
        // 강제 인증된 경우나 이미 인증된 상태로 별자리 페이지 접근 시
        if ((forcedAuth === 'true' || authChecked === 'true') && 
            (window.location.pathname === '/constellation' || window.location.pathname === '/')) {
          setIsAuthenticated(true);
          
          // 토큰 갱신 타이머 설정
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            try {
              const expirationTime = getTokenExpiry(accessToken);
              const now = new Date().getTime();
              
              // 토큰이 곧 만료되거나 이미 만료된 경우
              if (expirationTime - now < 60000) {
                if (refreshTokenRef.current) {
                  refreshTokenRef.current(); // 즉시 갱신
                }
              } else {
                // 4분 만료 토큰이므로 1분 후(만료 시간의 75% 지점)에 갱신 시도 (최소 10초)
                const refreshTime = Math.max((expirationTime - now) * 0.25, 10000);
                
                // 이전 타이머 제거
                if (tokenRefreshTimer) {
                  clearTimeout(tokenRefreshTimer);
                }
                
                // 새로운 타이머 설정
                const timer = setTimeout(() => {
                  if (refreshTokenRef.current) {
                    refreshTokenRef.current();
                  }
                }, refreshTime);
                setTokenRefreshTimer(timer);
              }
            } catch (err) {
              if (refreshTokenRef.current) {
                refreshTokenRef.current(); // 오류 발생 시 즉시 갱신 시도
              }
            }
          }
          
          setIsLoading(false);
          return;
        }
        
        const { isAuthenticated: authStatus } = await checkAuth();
        
        if (authStatus) {
          // 인증된 경우 토큰 갱신 타이머 설정
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            try {
              const expirationTime = getTokenExpiry(accessToken);
              const now = new Date().getTime();
              
              // 토큰이 곧 만료되거나 이미 만료된 경우
              if (expirationTime - now < 60000) {
                if (refreshTokenRef.current) {
                  refreshTokenRef.current(); // 즉시 갱신
                }
              } else {
                // 4분 만료 토큰이므로 1분 후(만료 시간의 75% 지점)에 갱신 시도 (최소 10초)
                const refreshTime = Math.max((expirationTime - now) * 0.25, 10000);
                
                // 이전 타이머 제거
                if (tokenRefreshTimer) {
                  clearTimeout(tokenRefreshTimer);
                }
                
                // 새로운 타이머 설정
                const timer = setTimeout(() => {
                  if (refreshTokenRef.current) {
                    refreshTokenRef.current();
                  }
                }, refreshTime);
                setTokenRefreshTimer(timer);
              }
            } catch (err) {
              if (refreshTokenRef.current) {
                refreshTokenRef.current(); // 오류 발생 시 즉시 갱신 시도
              }
            }
          }
        }
        
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error('인증 확인 오류:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // 초기 인증 상태 확인
    verifyAuth();

    // 인증 상태 변경 이벤트 핸들러
    const handleAuthChange = () => {
      verifyAuth();
    };

    // 토큰 만료 이벤트 핸들러
    const handleTokenExpired = () => {
      if (refreshTokenRef.current) {
        refreshTokenRef.current();
      }
    };
    
    // 인증 오류 이벤트 핸들러
    const handleAuthError = (event) => {
      handleLogoutRef.current();
    };

    // 이벤트 리스너 등록
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('token-expired', handleTokenExpired);
    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('token-expired', handleTokenExpired);
      window.removeEventListener('auth-error', handleAuthError);
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
    };
  }, []);

  // 로딩 중일 때 로딩 UI 표시
  if (isLoading) {
    return <div className="loading">로딩 중입니다...</div>;
  }


  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 홈 경로를 별자리 페이지로 변경 */}
        <Route path="/" element={<Navigate to="/constellation" replace />} />
        
        {/* 로그인/회원가입 페이지 - 무조건 접근 가능 */}
        <Route path="/signup" element={<Signup />} />
        
        {/* 인증이 필요한 라우트들 */}
        <Route path="/booth" element={isAuthenticated ? <BoothPage /> : <Navigate to="/signup" replace />} />
        <Route path="/perform" element={isAuthenticated ? <PerformPage /> : <Navigate to="/signup" replace />} />
        <Route path="/constellation" element={isAuthenticated ? <ConstellationPage /> : <Navigate to="/signup" replace />} />
        <Route path="/quiz/:quizId" element={isAuthenticated ? <QuizPage /> : <Navigate to="/signup" replace />} />
        <Route path="/coupon" element={isAuthenticated ? <CouponPage /> : <Navigate to="/signup" replace />} />
        <Route path="/quiz/type" element={isAuthenticated ? <QuizType /> : <Navigate to="/signup" replace />} />
        <Route path="/artist/:artistId" element={isAuthenticated ? <ArtistPage /> : <Navigate to="/signup" replace />} />
        <Route path="/artist/:artistId/song/:songId" element={isAuthenticated ? <SongPage /> : <Navigate to="/signup" replace />} />
        
        {/* 로그인/회원가입 페이지 */}
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/constellation" replace />} />
        
        {/* 404 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

