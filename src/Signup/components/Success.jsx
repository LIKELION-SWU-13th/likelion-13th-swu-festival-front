import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Signup.css';

const Success = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    // 다음 페이지(별자리 메인)로 이동
    navigate('/constellation');
  };

  return (
    <div className="success-wrapper">
      <div className="success-box">
        {/* 완료 메시지 */}
        <h2 className="success-title">로그인 완료!</h2>

        {/* 설명 */}
        <p className="success-description">
          슈니의 정보가 인증 되었어요.<br />
          축제 사이트를 즐겨보러 갈까요?
        </p>

        {/* 다음으로 버튼 */}
        <button className="success-button" onClick={handleNext}>
          다음으로
        </button>
      </div>
    </div>
  );
};

export default Success;
