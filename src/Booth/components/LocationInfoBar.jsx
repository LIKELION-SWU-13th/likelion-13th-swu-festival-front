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
  return (
    <>
    
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

      {showMap && (
        <div className="map-container">
          <span className="map-place-label">
            <LocationIcon className="icon" />
            {placeName}
          </span>

          <button className="close-on-image" onClick={onToggleMap}>
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
    </>
  );
}
