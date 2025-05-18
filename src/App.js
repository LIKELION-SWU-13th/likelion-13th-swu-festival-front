import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BoothPage from './Booth/pages/BoothPage';
import PerformPage from './Perform/pages/PerformPage';
import ArtistPage from './Perform/pages/ArtistPage';
import SongPage from './Perform/components/SongModal';
import Signup from './Signup/Signup';
import ConstellationPage from './Constellation/pages/ConstellationPage';
import QuizPage from './Constellation/pages/QuizPage';
import CouponPage from './Constellation/pages/CouponPage';

export default function App() {
  // 초기 상태는 localStorage에서 토큰이 있는지로 판단
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token') && !!localStorage.getItem('refresh_token')
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 스토리지 변경 이벤트 핸들러
    const handleStorageChange = () => {
      const hasTokens = !!localStorage.getItem('access_token') && !!localStorage.getItem('refresh_token');
      setIsAuthenticated(hasTokens);
    };

    // 스토리지 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트 리스너도 추가 (Confirmation에서 발생시킬 이벤트)
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  // isLoading이 true인 경우 로딩 UI 표시
  if (isLoading) {
    return <div className="loading">로딩 중입니다...</div>;
  }


  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 홈 경로를 별자리 페이지로 변경 */}
        <Route path="/" element={<Navigate to="/constellation" replace />} />
        
        {/* 인증이 필요한 라우트들 */}
        <Route path="/booth" element={isAuthenticated ? <BoothPage /> : <Navigate to="/signup" replace />} />
        <Route path="/perform" element={isAuthenticated ? <PerformPage /> : <Navigate to="/signup" replace />} />
        <Route path="/constellation" element={isAuthenticated ? <ConstellationPage /> : <Navigate to="/signup" replace />} />
        <Route path="/quiz/:quizId" element={isAuthenticated ? <QuizPage /> : <Navigate to="/signup" replace />} />
        <Route path="/coupon" element={<CouponPage />} />
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
