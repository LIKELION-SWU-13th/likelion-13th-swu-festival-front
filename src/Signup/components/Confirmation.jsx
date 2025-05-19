import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../Signup.css';

const Confirmation = ({ userInfo, onNext, setUserInfo, selectedFile }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  // 로딩 중 여부
  const [error, setError] = useState('');         // 에러 메시지 상태
  const [ocrInfo, setOcrInfo] = useState({
    student_num: userInfo.student_num || '',
    name: userInfo.name || '',
    major: userInfo.major || '',
  });

  // userInfo가 변경될 때마다 ocrInfo 업데이트
  useEffect(() => {
    setOcrInfo({
      student_num: userInfo.student_num || '',
      name: userInfo.name || '',
      major: userInfo.major || '',
    });
  }, [userInfo]);

  // 로그인 요청 핸들러
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // userInfo를 그대로 사용하여 로그인 요청
      const response = await api.post('/user/login', userInfo);
      const { access_token, refresh_token } = response.data;

      // 토큰 localStorage에 저장
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // 커스텀 이벤트 발생 (App.js에서 감지)
      window.dispatchEvent(new Event('auth-change'));

      // 다음 단계로 이동 (로그인 성공 화면)
      onNext();
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // '다시 인식하기' 버튼 클릭 시 OCR 재요청 함수
  const handleRetry = async () => {
    if (!selectedFile) {
      setError('인식할 이미지가 없습니다. 이전 단계로 돌아가 이미지를 업로드해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // 다시 OCR 요청
      const response = await api.post('/user/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // OCR 결과를 다시 반영
      const { 아이디, 이름, 소속 } = response.data;
      const newUserInfo = {
        student_num: 아이디,
        name: 이름,
        major: 소속,
      };
      
      // 상위 컴포넌트의 상태 업데이트
      setUserInfo(newUserInfo);
      
      // 현재 컴포넌트의 표시 정보 업데이트
      setOcrInfo(newUserInfo);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('학생증이 인식되지 않았습니다. 올바른 사진을 넣어주세요.');
      } else {
        setError('QR 인증 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
      console.error('OCR 재시도 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirm-wrapper">
      <div className="confirm-box">
        {/* 화면 제목 */}
        <h2 className="confirm-title">QR 기반 정보 확인</h2>

        {/* 안내 메시지 */}
        <p className="confirm-description">
          아래 학번과 이름이 슈니 본인의 정보가 맞는지 <br />
          확인해 주세요.
        </p>

        {/* 정보 확인 영역(수정 기능이 없으므로 입력 폼 아님) */}
        <div className="confirm-info-container">
          {/* 학번 */}
          <div className="info-item">
            <span className="info-label">학번</span>
            <div className="info-value">{ocrInfo.student_num}</div>
          </div>

          {/* 학과 */}
          <div className="info-item">
            <span className="info-label">학과</span>
            <div className="info-value">{ocrInfo.major}</div>
          </div>

          {/* 이름 */}
          <div className="info-item">
            <span className="info-label">이름</span>
            <div className="info-value">{ocrInfo.name}</div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && <p className="form-error">{error}</p>}

        {/* 버튼 영역 */}
        <div className="confirm-buttons">
          {/* 다시 인식하기 버튼 */}
          <button 
            className="retry-button" 
            onClick={handleRetry}
            disabled={loading}
          >
            {loading ? '처리중...' : '다시 인식하기'}
          </button>

          {/* 로그인 버튼 */}
          <button
            className="form-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '처리중...' : '로그인 하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;