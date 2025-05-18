import api from './axios';

// 현재 오픈된 퀴즈 ID 목록 조회
export const getOpenQuizzes = async () => {
  const response = await api.get('/quiz/star');
  return response.data;
};

// 퀴즈 상세 정보 조회
export const getQuizDetail = async (quizId) => {
  const response = await api.get(`/quiz/${quizId}`);
  return response.data;
};

// 퀴즈 응답 여부 및 비율 확인
export const getQuizPercent = async (quizId) => {
  const response = await api.get(`/quiz/${quizId}/percent`);
  return response.data;
};

// 퀴즈 응답 제출
export const submitQuizAnswer = async (quizId, choice) => {
  const response = await api.post(`/answers/sendAnswer/${quizId}`, {
    choiceStr: choice,
  });
  return response.data;
};

// 결과 타입 조회
export const getQuizType = async () => {
  const response = await api.get('/quiz/type');
  return response.data;
}; 