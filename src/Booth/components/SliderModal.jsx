import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './SliderModal.css';

export default function SliderModal({ images, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const sliderRef = useRef(null);
  const [counterY, setCounterY] = useState(0);

  // 스크롤 시 슬라이드 인덱스 갱신
  const handleScroll = e => {
    const idx = Math.round(e.target.scrollLeft / e.target.clientWidth);
    setCurrent(idx);
  };

  // current 바뀔 때마다 이미지 위치 계산
  useEffect(() => {
    if (!sliderRef.current) return;
    const slideEl = sliderRef.current.children[current];
    if (!slideEl) return;
    const img = slideEl.querySelector('img');
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const modalRect = sliderRef.current.getBoundingClientRect();

    // 슬라이더 컨테이너 기준 Y 좌표
    const y = imgRect.bottom - modalRect.top + 24;
    setCounterY(y);
  }, [current]);

  // 초기 스크롤 위치 세팅
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.clientWidth * current,
        behavior: 'instant'
      });
    }
  }, [sliderRef, current]);

  // 모달을 #root에 포탈
  return ReactDOM.createPortal(
    <div className="slider-modal" onClick={onClose}>
      <button
        className="slider-close"
        onClick={e => { e.stopPropagation(); onClose(); }}
      >×</button>

      <div
        className="slider-container"
        ref={sliderRef}
        onScroll={handleScroll}
        onClick={e => e.stopPropagation()}
      >
        {images.map((src, i) => (
          <div key={i} className="slider-slide">
            <img src={src} alt={`slide-${i}`} className="slider-img" />
          </div>
        ))}
      </div>

      {/* 이미지 바로 밑 24px 위치에 절대 배치된 카운터 */}
      <div
        className="slider-counter"
        style={{ top: counterY, left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="counter-current">{current + 1}</span>/{images.length}
      </div>
    </div>,
    document.getElementById('root')
  );
}
