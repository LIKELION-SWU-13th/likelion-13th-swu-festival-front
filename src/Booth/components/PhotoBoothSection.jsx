import React, { useState } from 'react';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import './PhotoBoothSection.css';

const PhotoBoothSection = () => {
  const [selectedBooth, setSelectedBooth] = useState(null);

  return (
    <>
      <div className="photo-layout">
        <div className="photo-row">
          {[1, 2, 3, 4, 5].map(n => (
            <div 
              key={n} 
              className={`photo-cell ${selectedBooth === n ? 'selected' : ''}`}
              onClick={() => setSelectedBooth(n)}
            >
              <StarIcon className="photo-icon" />
              <span className="photo-label">{n}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="category-content">
        <h2>포토부스</h2>
        <p>번호를 누르면 더 자세한 정보를 알 수 있어요!</p>
        
        {selectedBooth && (
          <div className="photo-details">
            <h3>포토부스 {selectedBooth}</h3>
            <p>선택하신 포토부스 정보입니다.</p>
            {/* 추가 정보 표시 가능 */}
          </div>
        )}
      </div>
    </>
  );
};

export default PhotoBoothSection;