import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizPercent } from '../../api/quiz';
import './StarQuiz.css';

const StarQuiz = ({ quizId, isOpen, isCompleted, onComplete, isNext, quizData, starImages }) => {
  const navigate = useNavigate();
  const [nextQuizTime, setNextQuizTime] = useState(null); // 다음 퀴즈 오픈 시간

  useEffect(() => {
    // 퀴즈가 열려있고 아직 완료하지 않았다면 완료 여부 체크
    if (isOpen && !isCompleted) {
      checkIfCompleted();
    }
    
    // 다음 퀴즈인 경우 시간 추출
    if (isNext && quizData?.open_time) {
      const openTime = new Date(quizData.open_time);
      setNextQuizTime(openTime.getHours());
    }
  }, [isOpen, isNext, quizId, quizData, isCompleted]);

  // 이미 응답했는지 확인하는 메서드
  const checkIfCompleted = async () => {
    try {
      const data = await getQuizPercent(quizId);
      // 응답이 있으면 완료 처리
      if (data && data.choice) {
        onComplete(quizId);
      }
    } catch (error) {
      // 응답이 없는 경우 - 에러는 정상 케이스
      console.log(`퀴즈 ${quizId}에 아직 응답하지 않았습니다.`);
    }
  };

  // 별 클릭 이벤트 핸들러
  const handleStarClick = () => {
    if (isOpen) {
      // 해당 퀴즈 페이지로 이동
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
    <div className={`star-container ${isOpen ? 'open' : 'closed'}`}>
      <img 
        src={getStarImage()} 
        alt="star"
        className="star-image"
        onClick={handleStarClick}
      />
      
      {/* 다음 퀴즈 말풍선 */}
      {isNext && nextQuizTime !== null && (
        <div className="tooltip">
          <img src={starImages.tooltip} alt="next quiz tooltip" />
          <span>다음 퀴즈는 {nextQuizTime}시에 열려요!</span>
        </div>
      )}
    </div>
  );
};

export default StarQuiz; 