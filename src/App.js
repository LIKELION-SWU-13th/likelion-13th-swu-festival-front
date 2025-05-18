import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BoothPage from './Booth/pages/BoothPage';
import StarPage from './Star/StarPage';
import PerformPage from './Perform/pages/PerformPage';
import ArtistPage from './Perform/pages/ArtistPage';
import SongPage from './Perform/components/SongModal';
import Signup from './Signup/Signup';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/booth" replace />} />
        <Route path="/booth" element={<BoothPage />} />
        <Route path="/star" element={<StarPage />} />
        <Route path="/perform" element={<PerformPage />} />

        {/* 아티스트별 페이지 */}
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/artist/:artistId/song/:songId" element={<SongPage />} />

        <Route path="*" element={<Navigate to="/booth" replace />} />
        
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
