import React, { useState } from 'react';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import './FoodTruckSection.css';

const TRUCKS = {
  1: {
    label: '닭강정',
    menu: [
      { name: 'M 사이즈',        price: '11,000' },
      { name: 'L 사이즈',        price: '18,000' },
     
    ],
  },
  2: {
    label: '야끼소바',
    menu: [
      { name: '야끼소바',        price: '10,000' },
      
    ],
  },
  3: {
    label: '바베큐 닭꼬치',
    menu: [
      { name: '바베큐맛',        price: '5,000' },
      { name: '매운맛',        price: '5,000' },
      { name: '치즈맛',        price: '5,000' },
    ],
  },
  4: {
    label: '닭꼬치 OR 타코야끼',
    menu: [
      { name: '추후 업데이트될 예정입니다.',        price: '🦁' },
    ],
  },
  5: {
    label: '불초밥',
    menu: [
      { name: '불초밥 10P',        price: '11,000' },
      { name: '콩불고기 비건 메뉴',        price: '11,000' },
    ],
  },
  6: {
    label: '크레페',
    menu: [
      { name: '생크림 크레페',        price: '7,000' },
      { name: '아이스크림 크레페',        price: '8,000' },
    ],
  },
  7: {
    label: '아이스크림+츄러스',
    menu: [
      { name: '츄로스',        price: '4,000' },
      { name: '오레오 츄로스',        price: '4,000' },
      { name: '아이스크림',        price: '5,000' },
      { name: '오레오 아이스크림',        price: '6,000' },
      { name: '아츄',        price: '7,000' },
    ],
  },
};

const FoodTruckSection = () => {
  const [selectedTruck, setSelectedTruck] = useState(null);

  const handleClick = (key) => {
    setSelectedTruck(prev => prev === key ? null : key);
  };

  return (
    <>
      <div className="road-bar">제 1과학관</div>

      <div className="food-layout">
        <div className="food-row">
          {Object.keys(TRUCKS).map((key) => {
            const id = Number(key);
            return (
              <div
                key={key}
                className={`food-cell ${selectedTruck === id ? 'selected' : ''}`}
                onClick={() => handleClick(id)}
              >
                <StarIcon className="food-icon" />
                <span className="food-label">{key}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="category-content">
        <h2>푸드 트럭</h2>

        {!selectedTruck && (
          <p>번호를 누르면 더 자세한 정보를 알 수 있어요!</p>
        )}

        {selectedTruck && (
          <div className="truck-details">
            <h3>{TRUCKS[selectedTruck].label}</h3>
            {TRUCKS[selectedTruck].menu.map((item, idx) => (
              <div className="menu-item" key={idx}>
                <span className="menu-index">{idx + 1}</span>
                <span className="menu-name">{item.name}</span>
                <span className="menu-price">{item.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};


export default FoodTruckSection;
