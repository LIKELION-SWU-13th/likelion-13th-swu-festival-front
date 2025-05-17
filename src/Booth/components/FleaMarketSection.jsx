// FleaMarketSection.jsx
import React, { useState } from 'react';
import SliderModal from './SliderModal';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import './FleaMarketSection.css';

import img1_1 from '../images/1-1.png';
import img1_2 from '../images/1-2.png';
import img1_3 from '../images/1-3.png';
import img1_4 from '../images/1-4.png';

const SELLERS = {
  1: { name: '담기:淡器',            item: '키링',       images: [img1_1, img1_2, img1_3, img1_4] },
  2: { name: '뜨개다방',             item: '엽서',       images: [img1_1, img1_2, img1_3, img1_4] },
  3: { name: '레이븐팩토리',         item: '머리끈',     images: [img1_1, img1_2, img1_3, img1_4] },
  4: { name: '라플레르',             item: '키워드',     images: [img1_1, img1_2, img1_3, img1_4] },
  5: { name: '소원상점',             item: '아트 프린트',images: [img1_1, img1_2, img1_3, img1_4] },
  6: { name: '뜨개슌 애옹상점',      item: '푸드 코너', images: [img1_1, img1_2, img1_3, img1_4] },
  7: { name: '플레인톤',             item: '빈티지 의류',images: [img1_1, img1_2, img1_3, img1_4] },
  8: { name: '체리쉬미앤유',         item: '뷰티 제품', images: [img1_1, img1_2, img1_3, img1_4] },
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
