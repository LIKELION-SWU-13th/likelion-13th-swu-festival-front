import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarQuiz from '../components/StarQuiz';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getCompletedQuizzes, getQuizType, getQuizOpenTime, isQuizOpen, QUIZ_OPEN_TIMES } from '../../api/quiz';
import TopTabs from '../../components/TopTabs';
import './ConstellationPage.css';

// 별자리 관련 이미지 import
import constellationLines from '../assets/constellation-lines.svg';
import starInactive from '../assets/star-inactive.svg';
import starActive from '../assets/star-active.svg';
import starCompleted from '../assets/star-completed.svg';
import tooltip from '../assets/tooltip.svg';
import buttonFloating from '../assets/button-floating.svg';
import buttonBg from '../../Signup/assets/button-bg.svg';

// API 요청 타임아웃(밀리초)
const API_TIMEOUT = 5000;

// 타임아웃 처리된 API 호출 함수
const callWithTimeout = (apiPromise) => {
  return Promise.race([
    apiPromise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('요청 시간이 초과되었습니다.')), API_TIMEOUT)
    )
  ]);
};

// 별자리 선 SVG의 viewBox 크기와 맞추기
const VIEWBOX_WIDTH = 278;
const VIEWBOX_HEIGHT = 514;

// 별 좌표를 viewBox 기준으로 맞춰서 사용
const STAR_POSITIONS = [
  { id: 1, x: 215, y: 1 },      // 첫 번째로 열리는 별
  { id: 2, x: 130, y: 59},      // 두 번째
  { id: 3, x: 105, y: 140},     // 세 번째
  { id: 4, x: 129, y: 190},     // 네 번째
  { id: 5, x: 37, y: 294},     // 다섯 번째
  { id: 6, x: 8, y: 446},    // 여섯 번째
  { id: 7, x: 137, y: 510},  // 일곱 번째 (맨 아래)
  { id: 8, x: 88, y: 379},  // 여덟 번째
  { id: 9, x: 272, y: 275},  // 아홉 번째 (제일 오른쪽)
  { id: 10, x: 218, y: 219},  // 열 번째
  { id: 11, x: 207, y: 112},  // 열한 번째
  { id: 12, x: 242, y: 59},  // 열두 번째
];

// 별마다 툴팁 위치 지정 (1번 별은 툴팁 없음)
const STAR_TOOLTIP = {
  2: { position: 'left' },    // 꼬리 오른쪽
  3: { position: 'top' },     // 꼬리 아래
  4: { position: 'left' },    // 꼬리 오른쪽
  5: { position: 'top' },     // 꼬리 아래
  6: { position: 'right' },   // 꼬리 왼쪽
  7: { position: 'right' },   // 꼬리 왼쪽
  8: { position: 'top' },     // 꼬리 아래
  9: { position: 'left' },    // 꼬리 오른쪽
  10: { position: 'top' },    // 꼬리 아래
  11: { position: 'bottom' }, // 꼬리 위
  12: { position: 'top' },    // 꼬리 아래
};

// 오픈 시간에서 시만 추출
function getOpenHourStr(quizId) {
  const iso = QUIZ_OPEN_TIMES[quizId];
  if (!iso) return '';
  const date = new Date(iso);
  return `${date.getHours()}시`;
}

const ConstellationPage = () => {
  const navigate = useNavigate();
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTypeButton, setShowTypeButton] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [nextQuizId, setNextQuizId] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);

  // 컴포넌트 마운트 시 데이터 로드 - 완료된 퀴즈 목록만 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 토큰 유효성 확인
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/signup', { replace: true });
          return;
        }
        
        // 푼 퀴즈 ID 목록만 가져오기 (API 호출 1번만 발생)
        // 타임아웃 처리 추가
        let completedIds = [];
        try {
          completedIds = await callWithTimeout(getCompletedQuizzes());
        } catch (apiError) {
          // 타임아웃 또는 API 오류 - 빈 배열로 처리하고 계속 진행
          setErrorMessage('퀴즈 정보를 불러오는데 실패했습니다.');
        }
        
        setCompletedQuizzes(new Set(completedIds));
        
        // 모든 퀴즈를 완료했는지 체크
        if (completedIds.length === 12) {
          setShowTypeButton(true);
          setShowTooltip(true);
          
          // 유형 확인 모달이 이미 표시되었는지 확인
          const hasShownTypeModal = localStorage.getItem('hasShownTypeModal');
          if (!hasShownTypeModal) {
            setShowTypeModal(true);
            localStorage.setItem('hasShownTypeModal', 'true');
          }
          
          // 10초 후 툴팁 숨기기
          setTimeout(() => {
            setShowTooltip(false);
          }, 10000);
        }
      } catch (error) {
        // 심각한 오류인 경우 로그인 페이지로 리다이렉트
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/signup', { replace: true });
          return;
        }
        
        // 다른 오류는 메시지 표시하고 로딩 종료
        setErrorMessage('데이터를 불러오는데 실패했습니다.');
      } finally {
        // 어떤 경우든 로딩 상태 종료
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 현재 시간 1분마다 업데이트 (불필요한 API 호출 제거)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트
    
    return () => clearInterval(timer);
  }, []);

  // 시간이 변경될 때마다 다음 퀴즈 계산
  useEffect(() => {
    // 다음 열릴 퀴즈 찾기 (현재 열린 퀴즈 중 가장 높은 번호 다음 퀴즈)
    const calculateNextQuiz = () => {
      // 열려있는 퀴즈 중 가장 높은 번호 찾기
      let highestOpenQuizId = 0;
      
      // 1부터 12까지 순회하면서 열려있는 가장 큰 퀴즈 번호 찾기
      for (let i = 1; i <= 12; i++) {
        if (checkQuizOpen(i)) {
          highestOpenQuizId = i;
        }
      }
      
      // 다음 번호 퀴즈가 있다면 리턴
      const nextId = highestOpenQuizId + 1;
      if (nextId <= 12) {
        return nextId;
      }
      
      return null;
    };

    setNextQuizId(calculateNextQuiz());
  }, [currentTime]); // 시간이 변경될 때만 다시 계산

  const handleQuizComplete = (quizId) => {
    setCompletedQuizzes(prev => {
      const newSet = new Set([...prev, quizId]);
      // 모든 퀴즈가 완료되었는지 확인
      if (newSet.size === 12) {
        setShowTypeButton(true);
      }
      return newSet;
    });
  };

  const checkQuizType = async () => {
    try {
      // 토큰 확인
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/auth', { replace: true });
        return;
      }

      // 타임아웃 처리 추가
      const response = await callWithTimeout(getQuizType());

      if (response && typeof response.type === 'number') {
        navigate('/quiz/type', { 
          state: { type: response.type },
          replace: true
        });
      } else {
        throw new Error('유효하지 않은 유형 정보입니다.');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        alert('아직 모든 퀴즈를 완료하지 않았습니다.');
      } else {
        alert('결과를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  // 퀴즈가 열려 있는지 확인 (현재 시간 기준)
  const checkQuizOpen = (quizId) => {
    const openTimeStr = QUIZ_OPEN_TIMES[quizId];
    if (!openTimeStr) return false;

    const openTime = new Date(openTimeStr);
    return currentTime >= openTime;
  };

  if (isLoading) {
    return <LoadingSpinner text="잠시만 기다려주세요" />;
  }

  // 오류 발생했을 때 재시도 버튼 표시
  if (errorMessage) {
    return (
      <div className="error-container">
        <p>{errorMessage}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="constellation-container">
      <TopTabs />
      <div className="constellation-content">
        {/* 12개 퀴즈 모두 완료 시 유형 확인 버튼 -> 모달이 표시되지 않을 때만 보이도록 수정 */}
        {showTypeButton && !showTypeModal && (
          <div className="floating-button-container">
            <img src={buttonFloating} alt="유형 확인" className="tooltip-icon" onClick={checkQuizType} />
            {showTooltip && (
              <div className="tooltip-bubble tooltip-fade">
                축제를 즐기는 유형을 확인해 보세요
              </div>
            )}
          </div>
        )}
        {/* 별자리 선 + 별을 같은 컨테이너에서 비율 맞춰 렌더 */}
        <div className="constellation-visual-wrapper">
          <img
            src={constellationLines}
            alt="constellation lines"
            className="constellation-lines"
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          />
          {STAR_POSITIONS.map((position) => (
            <div
              key={position.id}
              className="star-position"
              style={{
                position: 'absolute',
                left: `${(position.x / VIEWBOX_WIDTH) * 100}%`,
                top: `${(position.y / VIEWBOX_HEIGHT) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            >
              <StarQuiz
                quizId={position.id}
                isOpen={checkQuizOpen(position.id)}
                isCompleted={completedQuizzes.has(position.id)}
                onComplete={handleQuizComplete}
                isNext={position.id === nextQuizId}
                quizData={{ open_time: QUIZ_OPEN_TIMES[position.id] }}
                starImages={{
                  inactive: starInactive,
                  active: starActive,
                  completed: starCompleted,
                  tooltip: tooltip
                }}
                hideTooltip={true}
              />
              {/* 다음 열릴 퀴즈 1개에만 커스텀 툴팁 표시 */}
              {position.id === nextQuizId && STAR_TOOLTIP[position.id] && (
                <div className={`star-tooltip-bubble star-tooltip-bubble-${STAR_TOOLTIP[position.id].position}`}>
                  다음 퀴즈는 {getOpenHourStr(position.id)}에 열려요!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 유형 확인 모달 */}
        {showTypeModal && (
          <div className="quiz-modal-container">
            <div className="quiz-modal-content">
              <div className="quiz-modal-title">
                <span className="quiz-modal-title-emoji">✨</span>
                <span>나는 어떤 축제 스타일일까?</span>
                <span className="quiz-modal-title-emoji">✨</span>
              </div>
              <p className="quiz-modal-message">
                테스트 완료! <br />
                지금 내 유형을 확인해 보세요.
              </p>
              <button 
                className="quiz-modal-button-success" 
                onClick={() => {
                  setShowTypeModal(false);
                  navigate('/quiz/type');
                }}
                style={{ 
                  backgroundImage: `url(${buttonBg})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              >
                유형 확인하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstellationPage;