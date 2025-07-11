import React, { useState } from 'react';
import QRUpload from './components/QRUpload';
import Confirmation from './components/Confirmation';
import Success from './components/Success';
import './Signup.css';

// 뒤로가기
import arrowBackIcon from './assets/icon-back.svg';

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
  const [selectedFile, setSelectedFile] = useState(null);

  // 업로드 단계 진입 여부 상태 (QRUpload가 조작)
  const [isReadyToUpload, setIsReadyToUpload] = useState(false);

  // 다음 단계로 이동하는 메서드
  const handleNext = () => {
    setStep((prev) => prev + 1);
  };


  // 현재 단계 및 파일 업로드 상태에 따라 배경 이미지를 동적으로 결정
  const getBackgroundImage = () => {
    if (step === 1 && !isReadyToUpload) return bgStart; // 진입 전
    if (step === 1 && isReadyToUpload && !selectedFile) return bgPlaceholder;
    if (step === 1 && selectedFile) return bgPreview;
    if (step === 2) return bgConfirmation;
    if (step === 3) return bgSuccess;
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
            isReadyToUpload={isReadyToUpload}
            setIsReadyToUpload={setIsReadyToUpload}
          />
        );
      case 2:
        return (
        <Confirmation
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        selectedFile={selectedFile}
        onNext={handleNext} />
        );
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

      {/* ← 뒤로가기 버튼 */}
      {(step > 1 || (step === 1 && isReadyToUpload)) && (
        <button
          className="back-button"
          onClick={() => {
            if (step === 3) {
              setStep(2);
            } else if (step === 2) {
              setStep(1);
              setIsReadyToUpload(true); // 사진 업로드 상태 유지
            } else if (step === 1 && isReadyToUpload) {
              setSelectedFile(null);
              setIsReadyToUpload(false);
            }
          }}
        >
          <img src={arrowBackIcon} alt="뒤로가기" />
        </button>
      )}

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