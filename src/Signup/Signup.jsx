import React, { useState } from 'react';
import QRUpload from './components/QRUpload';
import Confirmation from './components/Confirmation';
import Success from './components/Success';
import './Signup.css';

// 각 스텝별 배경 이미지 import
import bgStart from './assets/bg-upload-start.svg';
import bgPlaceholder from './assets/bg-placeholder.svg';
import bgPreview from './assets/bg-preview.svg';
import bgConfirmation from './assets/bg-confirmation.svg';
import bgSuccess from './assets/bg-success.svg';

// 진행 상태 인디케이터 이미지 import
import step1Active from './assets/step-1-active.svg';
import step1Inactive from './assets/step-1-inactive.svg';
import step2Active from './assets/step-2-active.svg';
import step2Inactive from './assets/step-2-inactive.svg';
import step3Active from './assets/step-3-active.svg';
import step3Inactive from './assets/step-3-inactive.svg';


const Signup = () => {
  // 현재 진행 중인 step
  // 1: QR 업로드, 2: 정보 확인, 3: 로그인 완료
  const [step, setStep] = useState(1);


  // QRUpload 컴포넌트에서 받아온 사용자 정보 상태
  const [userInfo, setUserInfo] = useState({
    student_num: '', // 학번
    name: '',        // 이름
    major: '',       // 학과
  });

  // 업로드된 파일 상태 (QRUpload에서 사용)
  const [selectedFile, setSelectedFile] = useState(null)


  // 다음 단계로 이동하는 메서드
  const handleNext = () => {
    setStep((prev) => prev + 1);
  };


  // 현재 단계 및 파일 업로드 상태에 따라 배경 이미지를 동적으로 결정
  const getBackgroundImage = () => {
    if (step === 1 && !selectedFile) return bgStart;                 // QR 인증 시작 전
    if (step === 1 && selectedFile === null) return bgPlaceholder;   // 파일 placeholder 상태 (업로드 전)
    if (step === 1 && selectedFile) return bgPreview;                // 파일 미리보기 상태 (업로드 후)
    if (step === 2) return bgConfirmation;                           // 정보 확인 화면
    if (step === 3) return bgSuccess;                                // 로그인 성공 화면
  };

  // 현재 단계에 따라 렌더링할 컴포넌트 결정
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <QRUpload
            onNext={handleNext}
            setUserInfo={setUserInfo}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        );
      case 2:
        return <Confirmation userInfo={userInfo} onNext={handleNext} />;
      case 3:
        return <Success />;
      default:
        return null;
    }
  };

  return (
    <div
      className="signup-wrapper"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
      }}
    >
      {/* 상단 진행 상태 인디케이터 */}
      <div className="step-indicator">
        <img src={step === 1 ? step1Active : step1Inactive} alt="step1" />
        <img src={step === 2 ? step2Active : step2Inactive} alt="step2" />
        <img src={step === 3 ? step3Active : step3Inactive} alt="step3" />
      </div>

      {/* 현재 단계 컴포넌트 */}
      {renderStep()}
    </div>
  );
  
};

export default Signup;