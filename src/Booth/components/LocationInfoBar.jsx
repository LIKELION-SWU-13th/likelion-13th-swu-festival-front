// src/components/LocationInfoBar.jsx
import React, { useState, useEffect } from 'react';
import { ReactComponent as LocationIcon } from '../../assets/iconoir_map-pin.svg';
import { ReactComponent as MapViewIcon  } from '../../assets/Group.svg';
import { ReactComponent as CloseIcon    } from '../../assets/iconoir_xmark.svg';
import './LocationInfoBar.css';

export default function LocationInfoBar({
  activeCat,        // 새로 받은 prop
  placeName,
  mapImageUrl,
  highlightStyle
}) {
  const [showMap, setShowMap] = useState(false);

  // activeCat이 바뀔 때마다 지도를 자동으로 닫기
  useEffect(() => {
    setShowMap(false);
  }, [activeCat]);

  return (
    <div className="location-info-wrapper">
      <div className="location-info-bar">
        <span className="place-name">
          <LocationIcon className="icon location-icon" />
          {placeName}
        </span>
        {!showMap && (
          <button
            className="view-map-btn"
            onClick={() => setShowMap(true)}
          >
            <MapViewIcon className="icon view-map-icon" />
            위치보기
          </button>
        )}
      </div>

      {showMap && (
        <div className="map-container">
          <button
            className="close-on-image"
            onClick={() => setShowMap(false)}
          >
            <CloseIcon />
          </button>

          <img
            src={mapImageUrl}
            alt={`${placeName} 지도`}
            className="map-image"
          />

          <div
            className="map-highlight"
            style={highlightStyle}
          />
        </div>
      )}
    </div>
  );
}
