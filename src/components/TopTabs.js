import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TopTabs.css';

// svg
import zodiacIcon from '../assets/iconoir_planet.svg';
import boothIcon  from '../assets/icon-park-outline_booth.svg';
import showIcon   from '../assets/ph_microphone-stage.svg';

// 탭들 설정값
const TABS = [
  { id: 'constellation', label: '별별 취향',  iconSrc: zodiacIcon },
  { id: 'booth',  label: '부스 배치도', iconSrc: boothIcon  },
  { id: 'perform',   label: '공연 정보',   iconSrc: showIcon   },
];

export default function TopTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.replace('/', '') || 'booth';

  return (
    <div className="top-tabs">
      {TABS.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(`/${tab.id}`)}
          >
            <img
              src={tab.iconSrc}
              className="tab-icon"
              alt={tab.label}
            />
            
            {isActive && <span className="tab-label">{tab.label}</span>}
          </button>
        );
      })}
    </div>
  );
}