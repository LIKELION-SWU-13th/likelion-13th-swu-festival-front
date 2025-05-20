import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getQuizType } from '../../api/quiz';
import './QuizType.css';
import buttonBg from '../../Signup/assets/button-bg.svg';
import backIcon from '../../Signup/assets/icon-back.svg';

// 유형별 이미지 import
import type1Image from '../assets/types/type1.svg';
import type2Image from '../assets/types/type2.svg';
import type3Image from '../assets/types/type3.svg';
import type4Image from '../assets/types/type4.svg';

const QuizType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState(null);

  // 유형별 정보 매핑을 useMemo로 감싸기
  const typeInfo = useMemo(() => ({
    1: {
      image: type1Image,
      title: "유형 1",
    },
    2: {
      image: type2Image,
      title: "유형 2",
    },
    3: {
      image: type3Image,
      title: "유형 3",
    },
    4: {
      image: type4Image,
      title: "유형 4",
    }
  }), []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 생성

  useEffect(() => {
    const checkAuthAndFetchType = async () => {
      try {
        setLoading(true);
        setError(null);

        // 토큰 존재 여부 먼저 확인
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('토큰이 없어 로그인 페이지로 이동합니다.');
          navigate('/signup', { replace: true });
          return;
        }

        // location.state에서 type을 가져오거나 API 호출
        const type = location.state?.type;
        if (type && typeInfo[type]) {
          setUserType(type);
          setLoading(false);
          return;
        }

        // state에 type이 없거나 유효하지 않은 경우 API 호출
        try {
          const response = await getQuizType();
          
          if (!response || typeof response.type !== 'number' || !typeInfo[response.type]) {
            throw new Error('유효하지 않은 유형 정보입니다.');
          }
          
          setUserType(response.type);
        } catch (apiError) {
          
          if (apiError.response?.status === 403) {
            setError('모든 퀴즈를 완료한 후에 결과를 확인할 수 있습니다.');
            // 3초 후 홈으로 리다이렉트
            setTimeout(() => {
              navigate('/constellation', { replace: true });
            }, 3000);
          } else {
            setError(apiError.message || '유형 정보를 가져오는데 실패했습니다.');
          }
        }
      } catch (error) {
        if (error.response?.status === 403) {
          setError('퀴즈를 모두 완료한 후에 결과를 확인할 수 있습니다.');
          // 3초 후 홈으로 리다이렉트
          setTimeout(() => {
            navigate('/constellation', { replace: true });
          }, 3000);
        } else {
          setError(error.message || '유형 정보를 가져오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchType();
  }, [navigate, location.state, typeInfo]);

  if (loading) {
    return <div className="loading">결과를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">
      <p>{error}</p>
      <button onClick={() => navigate('/', { replace: true })}>
        홈으로 돌아가기
      </button>
    </div>;
  }

  if (!userType || !typeInfo[userType]) {
    return <div className="error">
      <p>유형 정보를 찾을 수 없습니다.</p>
      <button onClick={() => navigate('/', { replace: true })}>
        홈으로 돌아가기
      </button>
    </div>;
  }

  return (
    <div className="type-container">
      <div className="type-content">
        <button className="constellation-quiz-type-back-button" onClick={() => navigate('/constellation')}>
          <img src={backIcon} alt="뒤로가기" />
        </button>

        <h1 className="type-title">✨ 슈니의 유형은?</h1>
        
        <p className="type-description">
          이 페이지를 캡쳐해서 스토리에 올리면<br />
          추첨을 통해 컴포즈 커피 쿠폰을 드립니다!
        </p>

        <img 
          src={typeInfo[userType].image} 
          alt={`유형 ${userType} 결과`} 
          className="type-image"
        />

        <div className="button-container">
          <button 
            className="instagram-button"
            onClick={() => window.open('https://www.instagram.com/likelion_swu/', '_blank')}
            style={{ 
              backgroundImage: `url(${buttonBg})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          >
            멋사 인스타그램 바로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizType;