import React, { useState, useEffect } from 'react';
import TopTabs from '../../components/TopTabs';
import BoothCategory from '../components/BoothCategory';
import LocationInfoBar from '../components/LocationInfoBar';
import DepartmentSection from '../components/DepartmentSection';
import FoodTruckSection from '../components/FoodTruckSection';
import FleaMarketSection from '../components/FleaMarketSection';
import PhotoBoothSection from '../components/PhotoBoothSection';
import './BoothPage.css';

// 카테고리 선택
const CATEGORIES = [
  { id: 'department', label: '학과 부스' },
  { id: 'food',       label: '푸드 트럭' },
  { id: 'flea',       label: '플리마켓' },
  { id: 'photo',      label: '포토부스' },
];

// 지도 위치 표시
const PLACE_NAMES = {
  department: '잔디광장',
  food:       '제1과학관 앞',
  flea:       '한샘길',
  photo:      '학생 누리관 앞',
};

// 지도 하이라이트
const HIGHLIGHT_AREAS = {
  department: { top: '12%', left: '8%',  width: '28%', height: '22%' },
  food:       { top: '18%', left: '60%', width: '20%', height: '12%' },
  flea:       { top: '42%', left: '32%', width: '25%', height: '18%' },
  photo:      { top: '65%', left: '20%', width: '20%', height: '15%' },
};

export default function BoothPage() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [showMap, setShowMap] = useState(false);

  // 카테고리 변경 시 지도 초기화
  useEffect(() => {
    setShowMap(false);
  }, [activeCat]);

  const placeName = PLACE_NAMES[activeCat];
  const highlightStyle = HIGHLIGHT_AREAS[activeCat];

  return (
    <div className="booth-page">
      <TopTabs />

      <BoothCategory
        categories={CATEGORIES}
        activeCategoryId={activeCat}
        onSelect={setActiveCat}
      />

      {/* 래퍼를 추가해서 바는 항상 렌더링, map-container만 오버레이 */}
      <div className="location-info-wrapper">
        <LocationInfoBar
          showMap={showMap}
          onToggleMap={() => setShowMap(v => !v)}
          placeName={placeName}
          mapImageUrl={require('../../assets/map.png')}
          highlightStyle={highlightStyle}
        />
      </div>

      {activeCat === 'department' && <DepartmentSection />}
      {activeCat === 'food'       && <FoodTruckSection />}
      {activeCat === 'flea'       && <FleaMarketSection />}
      {activeCat === 'photo'      && <PhotoBoothSection />}
    </div>
  );
}
