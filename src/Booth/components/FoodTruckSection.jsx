import React, { useState } from 'react';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import './FoodTruckSection.css';

const TRUCKS = {
  1: {
    label: '닭강정',
    menu: [
      { name: '추후 업데이트될 예정입니다.',        price: '🦁' },
     
    ],
  },
  2: {
    label: '야끼소바',
    menu: [
      { name: '추후 업데이트될 예정입니다.',        price: '🦁' },
      
    ],
  },
  3: {
    label: '바베큐 닭꼬치',
    menu: [
      { name: '추후 업데이트될 예정입니다.',        price: '🦁' },
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
      { name: '추후 업데이트될 예정입니다.',        price: '🦁' },
    ],
  },
  6: {
    label: '콩고기덥밥',
    menu: [
      { name: '추후 업데이트될 예정입니다.',        price: '🦁' },
    ],
  },
  7: {
    label: '크레페',
    menu: [
      { name: '추후 업데이트될 예정입니다.',        price: '🦁' },
    ],
  },
  8: {
    label: '아이스크림+츄러스',
    menu: [
      { name: '추후 업데이트될 예정입니다.',        price: '🦁' },
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
