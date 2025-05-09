import React, { useState, useEffect } from 'react';
import TopTabs from '../../components/TopTabs';
import BoothCategory from '../components/BoothCategory';
import LocationInfoBar from '../components/LocationInfoBar';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import map from '../../assets/map.png';
import './BoothPage.css';

const DEPARTMENT_LAYOUT = [
  { num: 4,  style: { top: '0%',  left: '5%'  } },
  { num: 5,  style: { top: '0%',  left: '25%' } },
  { num: 6,  style: { top: '0%',  left: '40%' } },
  { num: 7,  style: { top: '0%',  left: '55%' } },
  { num: 8,  style: { top: '0%',  left: '70%' } },
  { num: 9,  style: { top: '0%',  left: '90%' } },
  { num: 3,  style: { top: '20%', left: '5%'  } },
  { num: 13, style: { top: '30%', left: '25%' } },
  { num: 14, style: { top: '30%', left: '40%' } },
  { num: 15, style: { top: '30%', left: '55%' } },
  { num: 16, style: { top: '30%', left: '70%' } },
  { num: 10, style: { top: '20%', left: '90%' } },
  { num: 2,  style: { top: '40%', left: '5%'  } },
  { num: 11, style: { top: '40%', left: '90%' } },
  { num: 12, style: { top: '60%', left: '90%' } },
  { num: 1,  style: { top: '60%', left: '5%'  } },
  { num: 17, style: { top: '60%', left: '40%' } },
  { num: 18, style: { top: '60%', left: '55%' } },
];

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
  department: { top: '12%', left: '8%',  width: '28%', height: '22%' },
  food:       { top: '18%', left: '60%', width: '20%', height: '12%' },
  flea:       { top: '42%', left: '32%', width: '25%', height: '18%' },
  photo:      { top: '65%', left: '20%', width: '20%', height: '15%' },
};

const DEPARTMENT_LIST = [
  '디지털미디어학과', '미래산업융합대학', '산업디자인학과',
  '소프트웨어융합학과', '정보보호학과', '데이터사이언스학과',
  '경영학과', '국어국문학과', '신소재화학과', '미래산업융합대학',
  '산업디자인학과', '소프트웨어융합학과', '정보보호학과',
  '데이터사이언스학과', '경영학과', '국어국문학과',
  '화학과', '영문학과'
];

export default function BoothPage() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [showMap,   setShowMap]   = useState(false);

  useEffect(() => setShowMap(false), [activeCat]);

  const placeName      = PLACE_NAMES[activeCat];
  const highlightStyle = HIGHLIGHT_AREAS[activeCat];

  return (
    <div className="booth-page">
      <TopTabs />

      <BoothCategory
        categories={CATEGORIES}
        activeCategoryId={activeCat}
        onSelect={setActiveCat}
      />

      <LocationInfoBar
        showMap={showMap}
        onToggleMap={() => setShowMap(v => !v)}
        placeName={placeName}
        mapImageUrl={map}
        highlightStyle={highlightStyle}
      />

      {/* 학과 부스 절대 배치 */}
      {activeCat === 'department' && (
        <>
          <div className="dept-layout">
            {DEPARTMENT_LAYOUT.map(({ num, style }) => (
              <div
                key={num}
                className="booth-cell"
                style={{ position: 'absolute', ...style }}
              >
                <StarIcon className="booth-icon" />
                <span className="booth-label">{num}</span>
              </div>
            ))}
          </div>

          <h3 className="booth-list-title">부스 목록</h3>
          <div className="booth-list-container">
            <ul className="booth-list-col">
              {DEPARTMENT_LIST.slice(0, 9).map((name, idx) => (
                <li key={idx}>
                  <span className="booth-list-index">{idx + 1}.</span>
                  {name}
                </li>
              ))}
            </ul>
            <ul className="booth-list-col">
              {DEPARTMENT_LIST.slice(9).map((name, idx) => (
                <li key={idx + 9}>
                  <span className="booth-list-index">{idx + 10}.</span>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* 푸드 트럭 레이아웃 */}
      {activeCat === 'food' && (
        <>
          <div className="road-bar">제 1과학관</div>
          <div className="food-layout">
  <div className="food-row">
    {[1, 2, 3, 4, 5].map(n => (
      <div key={n} className="food-cell">
        <StarIcon className="food-icon" /> {/* 이 부분이 수정됨 */}
        <span className="food-label">{n}</span>
      </div>
    ))}
  </div>
</div>

          <div className="category-content">
            <h2>푸드 트럭</h2>
            <p>번호를 누르면 더 자세한 정보를 알 수 있어요!</p>
          </div>
        </>
      )}

      {/* 플리마켓/포토부스 */}
      {activeCat !== 'department' && activeCat !== 'food' && (
        <div className="category-content">
          {activeCat === 'flea' ? '플리마켓 정보 …' : '포토부스 정보 …'}
        </div>
      )}
    </div>
  );
}
