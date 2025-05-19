import api from './axios';

// 푼 퀴즈 ID 목록 조회 (응답했던 퀴즈 목록)
export const getCompletedQuizzes = async () => {
  try {
    const response = await api.get('/quiz/star');
    
    // 응답 데이터가 배열인지 확인
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.quizzes)) {
      // 응답 형식이 다른 경우 (quizzes 배열)
      return response.data.quizzes;
    } else {
      // 예상치 못한 응답 형식
      console.error('Unexpected response format:', response.data);
      return [];
    }
  } catch (error) {
    // 오류 콘솔 표시
    console.error('Failed to fetch completed quizzes:', error);
    
    // 403 에러는 권한 문제 - 빈 배열 반환
    if (error.response?.status === 403) {
      return []; // 일단 빈 배열 반환
    }
    
    // 네트워크 오류 등의 경우 예외를 상위로 전파해 타임아웃 처리가 동작할 수 있게 함
    if (!error.response) {
      throw error;
    }
    
    return []; // 다른 오류의 경우 빈 배열 반환
  }
};

// 퀴즈 상세 정보 조회
export const getQuizDetail = async (quizId) => {
  try {
    const response = await api.get(`/quiz/${quizId}`);
    return {
      ...response.data,
      // 프론트에서 open_time 처리함
      open_time: getQuizOpenTime(quizId)
    };
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('퀴즈를 찾을 수 없습니다.');
    }
    throw error;
  }
};

// 퀴즈 응답 비율 및 사용자 선택 조회 (이미 응답했다면)
export const getQuizPercent = async (quizId) => {
  try {
    const response = await api.get(`/quiz/${quizId}/percent`);
    return response.data;
  } catch (error) {
    // 403 에러는 아직 응답하지 않은 상태로 간주
    if (error.response?.status === 403) {
      return { message: '해당 퀴즈에 아직 응답하지 않았습니다.' };
    }
    
    // API 호출 실패해도 앱이 계속 동작하도록 에러를 던지지 않고 메시지만 반환
    return { 
      message: '응답 비율을 가져오는데 실패했습니다.',
      error: true 
    };
  }
};

// 퀴즈 응답 제출
export const submitQuizAnswer = async (quizId, choiceStr) => {
  const response = await api.post(`/answers/sendAnswer/${quizId}`, { choiceStr });
  return response.data;
};

// 퀴즈 결과 타입 조회
export const getQuizType = async () => {
  const response = await api.get('/user/type');
  return response.data;
};

// 퀴즈 오픈 시간 계산 함수
const getQuizOpenTime = (quizId) => {
  // 퀴즈 ID에 따른 오픈 시간 매핑
  const quizOpenTimes = {
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

  return quizOpenTimes[quizId] || null;
};

// 퀴즈가 열려 있는지 확인 (현재 시간과 비교해서)
export const isQuizOpen = (openTime) => {
  if (!openTime) return false;
  const currentTime = new Date();
  const quizOpenTime = new Date(openTime);
  return currentTime >= quizOpenTime;
}; 