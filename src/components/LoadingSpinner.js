import React from 'react';
import './LoadingSpinner.css';
import spinner from '../assets/spinner.svg';

const LoadingSpinner = () => {
  return (
    <div className="signup-wrapper loading-wrapper">
      {/* 어두운 오버레이 필터 적용 */}
      <div className="loading-overlay" />

      {/* 메인 콘텐츠 영역 */}
      <div className="loading-content">

        <h2 className="qr-upload-title">⏳ 조금만 기다려주세요. </h2>
        
        <p className="qr-upload-description">
        현재 슈니들의 많은 관심으로<br />
        화면 로딩에 시간이 걸리고 있어요.<br />
        조금만 기다려주시면 금방 화면이 보일거예요!
        </p>

        {/*로딩 스피너 이미지 */}
        <img src={spinner} alt="로딩 중" className="loading-spinner-image" />
      </div>
    </div>
  );
};

export default LoadingSpinner;