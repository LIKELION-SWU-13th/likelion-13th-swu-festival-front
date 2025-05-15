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
  { id: 'photo',      label: '포토부스' },
];

const PLACE_NAMES = {
  department: '잔디광장',
  food:       '제1과학관 앞',
  flea:       '한샘길',
  photo:      '학생 누리관 앞',
};

const HIGHLIGHT_AREAS = {
  department: { top: '27%', left: '8%',  width: '28%', height: '22%' },
  food:       { top: '18%', left: '10%', width: '25%', height: '5%' },
  flea:       { top: '42%', left: '32%', width: '25%', height: '18%' },
  photo:      { top: '65%', left: '20%', width: '20%', height: '15%' },
};

export default function BoothPage() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [showMap, setShowMap]     = useState(false);

  useEffect(() => {
    setShowMap(false);
  }, [activeCat]);

  const placeName      = PLACE_NAMES[activeCat];
  const highlightStyle = HIGHLIGHT_AREAS[activeCat];

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
          highlightStyle={highlightStyle}
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
