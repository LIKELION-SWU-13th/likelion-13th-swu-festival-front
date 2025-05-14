import React, { useState, useRef } from 'react';
import { ReactComponent as ExclamationIcon } from '../../assets/iconoir_exclamation.svg';
import ScheduleDetailModal from './ScheduleDetailModal';
import './SchedulePage.css';

import img1_1 from '../images/1-1.png';

export const scheduleData = [
  // 21일 (수)
  {
    date: '21',
    day: '수',
    start: '18:00',
    end: '19:30',
    title: 'SWURS',
    description: '응원단의 꽃! 서울여대 응원단 SWURS...',
    imageUrl: img1_1,
    linkUrl: 'https://www.instagram.com/swurs_cheerteam?igsh=YXZjdWlhdHF4ejU4',
    linkLabel: '공연정보 바로가기 >',
    buttonLabel: '동아리 인스타그램 보러가기',
  },

  // 22일 (목)
  {
    date: '22',
    day: '목',
    start: '18:00',
    end: '18:40',
    title: '학우 버스킹',
    description: '서랑제 무대에서 청춘의 사랑을 나눌 학우분',
    imageUrl: img1_1,
    linkUrl: 'https://www.instagram.com/p/DJYzDOXNap9/?img_index=3&igsh=bnoyYXd0bGRxaHd5',
    linkLabel: '공연정보 바로가기 >',
    buttonLabel: '학구 버스킹 안내 보러가기',
  },
  {
    date: '22',
    day: '목',
    start: '18:40',
    end: '21:00',
    title: '동아리(밴드)',
    description: '서랑제 무대에서 청춘의 사랑을 나눌 학우분',
    imageUrl: img1_1,
    linkUrl: 'https://www.instagram.com/p/DJYzDOXNap9/?img_index=3&igsh=bnoyYXd0bGRxaHd5',
    linkLabel: '공연정보 바로가기 >',
    buttonLabel: '학구 버스킹 안내 보러가기',
  },


  // 23일 (금)
  {
    date: '23',
    day: '금',
    start: '15:00',
    end: '16:00',
    title: 'SWURS',
    description: '금요일 오후 에너지...',
    imageUrl: '/images/swurs.jpg',
    linkUrl: 'https://instagram.com/swurs_official',
    linkLabel: '공연정보 바로가기 >',
  },
  
];

const uniqueDates = Array.from(
  scheduleData.reduce((map, item) => map.set(item.date, item.day), new Map())
).map(([date, day]) => ({ date, day }));

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(uniqueDates[0].date);
  const [isOpen, setIsOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);
  const modalContainerRef = useRef(null);

  const filteredEvents = scheduleData.filter(
    (item) => item.date === selectedDate
  );

  const openModal = (eventData) => {
    setModalEvent(eventData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="schedule-page" ref={modalContainerRef}>
      {/* 공지 */}
      <div className="schedule-notice-inline">
        <ExclamationIcon className="notice-icon" />
        <span>
          현장 상황에 따라 시간은 조금씩 달라질 수 있습니다.
        </span>
      </div>

      {/* 날짜 내비 + 일정 리스트 */}
      <div className="schedule-body">
        <div className="date-nav">
          {uniqueDates.map(({ date, day }) => (
            <button
              key={date}
              className={`date-btn ${
                date === selectedDate ? 'active' : ''
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="date-number">{date}</span>
              <span className="date-day">{day}</span>
            </button>
          ))}
        </div>

        <div className="schedule-list">
          {filteredEvents.map((item, idx) => (
            <div key={idx} className="schedule-item">
              <div className="timeline-row">
                <div className="time-label">{item.start}</div>
                <div className="time-line" />
              </div>

              <div className="event-card">
                <div className="event-header">{item.title}</div>
                <div className="event-time">
                  {`${item.start}–${item.end}`}
                </div>
                <button
                  className="event-link"
                  onClick={() => openModal(item)}
                >
                  {item.linkLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {isOpen && modalEvent && (
        <ScheduleDetailModal
          isOpen={isOpen}
          onClose={closeModal}
          event={modalEvent}
        />
      )}
    </div>
  );
}
