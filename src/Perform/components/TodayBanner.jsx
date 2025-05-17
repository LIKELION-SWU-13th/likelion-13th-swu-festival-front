import React, { useRef, useState, useEffect } from 'react';
import './TodayBanner.css';
import { ReactComponent as ArcheryIcon } from '../../assets/iconoir_archery.svg';

export default function TodayBanner({ banners }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 스크롤될 때마다 activeIndex 계산
  const handleScroll = () => {
    const el = scrollRef.current;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.clientWidth * 0.8; // flex-basis: 80%
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const el = scrollRef.current;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="today-banner-container">
      <div className="banner-scroll" ref={scrollRef}>
        {banners.map((item, idx) => (
          <div key={idx} className="banner-card">
            <div className="banner-header">
              <ArcheryIcon className="banner-icon" />
              <h3 className="banner-title">{item.header}</h3>
            </div>
            <p className="banner-event">{item.event}</p>
            <p className="banner-time">{item.time}</p>
          </div>
        ))}
        
      </div>

      {/* pagination dots */}
      <div className="banner-pagination">
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`pagination-dot ${idx === activeIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
