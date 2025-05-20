import React from 'react';
import api from '../../api/axios';
import '../Signup.css';
import placeholderImage from '../assets/image-placeholder.svg';

const QRUpload = ({
  onNext,
  setUserInfo,
  selectedFile,
  setSelectedFile,
  isReadyToUpload,
  setIsReadyToUpload,
}) => {
  const [error, setError] = React.useState('');        // 에러 메시지 상태
  const [loading, setLoading] = React.useState(false); // 로딩 중 여부

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);  // 상위 상태로 선택된 파일 저장
      setError('');
    }
  };

  // 첫 화면에서 '다음으로' 버튼 클릭 -> 업로드 모드 진입
  const handleInitialClick = () => {
    setIsReadyToUpload(true);
  };

  // '사진 업로드' 버튼 클릭 시 실행
  const handleSubmit = async () => {
    if (!selectedFile) {
      // 파일이 선택되지 않은 경우 파일 선택 다이얼로그 열기
      document.getElementById('qr-upload').click();
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // OCR API 요청
      const response = await api.post('/user/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 백엔드로부터 받은 한글 키 -> 영어 키로 변환 후 상위 컴포넌트로 전달
      const { 아이디, 이름, 소속 } = response.data;
      setUserInfo({
        student_num: 아이디,
        name: 이름,
        major: 소속,
      });

      // 다음 단계로 이동 (정보 확인 화면)
      onNext();
    } catch (error) {
      // 에러 처리
      if (error.response?.status === 403) {
        setError('학생증이 인식되지 않았습니다. 올바른 사진을 넣어주세요.');
      } else {
        setError('QR 인증 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
      console.error('OCR Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-upload-wrapper">
      <div className="qr-upload-content">
        {/* 제목 */}
        <h2 className="qr-upload-title">도서관 이용증 (QR) 업로드</h2>
        {/* 설명 */}
        <p className="qr-upload-description">
          도서관 앱의 모바일 이용증 화면을 캡처 후,<br />
          캡처 화면을 업로드 해주세요.
        </p>

        {/* 업로드 박스: 다음으로 버튼 누른 후에 등장 */}
        {isReadyToUpload && (
          <div className="qr-upload-box">
            {/* 업로드 전: placeholder 표시 */}
            {!selectedFile ? (
              <label
                htmlFor="qr-upload"
                className="qr-upload-placeholder"
                style={{ backgroundImage: `url(${placeholderImage})` }}
              />
            ) : (
              // 업로드 후: 미리보기 이미지 표시
              // 미리보기 이미지에도 label 기능 추가하여 클릭 시 새 파일 선택 가능하게 함
              <label htmlFor="qr-upload" className="qr-upload-preview-container" style={{ cursor: 'pointer' }}>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="preview"
                  className="qr-upload-preview"
                />
                {error && (
                  <div className="qr-upload-reupload-overlay">
                    <span>다시 업로드하기</span>
                  </div>
                )}
              </label>
            )}
            <input
              id="qr-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="qr-upload-input"
            />
          </div>
        )}

        {/* 에러 메시지 */}
        {error && <p className="qr-upload-error">{error}</p>}

        {/* 하단 버튼 */}
        <div className="qr-upload-button-container">
          {!isReadyToUpload ? (
            <button className="form-button" onClick={handleInitialClick}>
              다음으로
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="form-button"
            >
              {loading ? '처리중...' : '사진 업로드'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRUpload;