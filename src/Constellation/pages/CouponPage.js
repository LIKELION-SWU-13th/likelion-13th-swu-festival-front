import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CouponPage.css';

// 이미지 import
import couponImage from '../assets/coupon-image.png';
import iconBack from '../../Signup/assets/icon-back.svg';
import iconInstagram from '../assets/icon-instagram.svg';
import iconArrow from '../assets/icon-arrow-up-right.svg';
import buttonBg from '../../Signup/assets/button-bg.svg';

const CouponPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 인스타그램으로 이동
  const goToInstagram = () => {
    window.open('https://www.instagram.com/likelion_swu/', '_blank');
  };

  return (
    <div className="coupon-container">
      <div className="coupon-content">
        {/* 뒤로가기 버튼 */}
        <button className="constellation-coupon-back-button" onClick={() => navigate(-1)}>
          <img 
            src={iconBack} 
            alt="뒤로가기" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.textContent = '<';
            }}
          />
        </button>

        {/* 제목 */}
        <div className="coupon-title">
          <span className="emoji">🖼️</span> 이미지 저장 후 DM 보내기
        </div>

        {/* 안내 메시지 */}
        <p className="coupon-description">
          꾹 ~ 눌러 이미지 저장 후 '멋쟁이사자처럼 서울여대' <br />
          인스타그램 DM으로 보내주시면 실물 기프티콘으로<br />
          교환할 수 있어요!
        </p>

        {/* 쿠폰 이미지 (카드 없이 직접 이미지만) */}
        <img 
          src={couponImage} 
          alt="커피 교환권" 
          className="coupon-image"
          onContextMenu={(e) => e.preventDefault()} // 컨텍스트 메뉴 차단 해제 (모바일에서 필요)
        />

        {/* 인스타그램 바로가기 버튼 */}
        <button className="instagram-button" onClick={goToInstagram}>
          <img src={iconInstagram} alt="인스타그램" className="instagram-icon" />
          멋사 인스타그램 바로가기
          <img src={iconArrow} alt="화살표" className="arrow-icon" />
        </button>

        {/* 홈 화면 바로가기 버튼 */}
        <button 
          className="home-button" 
          onClick={() => navigate('/')}
          style={{ 
            backgroundImage: `url(${buttonBg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          홈 화면 바로가기
        </button>
      </div>
    </div>
  );
};

export default CouponPage;