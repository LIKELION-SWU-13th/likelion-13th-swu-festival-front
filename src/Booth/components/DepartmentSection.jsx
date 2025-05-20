// src/Booth/components/DepartmentSection.jsx

import React, { useState, useEffect } from 'react';
import { ReactComponent as ClockIcon } from '../../assets/Clock.svg';
import { ReactComponent as CheckIcon } from '../../assets/Check.svg';
import { ReactComponent as StarIcon } from '../../assets/iconoir_bright-star.svg';
import instance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './DepartmentSection.css';

// 날짜별 블록 레이아웃 정의
const LAYOUTS = [
  // 5/21 레이아웃
  [
    { id: 'left',       numbers: [10,9,8,7,6,5,4,3,2,1], style: { top:'0%', left:'5%',  width:'40px',  height:'240px', flexDirection:'column' } },
    { id: 'middle-top', numbers: [13,14,15,16,17],  style: { top:'0%', left:'30%', transform:'translateX(-50%)', width:'150px', height:'40px', flexDirection:'row' } },
    { id: 'middle',     numbers: [11,12],           style: { top:'20%', left:'40%', transform:'translateX(-50%)', width:'80px', height:'40px', flexDirection:'row' } },
    { id: 'right',      numbers: [18,19,20,21,22,23,24,25,26], style:{top:'0%', left:'85%', transform:'translateX(-100%)', width:'40px', height:'240px', flexDirection:'column'} },
  ],
  // 5/22 레이아웃
  [
    { id: 'left',       numbers: [9,8,7,6,5,4,3,2,1], style: { top:'0%', left:'5%',  width:'40px',  height:'240px', flexDirection:'column' } },
    { id: 'center',     numbers: [10,11,12,13,14], style: { top:'40%', left:'29%', transform:'translateX(-50%)', width:'150px', height:'40px', flexDirection:'row' } },
    { id: 'middle',     numbers: [15,16,17,18,19,20,21], style: { top:'20%', left:'22%', transform:'translateX(-50%)', width:'200px', height:'40px', flexDirection:'row' } },
    { id: 'middle-top', numbers: [22,23,24,25,26],  style: { top:'0%', left:'29%', transform:'translateX(-50%)', width:'150px', height:'40px', flexDirection:'row' } },
    { id: 'right',      numbers: [27,28,29,30,31,32,33,34,35], style:{top:'0%', left:'85%', transform:'translateX(-100%)', width:'40px', height:'240px', flexDirection:'column'} },
  ],
  // 5/23 레이아웃
  [
    { id: 'left',       numbers: [9,8,7,6,5,4,3,2,1], style: { top:'0%', left:'5%',  width:'40px',  height:'240px', flexDirection:'column' } },
    { id: 'center',     numbers: [10], style: { top:'40%', left:'43%', transform:'translateX(-50%)', width:'60px', height:'40px', flexDirection:'row' } },
    { id: 'middle',     numbers: [11,12,13,14,15,16,17], style: { top:'20%', left:'22%', transform:'translateX(-50%)', width:'200px', height:'40px', flexDirection:'row' } },
    { id: 'middle-top', numbers: [18,19,20,21,22,23],  style: { top:'0%', left:'25%', transform:'translateX(-50%)', width:'180px', height:'40px', flexDirection:'row' } },
    { id: 'right',      numbers: [24,25,26,27,28,29,30,31,32,33], style:{top:'0%', left:'85%', transform:'translateX(-100%)', width:'40px', height:'240px', flexDirection:'column'} },
  ],
];

export default function DepartmentSection() {
  const navigate = useNavigate();
  const [departmentList, setDepartmentList]   = useState([]);
  const [completedBooths, setCompletedBooths] = useState([]);
  const [majorName, setMajorName]             = useState('');
  const [selectedBlock, setSelectedBlock]     = useState(null);
  const [activeBooth, setActiveBooth]         = useState(null);
  const [showModal, setShowModal]             = useState(false);

  // 날짜 매핑
  const days = [
    { date:'5/21 수요일', label:'Day 1' },
    { date:'5/22 목요일', label:'Day 2' },
    { date:'5/23 금요일', label:'Day 3' },
  ];
  const todayDate = new Date().getDate();
  const todayIndex = todayDate === 21 ? 0
                   : todayDate === 22 ? 1
                   : todayDate === 23 ? 2
                   : 0;
  const today = days[todayIndex];
  const BLOCK_LAYOUT = LAYOUTS[todayIndex];

  // 운영 상태 계산
  const now     = new Date();
  const hours   = now.getHours();
  const minutes = now.getMinutes();
  const statusText = hours < 11
    ? '운영전'
    : (hours > 16 || (hours === 16 && minutes >= 30))
      ? '운영 종료'
      : '운영중';

  // 데이터 로드
  useEffect(() => {
    // 로컬스토리지에 토큰 확인
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/signup');
      return;
    }
    // 부스 정보 호출
    instance.get('/booth/info')
      .then(res => {
        const { department_list, major } = res.data;
        setDepartmentList(department_list);
        setMajorName(major);
      })
      .catch(console.error);

    // 완료된 부스 호출
    instance.get('/booth/complete')
      .then(res => setCompletedBooths(res.data))
      .catch(console.error);
  }, [navigate]);

  // 블록 클릭 핸들러
  const onBlockClick = block => {
    setSelectedBlock(prev => prev?.id === block.id ? null : block);
    setActiveBooth(null);
    setShowModal(false);
  };

  // 선택된 블록 내 부스 번호 정렬
  const getRenderNumbers = () => selectedBlock
    ? [...selectedBlock.numbers].sort((a, b) => a - b)
    : [];

  // 모달 핸들링
  const openCompleteModal = num => { setActiveBooth(num); setShowModal(true); };
  const closeModal        = ()  => setShowModal(false);
  const confirmComplete   = ()  => {
    instance.post(`/booth/${activeBooth}/participate`)
      .then(() => setCompletedBooths(prev => [...prev, activeBooth]))
      .catch(console.error)
      .finally(() => setShowModal(false));
  };

  // 좌우 리스트 분할
  const mid = Math.ceil(departmentList.length / 2);
  const leftList  = departmentList.slice(0, mid);
  const rightList = departmentList.slice(mid);

  return (
    <div className="dept-section">
      {/* 헤더 */}
      <div className="header-wrapper">
        <div className="dept-header">
          <span className="day-pill">{today.label}</span>
          <span className="date-text">{today.date}</span>
        </div>
      </div>

      {/* 레이아웃 영역 */}
      <div className="dept-layout">
        {BLOCK_LAYOUT.map(block => (
          <div
            key={block.id}
            className={`block-cell ${selectedBlock?.id === block.id ? 'block-selected' : ''}`}
            style={{
              position: 'absolute',
              top: block.style.top,
              left: block.style.left,
              width: block.style.width,
              height: block.style.height,
              display: 'flex',
              flexDirection: block.style.flexDirection
            }}
            onClick={() => onBlockClick(block)}
          >
            {block.numbers.map(n => (
              <span key={n} className="block-number">{n}</span>
            ))}
          </div>
        ))}
      </div>

      {/* 부스 목록 */}
      <h3 className="booth-list-title">부스 목록</h3>

      {!selectedBlock ? (
        <div className="text-list-container">
          <ul className="text-list-col">
            {leftList.map((name, idx) => (
              <li key={idx} className="text-list-item">
                <span className="text-list-index">{idx + 1}&nbsp;</span>
                {name}
                {name === majorName && <StarIcon className="star-icon" />}
              </li>
            ))}
          </ul>
          <ul className="text-list-col">
            {rightList.map((name, idx) => (
              <li key={idx + mid} className="text-list-item">
                <span className="text-list-index">{idx + mid + 1}&nbsp;</span>
                {name}
                {name === majorName && <StarIcon className="star-icon" />}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="booth-list-container">
          {getRenderNumbers().map(num => {
            const name = departmentList[num - 1] || '로딩 중…';
            const done = completedBooths.includes(num);
            return (
              <div key={num} className="booth-card">
                <div className="card-header">
                  <span className="card-index">{num}</span>
                  <span className="card-name">
                    {name}
                    {name === majorName && <StarIcon className="star-icon-small" />} 
                  </span>
                </div>
                <div className="card-status">
                  <ClockIcon className="clock-icon" />
                  <span>{statusText}</span>
                  <span className={`status-dot ${statusText === '운영중' ? '' : 'dot-inactive'}`} />
                </div>
                <div className="card-action">
                  {done ? (
                    <CheckIcon className="check-icon-completed" />
                  ) : (
                    <button className="complete-btn-detail" onClick={() => openCompleteModal(num)}>
                      체험 완료
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 완료 모달 */}
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
              <button className="btn-close" onClick={closeModal}>닫기</button>
              <button className="btn-confirm" onClick={confirmComplete}>완료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
