import React, { useState } from 'react';
import SliderModal from './SliderModal';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import './FleaMarketSection.css';

import img1_1 from '../images/1-1.png';
import img1_2 from '../images/1-2.png';
import img1_3 from '../images/1-3.png';
import img1_4 from '../images/1-4.png';

const MARKETS = {
  1: { label: '플리마켓 1', description: '수공예 상품과 빈티지 잡화를 만날 수 있는 공간입니다.' },
  2: { label: '플리마켓 2', description: '핸드메이드 액세서리 전문 셀러들이 모여 있어요.' },
  3: { label: '플리마켓 3', description: '도자기와 공예품을 직접 제작하는 부스입니다.' },
  4: { label: '플리마켓 4', description: '친환경 중고 물품을 교환·판매하는 부스입니다.' },
  5: { label: '플리마켓 5', description: '아트 프린트와 일러스트 소품을 만나보세요.' },
  6: { label: '플리마켓 6', description: '로컬 푸드와 음료를 즐길 수 있는 푸드 코너입니다.' },
  7: { label: '플리마켓 7', description: '빈티지 의류와 악세서리가 가득해요.' },
  8: { label: '플리마켓 8', description: '수제 향초와 비누, 뷰티 제품을 판매합니다.' },
};

const SELLERS = {
  1: { name: '셀러 이름 1', item: '키링', images: [img1_1, img1_2, img1_3, img1_4] },
  2: { name: '셀러 이름 2', item: '엽서', images: [img1_1, img1_2, img1_3, img1_4] },
  3: { name: '셀러 이름 3', item: '머리끈', images: [img1_1, img1_2, img1_3, img1_4] },
  4: { name: '셀러 이름 4', item: '키워드', images: [img1_1, img1_2, img1_3, img1_4] },
  5: { name: '셀러 이름 5', item: '아트 프린트', images: [img1_1, img1_2, img1_3, img1_4] },
  6: { name: '셀러 이름 6', item: '푸드 코너', images: [img1_1, img1_2, img1_3, img1_4] },
  7: { name: '셀러 이름 7', item: '빈티지 의류', images: [img1_1, img1_2, img1_3, img1_4] },
  8: { name: '셀러 이름 8', item: '뷰티 제품', images: [img1_1, img1_2, img1_3, img1_4] },
};

export default function FleaMarketSection() {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [slider, setSlider] = useState({ open: false, index: 0 });

  const handleClickBooth = num => {
    setSelectedBooth(prev => (prev === num ? null : num));
    setSlider({ open: false, index: 0 });
  };

  const openSlider = idx => setSlider({ open: true, index: idx });
  const closeSlider = () => setSlider({ open: false, index: 0 });

  return (
    <section className="flea-market-section">
      <div className="food-bar">푸드트럭</div>
      <div className="flea-row">
        {Object.keys(MARKETS).map(key => {
          const num = +key;
          return (
            <div
              key={num}
              className={`flea-cell ${num === selectedBooth ? 'active' : ''}`}
              onClick={() => handleClickBooth(num)}
            >
              <StarIcon className="flea-icon" />
              <span className="flea-label">{num}</span>
            </div>
          );
        })}
      </div>

      <div className="category-content">
        {selectedBooth == null ? (
          <>
            <div className="section-title">셀러 목록</div>
            <div className="seller-list">
              {Object.entries(SELLERS).map(([key, s]) => (
                <div key={key} className="seller-item">
                  <span className="seller-index">{key}</span>
                  <div className="seller-info">
                    <span className="seller-name">{s.name}</span>
                    <span className="seller-item-name">{s.item}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="section-title">셀러 목록</div>
            <div className="seller-item active-seller">
              <div className="seller-header">
                <span className="seller-index">{selectedBooth}</span>
                <span className="seller-name">{SELLERS[selectedBooth].name}</span>
              </div>
              <span className="seller-item-addname">
                {SELLERS[selectedBooth].item}
              </span>
            </div>
            <div className="section-subtitle">제품 이미지</div>
            <div className="product-images">
              {SELLERS[selectedBooth].images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${SELLERS[selectedBooth].item} ${i + 1}`}
                  onClick={() => openSlider(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {slider.open && (
        <SliderModal
          images={SELLERS[selectedBooth].images}
          initialIndex={slider.index}
          onClose={closeSlider}
        />
      )}
    </section>
  );
}