import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import BoothPage    from './Booth/pages/BoothPage';
import StarPage     from './Star/StarPage';      // 파일명 StarPage.jsx
import PerformPage  from './Perform/PerformPage';   // 파일명 PerformPage.jsx

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/booth" replace />} />
        <Route path="/zodiac" element={<StarPage />} />     
        <Route path="/booth"  element={<BoothPage />} />
        <Route path="/show"   element={<PerformPage />} />   
        <Route path="*" element={<Navigate to="/booth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
