// src/pages/BoothPage/BoothPage.jsx
import React, { useState } from 'react';
import TopTabs from '../../components/TopTabs';
import BoothCategory from '../components/BoothCategory';
import LocationInfoBar from '../components/LocationInfoBar';

import map from '../../assets/map.png';
import './BoothPage.css';

const CATEGORIES = [
  { id: 'department', label: '학과 부스' },
  { id: 'food',       label: '푸드 트럭' },
  { id: 'flea',       label: '플리마켓' },
  { id: 'photo',      label: '포토부스' },
];

/**  
 * 각 카테고리별로 map.png 위에 반투명 박스를 띄울 위치/크기를
 * % 단위로 정의합니다.  
 * → 실제 원하는 영역에 맞춰서 값(top/left/width/height)을 조절하세요.
 */
const HIGHLIGHT_AREAS = {
  department: { top: '12%', left: '8%',  width: '28%', height: '22%' },
  food:       { top: '18%', left: '60%', width: '20%', height: '12%' },
  flea:       { top: '42%', left: '32%', width: '25%', height: '18%' },
  photo:      { top: '65%', left: '20%', width: '20%', height: '15%' },
};

export default function BoothPage() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);

  const PLACE_NAMES = {
    department: '잔디광장',
    food:       '제1과학관 앞',
    flea:       '한샘길',
    photo:      '학생 누리관 앞',
  };
  const placeName = PLACE_NAMES[activeCat];
  const highlightStyle = HIGHLIGHT_AREAS[activeCat];

  const renderContent = () => {
    switch (activeCat) {
      case 'department':
        return <div className="category-content">학과 부스 정보 …</div>;
      case 'food':
        return <div className="category-content">푸드 트럭 정보 …</div>;
      case 'flea':
        return <div className="category-content">플리마켓 정보 …</div>;
      case 'photo':
        return <div className="category-content">포토부스 정보 …</div>;
      default:
        return null;
    }
  };

  return (
    <div className="booth-page">
      <TopTabs />

      <BoothCategory
        categories={CATEGORIES}
        activeCategoryId={activeCat}
        onSelect={setActiveCat}
      />

      {/* 지도 & 하이라이트 & 레이블 & 닫기 버튼을 전부 여기서 처리 */}
      <LocationInfoBar
        activeCat={activeCat}
        placeName={placeName}
        mapImageUrl={map}
        highlightStyle={highlightStyle}
      />

      {renderContent()}
    </div>
  );
}
