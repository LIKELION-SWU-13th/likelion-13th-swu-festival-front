// src/components/DepartmentSection.jsx
import React, { useState, useEffect } from 'react';
import { ReactComponent as StarIcon } from '../../assets/Star.svg';
import { ReactComponent as ClockIcon } from '../../assets/Clock.svg';
import { ReactComponent as CheckIcon } from '../../assets/Check.svg';
import './DepartmentSection.css';

const DEPARTMENT_LAYOUT = [
  { num: 4,  style: { top: '0%',  left: '5%'  } },
  { num: 5,  style: { top: '0%',  left: '28%' } },
  { num: 6,  style: { top: '0%',  left: '41%' } },
  { num: 7,  style: { top: '0%',  left: '54%' } },
  { num: 8,  style: { top: '0%',  left: '67%' } },
  { num: 9,  style: { top: '0%',  left: '90%' } },
  { num: 3,  style: { top: '18%', left: '5%'  } },
  { num: 13, style: { top: '26%', left: '28%' } },
  { num: 14, style: { top: '26%', left: '41%' } },
  { num: 15, style: { top: '26%', left: '54%' } },
  { num: 16, style: { top: '26%', left: '67%' } },
  { num: 10, style: { top: '18%', left: '90%' } },
  { num: 2,  style: { top: '36%', left: '5%'  } },
  { num: 11, style: { top: '36%', left: '90%' } },
  { num: 12, style: { top: '54%', left: '90%' } },
  { num: 1,  style: { top: '54%', left: '5%'  } },
  { num: 17, style: { top: '54%', left: '41%' } },
  { num: 18, style: { top: '54%', left: '54%' } },
];

const DepartmentSection = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [completedBooths, setCompletedBooths] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 현재 시간에 따른 운영 상태 계산
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  let statusText;
  if (hours < 11) {
    statusText = '운영전';
  } else if (hours > 16 || (hours === 16 && minutes >= 30)) {
    statusText = '운영 종료';
  } else {
    statusText = '운영중';
  }

  // API에서 부서(부스) 목록 불러오기
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          'https://api.likelion13th-swu.site/booth/info',
          {
            method: 'GET',
            headers: {
              'Authorization':
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMDIyMTExMzY4IiwibmFtZSI6IuuCqOyYiOydgCIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NDcyNzI1NTIsImV4cCI6MTc0ODEzNjU1Mn0.ovlJ-iPMh0_bJTSNNLX5H-6KsrpEjGmhMJtalzlP2P0',
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setDepartmentList(data.department_list);
      } catch (error) {
        console.error('Failed to fetch department list:', error);
      }
    };
    fetchDepartments();
  }, []);

  const openCompleteModal = (num) => {
    setSelectedBooth(num);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalComplete = () => {
    setCompletedBooths((prev) =>
      prev.includes(selectedBooth)
        ? prev.filter((x) => x !== selectedBooth)
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
              completedBooths.includes(num) ? 'completed' : '',
            ].join(' ')}
            style={style}
            onClick={() => setSelectedBooth((prev) => (prev === num ? null : num))}
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
              {departmentList[selectedBooth - 1]}
            </li>
            <li className="booth-status">
              <ClockIcon className="clock-icon" />
              <span className="status-text">{statusText}</span>
              <span
                className={[
                  'status-dot',
                  statusText === '운영중' ? '' : 'dot-inactive',
                ].join(' ')}
              />
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
              {departmentList.slice(0, 9).map((name, idx) => (
                <li key={idx}>
                  <span className="booth-list-index">{idx + 1}.</span>
                  {name}
                </li>
              ))}
            </ul>
            <ul className="booth-list-col">
              {departmentList.slice(9).map((name, idx) => (
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