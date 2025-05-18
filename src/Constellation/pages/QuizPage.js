import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizDetail, getQuizPercent, submitQuizAnswer } from '../../api/quiz';
import './QuizPage.css';

const QuizPage = () => {
  const { quizId } = useParams(); // URL 파라미터에서 퀴즈 ID 추출
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 상태 정의
  const [quizData, setQuizData] = useState(null);  // 퀴즈 상세 정보
  const [result, setResult] = useState(null);  // 퀴즈 결과 (응답 + 비율)
  const [isLoading, setIsLoading] = useState(true);  // 로딩 여부
  const [selectedChoice, setSelectedChoice] = useState(null);  // 선택된 항목 상태

  // 퀴즈 데이터 불러오기
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setIsLoading(true);

        // 퀴즈 내용 불러오기
        const data = await getQuizDetail(quizId);
        setQuizData(data);
        
        // 이미 응답했는지 확인
        try {
          const percentData = await getQuizPercent(quizId);
          if (percentData.choice) {
            setResult(percentData); // 응답 결과 저장
          }
        } catch (error) {
          // 응답이 없으면 무시 (정상 흐름)
          console.log(`퀴즈 ${quizId}에 아직 응답하지 않았습니다.`);
        }
      } catch (error) {
        console.error('퀴즈 정보 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [quizId]);

  // 응답 제출 처리
  const handleAnswer = async (choice) => {
    setSelectedChoice(choice); // 선택한 항목 표시
    try {
      const data = await submitQuizAnswer(quizId, choice); // 응답 제출
      setResult(data); // 결과 저장
    } catch (error) {
      console.error('응답 제출 실패:', error);
    }
  };

  // 로딩 중일 때
  if (isLoading || !quizData) {
    return <div className="quiz-loading">잠시만 기다려주세요...</div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        {/* 퀴즈 정보 - 왼쪽 정렬 */}
        <h2 className="quiz-number">Q{quizId}.</h2>
        <hr className="quiz-separator" />
        <h1 className="quiz-question">{quizData.body}</h1>

        {/* 응답 전 or 응답 후 */}
        {!result ? (
          <div className="quiz-choices">
            <button
              className={`choice-button ${selectedChoice === 'A' ? 'selected' : ''}`}
              onClick={() => handleAnswer('A')}
            >
              <span className="choice-label">A.</span>
              <span className="choice-text">{quizData.a_body}</span>
            </button>
            <button
              className={`choice-button ${selectedChoice === 'B' ? 'selected' : ''}`}
              onClick={() => handleAnswer('B')}
            >
              <span className="choice-label">B.</span>
              <span className="choice-text">{quizData.b_body}</span>
            </button>
          </div>
        ) : (
          <div className="quiz-result">
            {['A', 'B'].map((key) => {
              // 퍼센트 값 계산 및 소수점 한 자리까지만 표시
              const percentValue = parseFloat(result[`${key.toLowerCase()}_rate`]).toFixed(1);
              
              return (
                <div className="choice-result" key={key}>
                  <div 
                    className="choice-button filled"
                    style={{ '--percent': `${percentValue}%` }} // CSS 변수로 퍼센트 전달
                  >
                    <span className="choice-label">{key}.</span>
                    <span className="choice-text">
                      {key === 'A' ? quizData.a_body : quizData.b_body}
                    </span>
                  </div>
                  <div className="choice-percent-text">
                    {percentValue}%의 슈니들이 여기에 해당돼요!
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* 하단에 고정된 홈 버튼 */}
        <button className="home-button" onClick={() => navigate('/')}>
          홈 화면 바로가기
        </button>
      </div>
    </div>
  );
};

export default QuizPage;