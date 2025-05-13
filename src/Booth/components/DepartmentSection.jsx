import React, { useState } from 'react';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import { ReactComponent as ClockIcon } from '../../assets/Clock.svg';
import { ReactComponent as CheckIcon } from '../../assets/Check.svg';
import './DepartmentSection.css';

const DEPARTMENT_LAYOUT = [
  { num: 4,  style: { top: '0%',  left: '5%'  } },
  { num: 5,  style: { top: '0%',  left: '25%' } },
  { num: 6,  style: { top: '0%',  left: '40%' } },
  { num: 7,  style: { top: '0%',  left: '55%' } },
  { num: 8,  style: { top: '0%',  left: '70%' } },
  { num: 9,  style: { top: '0%',  left: '90%' } },
  { num: 3,  style: { top: '20%', left: '5%'  } },
  { num: 13, style: { top: '30%', left: '25%' } },
  { num: 14, style: { top: '30%', left: '40%' } },
  { num: 15, style: { top: '30%', left: '55%' } },
  { num: 16, style: { top: '30%', left: '70%' } },
  { num: 10, style: { top: '20%', left: '90%' } },
  { num: 2,  style: { top: '40%', left: '5%'  } },
  { num: 11, style: { top: '40%', left: '90%' } },
  { num: 12, style: { top: '60%', left: '90%' } },
  { num: 1,  style: { top: '60%', left: '5%'  } },
  { num: 17, style: { top: '60%', left: '40%' } },
  { num: 18, style: { top: '60%', left: '55%' } },
];

const DEPARTMENT_LIST = [
  '디지털미디어학과', '미래산업융합대학', '산업디자인학과',
  '소프트웨어융합학과', '정보보호학과', '데이터사이언스학과',
  '경영학과', '국어국문학과', '신소재화학과', '미래산업융합대학',
  '산업디자인학과', '소프트웨어융합학과', '정보보호학과',
  '데이터사이언스학과', '경영학과', '국어국문학과',
  '화학과', '영문학과'
];

const DepartmentSection = () => {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [completedBooths, setCompletedBooths] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const openCompleteModal = num => {
    setSelectedBooth(num);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleModalComplete = () => {
    setCompletedBooths(prev =>
      prev.includes(selectedBooth)
        ? prev.filter(x => x !== selectedBooth)
        : [...prev, selectedBooth]
    );
    setShowModal(false);
  };

  return (
    <div className="dept-section">
      <div className="dept-layout">
        {DEPARTMENT_LAYOUT.map(({ num, style }) => (
          <div
            key={num}
            className={[
              'booth-cell',
              selectedBooth === num ? 'selected' : '',
              completedBooths.includes(num) ? 'completed' : ''
            ].join(' ')}
            style={style}
            onClick={() => setSelectedBooth(prev => (prev === num ? null : num))}
          >
            <StarIcon className="booth-icon" />
            <span className="booth-label">{num}</span>
          </div>
        ))}
      </div>

      {selectedBooth ? (
        <div className="selection-info-detail">
          <ul className="detail-list">
            <li className="booth-name">
              <span className="index">{selectedBooth}.</span>
              {DEPARTMENT_LIST[selectedBooth - 1]}
            </li>
            <li className="booth-status">
              <ClockIcon className="clock-icon" />
              <span className="status-text">운영중</span>
              <span className="status-dot" />
            </li>
          </ul>
          <div className="detail-action">
            {completedBooths.includes(selectedBooth) ? (
              <div onClick={() => setSelectedBooth(null)}>
                <CheckIcon className="check-icon-completed" />
              </div>
            ) : (
              <button
                className="complete-btn-detail"
                onClick={() => openCompleteModal(selectedBooth)}
              >
                체험 완료
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <h3 className="booth-list-title">부스 목록</h3>
          <div className="booth-list-container">
            <ul className="booth-list-col">
              {DEPARTMENT_LIST.slice(0, 9).map((name, idx) => (
                <li key={idx}>
                  <span className="booth-list-index">{idx + 1}.</span>
                  {name}
                </li>
              ))}
            </ul>
            <ul className="booth-list-col">
              {DEPARTMENT_LIST.slice(9).map((name, idx) => (
                <li key={idx + 9}>
                  <span className="booth-list-index">{idx + 10}.</span>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {showModal && (
        <div className="bottom-sheet">
          <div className="complete-modal">
            <div className="modal-header">
              <h3>✔️ 체험 완료 처리</h3>
            </div>
            <div className="modal-body">
                <p>부스 활동은 즐거우셨나요?</p>
                <p>체험 완료 처리를 해주세요!</p>
            </div>
            <div className="modal-actions">
              <button className="btn-close" onClick={handleModalClose}>
                닫기
              </button>
              <button className="btn-confirm" onClick={handleModalComplete}>
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentSection;