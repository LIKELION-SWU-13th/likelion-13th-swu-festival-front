import React from 'react';
import { ReactComponent as CardIcon } from '../../assets/Card.svg';
import { ReactComponent as LocationPin } from '../images/photo.svg';
import './PhotoBoothSection.css';

import img1_1 from '../images/1-1.png';
import img1_2 from '../images/1-2.png';
import img1_3 from '../images/1-3.png';
import img1_4 from '../images/1-4.png';

export default function PhotoBoothSection() {
  const frames = [img1_1, img1_2, img1_3, img1_4];

  return (
    <div className="photo-bottom">

      {/* 포토부스 위치 섹션 */}
      <section className="location-info">
        <div className="pin-wrapper">
          <LocationPin className="pin-icon" />
        </div>
      </section>

      {/* 이용 금액 및 결제 정보 */}
      <section className="usage-info">
        <h4>이용 금액</h4>
        <ul>
          <li>
            <span className="desc">2*6 사이즈 2장(1+1)</span>
            <span className="price">4,000원</span>
          </li>
          <li>
            <span className="desc">4*6 사이즈 2장(1+1)</span>
            <span className="price">5,000원</span>
          </li>
        </ul>
        <div className="payment">
          <CardIcon className="icon" />
          <span>결제</span>
          <span>카드, 현금, 계좌이체 가능</span>
        </div>
      </section>

      {/* 유의사항 */}
      <section className="notice">
        <h4>유의사항</h4>
        <p>
          소품 비치 예정 
          <span className="highlight">사용 후 제자리 정리 필수</span>
        </p>
      </section>

      {/* 프레임 이미지 */}
      <section className="frame-images">
        <h4>프레임 이미지</h4>
        <div className="thumbs">
          {frames.map((src, idx) => (
            <img key={idx} src={src} alt={`프레임${idx + 1}`} />
          ))}
        </div>
      </section>

    </div>
  );
}
