import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StarQuiz.css';

const StarQuiz = ({ quizId, isOpen, isCompleted, onComplete, isNext, quizData, starImages, hideTooltip }) => {
  const navigate = useNavigate();
  const [nextQuizTime, setNextQuizTime] = useState(null); // 다음 퀴즈 오픈 시간

  // 다음 퀴즈인 경우에만 시간 정보 계산
  useEffect(() => {
    if (isNext && quizData?.open_time) {
      const openTime = new Date(quizData.open_time);
      setNextQuizTime(openTime.getHours());
    }
  }, [isNext, quizData]);

  // 별 클릭 이벤트 핸들러
  const handleStarClick = () => {
    if (isOpen) {
      // 해당 퀴즈 페이지로 이동 (이미 완료했어도 열려있다면 이동 가능)
      navigate(`/quiz/${quizId}`);
    }
  };

  // 상태에 따른 별 이미지 반환 메서드
  const getStarImage = () => {
    if (isCompleted) return starImages.completed;   // 완료된 별
    if (isOpen) return starImages.active;           // 활성화(오픈 후)
    return starImages.inactive;                     // 비활성화(아직 오픈 전)
  };

  return (
    <div className={`star-container ${isOpen ? 'open' : 'closed'} ${isCompleted ? 'completed' : ''}`}>
      <img 
        src={getStarImage()} 
        alt="star"
        className="star-image"
        onClick={handleStarClick}
      />
      
      {/* 다음 퀴즈 말풍선 - hideTooltip이 true면 표시하지 않음 */}
      {isNext && nextQuizTime !== null && !hideTooltip && (
        <div className="tooltip">
          <img src={starImages.tooltip} alt="next quiz tooltip" />
          <span>다음 퀴즈는 {nextQuizTime}시에 열려요!</span>
        </div>
      )}
    </div>
  );
};

export default StarQuiz; 