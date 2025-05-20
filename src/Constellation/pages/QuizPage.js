import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizDetail, getQuizPercent, submitQuizAnswer, isQuizOpen, QUIZ_OPEN_TIMES } from '../../api/quiz';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import './QuizPage.css';
import './Modal.css';
import buttonBg from '../../Signup/assets/button-bg.svg';
import buttonFloatingCoupon from '../assets/button-floating-coupon.svg';

// API 요청 타임아웃(밀리초)
const API_TIMEOUT = 3000;

// 타임아웃 처리된 API 호출 함수
const callWithTimeout = (apiPromise) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  return Promise.race([
    apiPromise.then(response => {
      clearTimeout(timeoutId);
      return response;
    }).catch(error => {
      clearTimeout(timeoutId);
      throw error;
    }),
    new Promise((_, reject) => 
      setTimeout(() => {
        controller.abort();
        reject(new Error('요청 시간이 초과되었습니다.'));
      }, API_TIMEOUT)
    )
  ]);
};

// 현재 시간 이후에 열리는 다음 퀴즈 정보 찾기
const getNextQuizInfo = () => {
  try {
    const currentTime = new Date();
    let nextQuizTime = null;
    let nextQuizId = null;
    
    // 모든 퀴즈 ID에 대해 확인 (1부터 12까지)
    for (let id = 1; id <= 12; id++) {
      const openTimeStr = QUIZ_OPEN_TIMES[id];
      if (!openTimeStr) continue;
      
      const openTime = new Date(openTimeStr);
      
      // 아직 열리지 않은 퀴즈 중에서 가장 빨리 열리는 퀴즈 찾기
      if (openTime > currentTime) {
        if (!nextQuizTime || openTime < nextQuizTime) {
          nextQuizTime = openTime;
          nextQuizId = id;
        }
      }
    }
    
    if (nextQuizTime) {
      return {
        nextQuizId,
        nextQuizTime: nextQuizTime.getHours()
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

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
  const [error, setError] = useState(null);  // 오류 상태
  const [isCompleted, setIsCompleted] = useState(false); // 퀴즈 완료 여부 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태 추가
  const [pollingId, setPollingId] = useState(null); // 폴링 ID 상태 추가
  const [nextQuizInfo, setNextQuizInfo] = useState(null); // 다음 퀴즈 정보 상태
  const [completedCount, setCompletedCount] = useState(0);    // 완료한 퀴즈 수

  // 퀴즈 데이터 불러오기
  useEffect(() => {
    let isMounted = true;
    
    const loadQuizData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          // 1. 완료한 퀴즈 목록 확인
          const completedQuizzesResponse = await api.get('/quiz/star', {
            signal: controller.signal,
            timeout: 3000
          });
          
          if (!isMounted) return;
          
          const completedQuizzes = completedQuizzesResponse.data;
          const isQuizCompleted = completedQuizzes.includes(parseInt(quizId));
          setIsCompleted(isQuizCompleted);
          setCompletedCount(completedQuizzes.length);  // 완료한 퀴즈 수 저장

          // 2. 퀴즈 상세 정보
          const quizDetailResponse = await api.get(`/quiz/${quizId}`, {
            signal: controller.signal,
            timeout: 3000
          });
          
          if (!isMounted) return;
          setQuizData(quizDetailResponse.data);
          
          // 3. 완료된 퀴즈인 경우 결과 정보도 함께 로드
          if (isQuizCompleted) {
            try {
              const percentResponse = await api.get(`/quiz/${quizId}/percent`, {
                signal: controller.signal,
                timeout: 3000
              });
              
              if (!isMounted) return;
              const percentData = percentResponse.data;
              if (percentData && percentData.choice) {
                setResult(percentData);
                setIsSuccessful(percentData._win === true);
              }
            } catch (percentError) {
              // 비율 정보 조회 실패
            }
          }
        } catch (error) {
          if (!isMounted) return;
          
          if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
            setError('데이터를 불러오는 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
          } else {
            setError('퀴즈 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        setError('앱에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuizData();
    
    return () => {
      isMounted = false;
    };
  }, [quizId]);

  // 컴포넌트 마운트 시 다음 퀴즈 정보 계산
  useEffect(() => {
    // API 호출 없이 시간 정보 계산
    setNextQuizInfo(getNextQuizInfo());
  }, []);

  // 응답 제출 처리
  const handleAnswer = async (choice) => {
    if (isCompleted || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSelectedChoice(choice);
    setError(null);
    
    try {
      // 응답 제출 시도 (타임아웃 5초)
      const response = await api.post(`/answers/sendAnswer/${quizId}`, 
        { choiceStr: choice },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // 서버 응답에서 선착순 정보 확인
      const isWinner = response?.data?._win === true;
      setIsSuccessful(isWinner);
      
      // 모달 표시
      setShowModal(true);
      
      // 응답 제출이 완료되면 퀴즈 완료 상태로 설정
      setIsCompleted(true);
      
      // 결과 정보 요청하여 표시
      try {
        const percentResponse = await api.get(`/quiz/${quizId}/percent`, {
          timeout: 3000
        });
        
        if (percentResponse?.data) {
          setResult(percentResponse.data);
        }
      } catch (percentError) {
        // 비율 정보 조회 실패 처리
      }
      
    } catch (error) {
      // 선택 해제
      setSelectedChoice(null);

      if (error.response) {
        const status = error.response.status;
        
        // 400번대 에러는 에러 메시지 표시
        if (status >= 400 && status < 500) {
          let errorMessage = '응답 제출에 실패했습니다. 다시 시도해주세요.';
          
          // 403: 이미 응답한 퀴즈
          if (status === 403) {
            errorMessage = '이미 응답한 퀴즈입니다.';
          }
          // 404: 퀴즈를 찾을 수 없음
          else if (status === 404) {
            errorMessage = '퀴즈를 찾을 수 없습니다.';
          }
          // 409: 충돌 (이미 응답했거나 쿠폰 락 획득 실패)
          else if (status === 409) {
            if (error.response.data?.includes('쿠폰 락 획득 실패')) {
              errorMessage = '응답 제출에 실패했습니다. 다시 시도해주세요.';
            } else {
              errorMessage = '이미 응답한 퀴즈입니다.';
            }
          }
          
          setError(errorMessage);
        }
        // 500번대 에러는 로딩 스피너 표시
        else if (status >= 500) {
          setIsLoading(true);
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          // 3초 후 새로고침
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
      // 네트워크 오류나 타임아웃
      else if (error.code === 'ECONNABORTED' || !error.response) {
        setIsLoading(true);
        setError('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
        // 3초 후 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } finally {
      // 제출 상태 종료
      setIsSubmitting(false);
    }
  };

  // 모달 닫기 및 결과 보기
  const handleModalConfirm = () => {
    setShowModal(false);
  };

  // 로딩 중이거나 심각한 에러 발생 시 LoadingSpinner 표시
  if (isLoading || (error && (error.includes('시간이 초과') || error.includes('지연') || error.includes('서버')))) {
    return <LoadingSpinner text={error || "잠시만 기다려주세요"} />;
  }

  // quizData가 없는 경우도 LoadingSpinner로 처리
  if (!quizData) {
    return <LoadingSpinner text="퀴즈 정보를 불러오는 중입니다" />;
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
              className={`choice-button ${selectedChoice === 'A' ? 'selected' : ''} ${isSubmitting ? 'submitting' : ''}`}
              onClick={() => handleAnswer('A')}
              disabled={selectedChoice !== null || isCompleted || isSubmitting}
            >
              <span className="choice-label">A.</span>
              <span className="choice-text">{quizData.a_body}</span>
              {selectedChoice === 'A' && (
                <span className="loading-indicator"></span>
              )}
            </button>
            <button
              className={`choice-button ${selectedChoice === 'B' ? 'selected' : ''} ${isSubmitting ? 'submitting' : ''}`}
              onClick={() => handleAnswer('B')}
              disabled={selectedChoice !== null || isCompleted || isSubmitting}
            >
              <span className="choice-label">B.</span>
              <span className="choice-text">{quizData.b_body}</span>
              {selectedChoice === 'B' && (
                <span className="loading-indicator"></span>
              )}
            </button>
          </div>
        ) : (
          <div className="quiz-result">
            {['A', 'B'].map((key) => {
              // 퍼센트 값 계산 및 정수로만 표시
              const percentValue = Math.round(parseFloat(result[`${key.toLowerCase()}_rate`]));
              const isSelected = result.choice === key; // 사용자가 선택한 응답지인지 확인
              
              return (
                <div className="choice-result" key={key}>
                  <div 
                    className={`choice-button filled ${isSelected ? 'selected-choice' : 'unselected-choice'}`}
                    style={{ '--percent': `${percentValue}%` }} // CSS 변수로 퍼센트 전달
                  >
                    <span className="choice-label">{key}.</span>
                    <span className="choice-text">
                      {key === 'A' ? quizData.a_body : quizData.b_body}
                    </span>
                  </div>
                  <div className="choice-percent-text">
                    {isSelected 
                      ? `나를 포함한 ${percentValue}%의 슈니들이 여기에 해당돼요!`
                      : `${percentValue}%의 슈니들이 여기에 해당돼요!`
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* 에러 메시지 표시 개선 - 퀴즈 UI 내에 표시되는 경우 (이미 응답한 퀴즈 등) */}
        {error && !error.includes('지연') && !error.includes('서버') && !error.includes('시간이 초과') && (
          <div className="quiz-error-message">
            <p>{error}</p>
          </div>
        )}
        
        {/* 하단에 고정된 홈 버튼 - 응답 후에만 노출 */}
        {result && (
          <div className="quiz-bottom-container">
            {/* 플로팅 쿠폰 버튼 */}
            {result._win === true && (
              <div className="coupon-floating-container">
                <button
                  className="coupon-floating-button"
                  onClick={() => navigate('/coupon', { state: { from: 'quiz' } })}
                >
                  <img src={buttonFloatingCoupon} alt="커피 쿠폰" />
                </button>
              </div>
            )}
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
        )}
      </div>

      {/* 당첨/미당첨 모달 */}
      {showModal && (
        <div className="quiz-modal-container">
          <div className="quiz-modal-content">
            {isSuccessful ? (
              // 성공 모달
              <>
                <div className="quiz-modal-title">
                  <span className="quiz-modal-title-emoji">🎉</span>
                  <span>커피 쿠폰 당첨!</span>
                  <span className="quiz-modal-title-emoji">🎉</span>
                </div>
                <p className="quiz-modal-message">
                  선착순 2명의 주인공 슈니!<br />
                  컴포즈 커피 쿠폰을 받을 수 있어요
                </p>
                <button 
                  className="quiz-modal-button-success" 
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
            ) : (
              // 실패 모달
              <>
                <div className="quiz-modal-title">
                  <span className="quiz-modal-title-emoji">🥹</span>
                  <span>다음 기회에..</span>
                </div>
                <p className="quiz-modal-message">
                  아쉽게 선착순 커피 쿠폰을 놓쳤어요.<br />
                  {nextQuizInfo && nextQuizInfo.nextQuizTime ? 
                    `${nextQuizInfo.nextQuizTime}시에 다시 도전해 주세요!` : 
                    "모든 퀴즈가 종료되었어요!"}
                </p>
                <button 
                  className="quiz-modal-button-fail" 
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