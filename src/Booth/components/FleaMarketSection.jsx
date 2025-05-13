import React, { useState } from 'react';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import './FleaMarketSection.css';

const FleaMarketSection = () => {
  const [selectedMarket, setSelectedMarket] = useState(null);

  return (
    <>
      <div className="flea-layout">
        <div className="flea-row">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div 
              key={n} 
              className={`flea-cell ${selectedMarket === n ? 'selected' : ''}`}
              onClick={() => setSelectedMarket(n)}
            >
              <StarIcon className="flea-icon" />
              <span className="flea-label">{n}</span>
            </div>
          ))}ㄴ
        </div>
      </div>
      
      <div className="category-content">
        <h2>플리마켓</h2>
        <p>번호를 누르면 더 자세한 정보를 알 수 있어요!</p>
        
        {selectedMarket && (
          <div className="market-details">
            <h3>플리마켓 {selectedMarket}</h3>
            <p>선택하신 마켓 정보입니다.</p>
            {/* 추가 정보 표시 가능 */}
          </div>
        )}
      </div>
    </>
  );
};

export default FleaMarketSection;