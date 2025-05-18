import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizDetail, getQuizPercent, submitQuizAnswer } from '../../api/quiz';
import './QuizPage.css';
import './Modal.css';
import buttonBg from '../../Signup/assets/button-bg.svg';

const QuizPage = () => {
  const { quizId } = useParams(); // URL 파라미터에서 퀴즈 ID 추출
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 상태 정의
  const [quizData, setQuizData] = useState(null);  // 퀴즈 상세 정보
  const [result, setResult] = useState(null);  // 퀴즈 결과 (응답 + 비율)
  const [isLoading, setIsLoading] = useState(true);  // 로딩 여부
  const [selectedChoice, setSelectedChoice] = useState(null);  // 선택된 항목 상태
  const [showModal, setShowModal] = useState(false);  // 모달 표시 여부
  const [isSuccessful, setIsSuccessful] = useState(false);  // 선착순 성공 여부

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
      // 선택한 답변을 서버에 제출
      const data = await submitQuizAnswer(quizId, choice);
      
      // API 응답에서 당첨 여부 확인
      const isWinner = data._win === true;
      setIsSuccessful(isWinner);
      setShowModal(true); // 모달 표시
      
      // 1초 대기 후 최신 퍼센트 데이터 가져오기
      await new Promise(resolve => setTimeout(resolve, 1000));
      const latestData = await getQuizPercent(quizId);
      
      // 최신 결과 데이터 저장
      setResult(latestData);
    } catch (error) {
      console.error('응답 제출 실패:', error);
      // 에러 발생 시 모달 표시하지 않고 결과도 저장하지 않음
    }
  };

  // 모달 닫기 및 결과 보기
  const handleModalConfirm = () => {
    setShowModal(false); // 모달 닫기
    
    if (isSuccessful) {
      // 쿠폰 페이지로 이동
      navigate('/coupon');
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

      {/* 모달 창 */}
      {showModal && (
        <div className="modal-container">
          <div className="modal-content">
            {isSuccessful ? (
              // 성공 모달
              <>
                <div className="modal-title">
                  <span className="modal-title-emoji">🎉</span>
                  <span>커피 쿠폰 당첨!</span>
                  <span className="modal-title-emoji">🎉</span>
                </div>
                <p className="modal-message">
                  선착순 2명의 주인공 슈니!<br />
                  컴포즈 커피 쿠폰을 받을 수 있어요
                </p>
                <button 
                  className="modal-button-success" 
                  onClick={handleModalConfirm}
                  style={{ 
                    backgroundImage: `url(${buttonBg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                >
                  쿠폰 받으러 가기
                </button>
              </>
            ) : (
              // 실패 모달
              <>
                <div className="modal-title">
                  <span className="modal-title-emoji">🥹</span>
                  <span>다음 기회에..</span>
                </div>
                <p className="modal-message">
                  아쉽게 선착순 커피 쿠폰을 놓쳤어요.<br />
                  OO시에 다시 도전해 주세요!
                </p>
                <button 
                  className="modal-button-fail" 
                  onClick={handleModalConfirm}
                  style={{ 
                    backgroundImage: `url(${buttonBg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                >
                  확인
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;