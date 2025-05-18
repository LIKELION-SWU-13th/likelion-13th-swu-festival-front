import api from './axios';

// 푼 퀴즈 ID 목록 조회 (응답했던 퀴즈 목록)
export const getCompletedQuizzes = async () => {
  const response = await api.get('/quiz/star');
  return response.data;
};

// 퀴즈 상세 정보 조회 (제목, 선택지, 오픈 시간 등)
export const getQuizDetail = async (quizId) => {
  const response = await api.get(`/quiz/${quizId}`);
  return response.data;
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

// 퀴즈 오픈 여부 확인 (현재 시간과 비교해서)
export const isQuizOpen = (openTime) => {
  if (!openTime) return false;
  const currentTime = new Date();
  const quizOpenTime = new Date(openTime);
  return currentTime >= quizOpenTime;
}; 