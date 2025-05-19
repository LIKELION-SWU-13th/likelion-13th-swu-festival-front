import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarQuiz from '../components/StarQuiz';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getCompletedQuizzes, getQuizType } from '../../api/quiz';
import TopTabs from '../../components/TopTabs';
import './ConstellationPage.css';

// 별자리 관련 이미지 import
import constellationLines from '../assets/constellation-lines.svg';
import starInactive from '../assets/star-inactive.svg';
import starActive from '../assets/star-active.svg';
import starCompleted from '../assets/star-completed.svg';
import tooltip from '../assets/tooltip.svg';
import buttonFloating from '../assets/button-floating.svg';

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

// 피그마 좌표를 참고로 변환한 좌표(노가다)
const STAR_POSITIONS = [
  { id: 1, x: 75, y: 20 },      // 첫 번째로 열리는 별
  { id: 2, x: 53, y: 29 },      // 두 번째
  { id: 3, x: 45, y: 43 },      // 세 번째
  { id: 4, x: 52, y: 52 },      // 네 번째
  { id: 5, x: 26, y: 69 },      // 다섯 번째
  { id: 6, x: 18, y: 94 },      // 여섯 번째
  { id: 7, x: 53, y: 104 },     // 일곱 번째 (맨 밑)
  { id: 8, x: 40, y: 83 },      // 여덟 번째
  { id: 9, x: 92, y: 66 },      // 아홉 번째
  { id: 10, x: 77, y: 57 },     // 열 번째
  { id: 11, x: 73, y: 39 },     // 열한 번째
  { id: 12, x: 84, y: 30 },     // 열두 번째
];

// 퀴즈 오픈 시간 매핑 - quiz.js의 getQuizOpenTime과 동일하게 유지
const QUIZ_OPEN_TIMES = {
  // 축제 첫째날: 5/21(수)
  1: '2025-05-19T11:00:00',
  2: '2025-05-19T14:00:00',
  3: '2025-05-19T16:00:00',
  4: '2025-05-19T18:00:00',
  
  // 둘째날: 5/22(목)
  5: '2025-05-19T11:00:00',
  6: '2025-05-19T14:00:00',
  7: '2025-05-19T16:00:00',
  8: '2025-05-19T18:00:00',
  
  // 셋째날: 5/23(금)
  9: '2025-05-19T11:00:00',
  10: '2025-05-19T14:00:00',
  11: '2025-05-19T16:00:00',
  12: '2025-05-19T18:00:00'
};

const ConstellationPage = () => {
  const navigate = useNavigate();
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTypeButton, setShowTypeButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  // 다음 열릴 퀴즈 찾기 (현재 열린 퀴즈 중 가장 높은 번호 다음 퀴즈)
  const getNextQuizToOpen = () => {
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

  const nextQuizId = getNextQuizToOpen();

  return (
    <div className="constellation-container">
      <TopTabs />
      
      {/* 12개 퀴즈 모두 완료 시 유형 확인 버튼 */}
      {showTypeButton && (
        <div className="floating-button-container">
          <button
            className="type-floating-button"
            onClick={checkQuizType}
          >
            <img src={buttonFloating} alt="유형 확인하기" />
          </button>
          
          <div className="type-tooltip">
            <img src={tooltip} alt="tooltip" />
            <span>축제를 즐기는 유형을 확인해보세요</span>
          </div>
        </div>
      )}
      
      <div className="constellation-grid">
        {/* 별자리 선 이미지 */}
        <div className="constellation-background">
          <img src={constellationLines} alt="constellation lines" />
        </div>
        
        {/* 별들 */}
        {STAR_POSITIONS.map((position) => (
          <div
            key={position.id}
            className="star-position"
            style={{
              position: 'absolute',
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConstellationPage;