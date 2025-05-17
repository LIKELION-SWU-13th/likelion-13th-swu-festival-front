import React, { useState } from 'react';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import './FoodTruckSection.css';

const TRUCKS = {
  1: {
    label: '타코타코',
    menu: [
      { name: '오사카식 타코야끼',        price: '4,800원' },
      { name: '불닭 타코야끼',            price: '5,000원' },
      { name: '치즈 폭탄 타코야끼',        price: '5,600원' },
      { name: '네기 타코야끼',            price: '4,500원' },
    ],
  },
  2: {
    label: '버거 바이츠',
    menu: [
      { name: '브리스켓 버거',            price: '6,000원' },
      { name: '소시지 핫도그',            price: '4,500원' },
      { name: '감자튀김',                price: '3,000원' },
    ],
  },
  3: {
    label: '순대야 놀자',
    menu: [
      { name: '수제 냉동 순대볶음',        price: '5,500원' },
      { name: '떡볶이 컵',               price: '3,200원' },
    ],
  },
  4: {
    label: '치즈팡팡',
    menu: [
      { name: '모짜렐라 치즈스틱',        price: '4,200원' },
      { name: '허니버터 감자칩',          price: '2,800원' },
    ],
  },
  5: {
    label: '그린연어 덮밥',
    menu: [
      { name: '아보카도 연어 덮밥',        price: '7,500원' },
      { name: '연어 샐러드',             price: '6,800원' },
    ],
  },
  6: {
    label: '그린연어 덮밥',
    menu: [
      { name: '아보카도 연어 덮밥',        price: '7,500원' },
      { name: '연어 샐러드',             price: '6,800원' },
    ],
  },
  7: {
    label: '그린연어 덮밥',
    menu: [
      { name: '아보카도 연어 덮밥',        price: '7,500원' },
      { name: '연어 샐러드',             price: '6,800원' },
    ],
  },
  8: {
    label: '그린연어 덮밥',
    menu: [
      { name: '아보카도 연어 덮밥',        price: '7,500원' },
      { name: '연어 샐러드',             price: '6,800원' },
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
