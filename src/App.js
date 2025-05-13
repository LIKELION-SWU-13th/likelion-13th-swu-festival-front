import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import BoothPage    from './Booth/pages/BoothPage';
import StarPage     from './Star/StarPage';      
import PerformPage  from './Perform/PerformPage';   

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/booth" replace />} />
        <Route path="/star" element={<StarPage />} />     
        <Route path="/booth"  element={<BoothPage />} />
        <Route path="/perform"   element={<PerformPage />} />   
        <Route path="*" element={<Navigate to="/booth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
