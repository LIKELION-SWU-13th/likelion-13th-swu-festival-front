// FleaMarketSection.jsx
import React, { useState } from 'react';
import SliderModal from './SliderModal';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import './FleaMarketSection.css';

import img1_1 from '../images/sell1.jpg';
import img1_2 from '../images/sell2.jpg';
import img1_3 from '../images/sell3.png';
import img1_4 from '../images/sell4.png';
import img1_5 from '../images/sell5.png';
import img1_6 from '../images/sell6.png';
import img1_7 from '../images/sell7.png';
import img1_8 from '../images/sell8.png';

import ttega1 from '../images/ttega1.png';
import ttega2 from '../images/ttega2.png';
import ttega3 from '../images/ttega3.png';
import ttega4 from '../images/ttega4.png';
import ttega5 from '../images/ttega5.png';
import ttega6 from '../images/ttega6.png';
import ttega7 from '../images/ttega7.png';
import ttega8 from '../images/ttega8.png';
import ttega9 from '../images/ttega9.png';
import ttega10 from '../images/ttega10.png';
import ttega11 from '../images/ttega11.png';
import ttega12 from '../images/ttega12.png';
import ttega13 from '../images/ttega13.png';


const SELLERS = {
  1: { name: '담기:淡器',            item: '공예전공 학생들이 직접 만든 도자기',       images: [img1_1] },
  2: { name: '뜨개다방',             item: '뜨개를 위주로 만든 핸드메이드 소품, 비즈키링과 팔찌 만들기 체험',       images: [img1_2, ttega1, ttega2, ttega3, ttega4, ttega5, ttega6, ttega7, ttega8, ttega9,ttega10,ttega11,ttega12,ttega13] },
  3: { name: '레이븐팩토리',         item: '손수 만든 비즈팔찌와 키링',     images: [img1_3] },
  4: { name: '라플레르',             item: '생화, 원데이 클래스 체험',     images: [img1_4] },
  5: { name: '소원상점',             item: '레진으로 만든 클로버키링, 비즈키링, 행운부적 등',images: [img1_5] },
  6: { name: '뜨개슌 애옹상점',      item: '아기자기한 뜨개 소품, 야구선수 모루인형', images: [img1_6] },
  7: { name: '플레인톤',             item: '키링, 책갈피, 써지컬 액세서리 등',images: [img1_7] },
  8: { name: '체리쉬미앤유',         item: '귀여운 키링, 에어팟 케이스, 그립톡, 나만의 에어팟 케이스 만들기 체험', images: [img1_8] },
};

export default function FleaMarketSection() {
  const [selected, setSelected] = useState(null);
  const [slider, setSlider]     = useState({ open: false, index: 0 });

  const handleClick = (key) => {
    setSelected(prev => (prev === key ? null : key));
    setSlider({ open: false, index: 0 });
  };

  const openSlider  = (idx) => setSlider({ open: true, index: idx });
  const closeSlider = ()    => setSlider({ open: false, index: 0 });

  return (
    <section className="flea-market-section">
      <div className="flea-layout">
        <div className="location-block long">삼각숲</div>
        <div className="market-grids">
          <div className="market-grid">
            {Object.keys(SELLERS).map(n => (
              <div
                key={n}
                className={`flea-cell ${selected === Number(n) ? 'active' : ''}`}
                onClick={() => handleClick(Number(n))}
              >
                <StarIcon className="flea-icon" />
                <span className="flea-label">{n}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="location-block long bottom">한샘길</div>
      </div>

      <div className="category-content">
        <h2>셀러 목록</h2>

        <ul className="seller-list">
          {!selected
            ? Object.entries(SELLERS).map(([k, s]) => (
                <li
                  key={k}
                  className="seller-item"
                  onClick={() => handleClick(Number(k))}
                >
                  <div className="seller-summary">
                    <span className="seller-index">{k}</span>
                    <span className="seller-name">{s.name}</span>
                    <span className="seller-item-name">{s.item}</span>
                  </div>
                </li>
              ))
            : (
                <li
                  className="seller-item selected-summary"
                  onClick={() => handleClick(selected)}
                >
                  <div className="seller-summary">
                    <span className="seller-index">{selected}</span>
                    <span className="seller-name">{SELLERS[selected].name}</span>
                    <span className="seller-item-name">{SELLERS[selected].item}</span>
                  </div>
                </li>
              )
          }
        </ul>

        {selected && (
          <>
            <div className="section-subtitle">제품 이미지</div>
            <div className="product-images">
              {SELLERS[selected].images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${SELLERS[selected].item} ${i + 1}`}
                  onClick={() => openSlider(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {slider.open && selected && (
        <SliderModal
          images={SELLERS[selected].images}
          initialIndex={slider.index}
          onClose={closeSlider}
        />
      )}
    </section>
  );
}
