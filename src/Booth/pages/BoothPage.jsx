// src/pages/BoothPage.js
import React, { useState, useEffect } from 'react';
import TopTabs from '../../components/TopTabs';
import BoothCategory from '../components/BoothCategory';
import LocationInfoBar from '../components/LocationInfoBar';
import DepartmentSection from '../components/DepartmentSection';
import FoodTruckSection from '../components/FoodTruckSection';
import FleaMarketSection from '../components/FleaMarketSection';
import PhotoBoothSection from '../components/PhotoBoothSection';
import './BoothPage.css';

const CATEGORIES = [
  { id: 'department', label: '학과 부스' },
  { id: 'food',       label: '푸드 트럭' },
  { id: 'flea',       label: '플리마켓' },
  { id: 'photo',      label: '슈니네컷' },
];

const PLACE_NAMES = {
  department: '잔디광장',
  food:       '제1과학관 앞',
  flea:       '한샘길',
  photo:      '제2과학관-고명우기념관 사이 주차장',
};

const HIGHLIGHT_AREAS = {
  department: [
    { top: '27%', left: '8%',  width: '28%', height: '22%' }
  ],
  food: [
    {
      top: '15%',      // 세로 위치
      left: '6%',     // 가로 위치
      width: '25%',    // 너비
      height: '10%',   // 높이
      transform: 'rotate(5deg)',     // 살짝 기울이기
      borderRadius: '8px'             // 모서리 둥글게
    }
  ],
  flea: [
    {
      top: '40%',      // 세로 위치
      left: '20%',     // 가로 위치
      width: '25%',    // 너비
      height: '10%',   // 높이
      transform: 'rotate(95deg)',     // 살짝 기울이기
      borderRadius: '8px'             // 모서리 둥글게
    }
  ],
  photo: [
    { top: '6%',  left: '46%', width: '7%',  height: '10%' },
    { top: '20%', left: '2%', width: '7%',  height: '10%' }
  ],
};

export default function BoothPage() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setShowMap(false);
  }, [activeCat]);

  const placeName       = PLACE_NAMES[activeCat];
  const highlightStyles = HIGHLIGHT_AREAS[activeCat];

  return (
    <div className="booth-page">
      {/* 고정 헤더 */}
      <TopTabs />

      <BoothCategory
        categories={CATEGORIES}
        activeCategoryId={activeCat}
        onSelect={setActiveCat}
      />

      <div className="location-info-wrapper">
        <LocationInfoBar
          showMap={showMap}
          onToggleMap={() => setShowMap(v => !v)}
          placeName={placeName}
          mapImageUrl={require('../../assets/map.png')}
          highlightStyles={highlightStyles}
        />
      </div>

      {/* 이 영역만 스크롤 */}
      <div className="content-container">
        {activeCat === 'department' && <DepartmentSection />}
        {activeCat === 'food'       && <FoodTruckSection />}
        {activeCat === 'flea'       && <FleaMarketSection />}
        {activeCat === 'photo'      && <PhotoBoothSection />}
      </div>
    </div>
  );
}
