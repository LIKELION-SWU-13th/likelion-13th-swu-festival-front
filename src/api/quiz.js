import api from './axios';

// 푼 퀴즈 ID 목록 조회 (응답했던 퀴즈 목록)
export const getCompletedQuizzes = async () => {
  const response = await api.get('/quiz/star');
  return response.data;
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
  const response = await api.get(`/quiz/${quizId}/percent`);
  return response.data;
};

// 퀴즈 응답 제출
export const submitQuizAnswer = async (quizId, choiceStr) => {
  const response = await api.post(`/answers/sendAnswer/${quizId}`, { choiceStr });
  return response.data;
};

// 퀴즈 결과 타입 조회
export const getQuizType = async () => {
  const response = await api.get('/quiz/type');
  return response.data;
};

// 퀴즈 오픈 시간 계산 함수
const getQuizOpenTime = (quizId) => {
  // 퀴즈 ID에 따른 오픈 시간 매핑
  const quizOpenTimes = {
    // 축제 첫째날: 5/21(수)
    1: '2025-05-21T11:00:00',
    2: '2025-05-21T14:00:00',
    3: '2025-05-21T16:00:00',
    4: '2025-05-21T18:00:00',
    
    // 둘째날: 5/22(목)
    5: '2025-05-22T11:00:00',
    6: '2025-05-22T14:00:00',
    7: '2025-05-22T16:00:00',
    8: '2025-05-22T18:00:00',
    
    // 셋째날: 5/23(금)
    9: '2025-05-23T11:00:00',
    10: '2025-05-23T14:00:00',
    11: '2025-05-23T16:00:00',
    12: '2025-05-23T18:00:00'
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