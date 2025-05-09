// src/components/LocationInfoBar.jsx
import React from 'react';
import { ReactComponent as LocationIcon } from '../../assets/iconoir_map-pin.svg';
import { ReactComponent as CloseIcon    } from '../../assets/iconoir_xmark.svg';
import { ReactComponent as MapViewIcon  } from '../../assets/Group.svg';
import './LocationInfoBar.css';

export default function LocationInfoBar({
  showMap,
  onToggleMap,
  placeName,
  mapImageUrl,
  highlightStyle
}) {
  // 1) 맵 닫힘 시: 기존 바(텍스트 + 위치보기 버튼)
  if (!showMap) {
    return (
      <div className="location-info-bar">
        <span className="place-name">
          <LocationIcon className="icon location-icon" />
          {placeName}
        </span>
        <button className="view-map-btn" onClick={onToggleMap}>
          <MapViewIcon className="icon view-map-icon" />
          위치보기
        </button>
      </div>
    );
  }

  // 2) 맵 열림 시: 지도 + 핀 레이블 + 닫기 버튼 + 하이라이트
  return (
    <div className="map-container">
      {/* 지도 위 placeName 레이블 */}
      <span className="map-place-label">
        <LocationIcon className="icon" />
        {placeName}
      </span>

      {/* 닫기 버튼 */}
      <button className="close-on-image" onClick={onToggleMap}>
        <CloseIcon />
      </button>

      {/* 실제 지도 이미지 */}
      <img
        src={mapImageUrl}
        alt={`${placeName} 지도`}
        className="map-image"
      />

      {/* 하이라이트 박스 */}
      <div
        className="map-highlight"
        style={highlightStyle}
      />
    </div>
  );
}
