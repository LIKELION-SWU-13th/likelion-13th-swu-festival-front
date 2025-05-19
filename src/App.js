import React, { useEffect, useState, useCallback } from 'react';
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
import { checkAuth, default as instance } from './api/axios';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  // 로그아웃 처리 함수를 먼저 정의
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
    }
    window.location.href = '/signup';
  }, [tokenRefreshTimer]);

  // 토큰 갱신 함수
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        handleLogout();
        return;
      }

      const response = await instance.post('/user/refresh', null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });

      // /user/refresh API는 camelCase 응답 형식
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      if (!accessToken) {
        handleLogout();
        return;
      }

      // 새로운 토큰 저장
      localStorage.setItem('access_token', accessToken);
      
      // 새 리프레시 토큰이 있으면 함께 저장
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }

      // 다음 갱신 타이머 설정
      const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // 밀리초로 변환
      const now = new Date().getTime();
      const timeUntilExpiry = expirationTime - now;
      
      // 만료 30초 전에 갱신
      const refreshTime = Math.max(timeUntilExpiry - 30000, 0);

      // 이전 타이머 제거
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }

      // 새로운 타이머 설정
      const timer = setTimeout(refreshToken, refreshTime);
      setTokenRefreshTimer(timer);

      // 인증 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('auth-change'));

      // 대기 중인 요청들 재시도
      if (pendingRequests.length > 0) {
        pendingRequests.forEach(request => {
          request.headers.Authorization = `Bearer ${accessToken}`;
          instance(request);
        });
        setPendingRequests([]);
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      handleLogout();
    }
  }, [tokenRefreshTimer, pendingRequests, handleLogout]);

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
          setIsLoading(false);
          return;
        }
        
        const { isAuthenticated: authStatus, message } = await checkAuth();
        
        if (authStatus) {
          // 인증된 경우 토큰 갱신 타이머 설정
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
            const expirationTime = tokenData.exp * 1000;
            const now = new Date().getTime();
            const timeUntilExpiry = expirationTime - now;
            
            // 만료 30초 전에 갱신
            const refreshTime = Math.max(timeUntilExpiry - 30000, 0);

            // 이전 타이머 제거
            if (tokenRefreshTimer) {
              clearTimeout(tokenRefreshTimer);
            }

            // 새로운 타이머 설정
            const timer = setTimeout(refreshToken, refreshTime);
            setTokenRefreshTimer(timer);
          }
        }
        
        setIsAuthenticated(authStatus);
      } catch (error) {
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
      refreshToken();
    };

    // 이벤트 리스너 등록
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('token-expired', handleTokenExpired);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('token-expired', handleTokenExpired);
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
    };
  }, [refreshToken, tokenRefreshTimer]);

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
