// SchedulePage.jsx
import React, { useState } from 'react';
import { ReactComponent as ExclamationIcon } from '../../assets/iconoir_exclamation.svg';
import { ReactComponent as DesignMockup }    from '../../assets/design-mockup.svg';
import ScheduleDetailModal from './ScheduleDetailModal';
import { Link } from 'react-router-dom';

import sorimadang from '../images/sorimadang.png';
import sel from '../images/sel.jpg';
import hyeyum from '../images/hyeyum.jpg';
import swurs from '../images/swurs.jpg';
import chug from '../images/chug.jpg';
import sake from '../images/sake.jpg';
import tippsy from '../images/tippsy.jpg';

import './SchedulePage.css';

// 동아리 공연 스케줄 데이터
export const scheduleData = [
  { date: '22', day: '목', start: '18:40', end: '20:20', title: '소리마당', imageUrl: sorimadang, linkUrl: 'https://www.instagram.com/sorimadang_swu/' },
  { date: '22', day: '목', start: '18:00', end: '20:20', title: 'S.E.L',       imageUrl: sel,         linkUrl: 'https://www.instagram.com/s.e.l.swu/' },
  { date: '22', day: '목', start: '18:00', end: '20:20', title: '한혜윰',      imageUrl: hyeyum,      linkUrl: 'https://www.instagram.com/hyeyumies/' },
  { date: '23', day: '금', start: '15:00', end: '16:00', title: 'SWURS 응원대제전', imageUrl: swurs,    linkUrl: 'https://www.instagram.com/swurs_cheerteam/' },
  { date: '23', day: '금', start: '16:30', end: '17:30', title: '청천벽력',    imageUrl: chug,        linkUrl: 'https://www.instagram.com/bolt_from_the_blue.swu/' },
  { date: '23', day: '금', start: '18:00', end: '19:00', title: 'S.A.K.E',      imageUrl: sake,        linkUrl: 'https://www.instagram.com/s.a.k.e._jazz/' },
  { date: '23', day: '금', start: '19:30', end: '20:30', title: 'TIPSSY',      imageUrl: tippsy,      linkUrl: 'https://www.instagram.com/tipssy_swu/' },
];

const festivalDates = [
  { date: '21', day: '수' },
  { date: '22', day: '목' },
  { date: '23', day: '금' },
];

const artistIdMap = {
  '박지현': 'parkjihyun',
  '유다빈 밴드': 'yudabin',
  '이채연': 'ichaeyeon'
};

export default function SchedulePage({ guestSchedules }) {
  const [selectedDate, setSelectedDate] = useState(festivalDates[0].date);
  const [isOpen, setIsOpen]         = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  const filteredEvents = scheduleData.filter(item => item.date === selectedDate);
  const selectedArtist = guestSchedules.find(gs => gs.date === selectedDate);
  const artistRouteId  = selectedArtist ? artistIdMap[selectedArtist.event] : null;

  return (
    <div className="schedule-page">
      {/* 1. 고정 헤더 */}
      <div className="schedule-header">
        <div className="date-nav">
          {festivalDates.map(({ date, day }) => (
            <button
              key={date}
              className={`date-btn ${date === selectedDate ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="date-number">{date}</span>
              <span className="date-day">{day}</span>
            </button>
          ))}
        </div>
        <h2 className="section-title">동아리 공연</h2>
      </div>

      {/* 2. 공연 리스트 */}
      <div className="schedule-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((item, idx) => (
            <div
              key={idx}
              className="event-card"
              onClick={() => { setModalEvent(item); setIsOpen(true); }}
            >
              <img src={item.imageUrl} alt={item.title} className="event-img" />
              <div className="event-info">
                <div className="event-header">{item.title}</div>
                <div className="event-time">{`${item.start}–${item.end}`}</div>
              </div>
              <DesignMockup className="event-arrow" />
            </div>
          ))
        ) : (
          <div className="no-events">해당 날짜에는 일정이 없습니다.</div>
        )}
      </div>

      <div className="schedule-notice-inline">
        <ExclamationIcon className="notice-icon" />
        <span>현장 상황에 따라 시간은 조금씩 달라질 수 있습니다.</span>
      </div>

      {/* 3. 오늘의 아티스트 / 토크쇼 */}
      <h2 className="section-title">
        {selectedDate === '21' ? '오늘의 토크쇼' : '오늘의 아티스트'}
      </h2>

      {selectedArtist ? (
        <div className="artist-card">
          <img
            src={selectedArtist.imageUrl}
            alt={selectedArtist.event}
            className="artist-img"
          />
          <div className="artist-info">
            <div className="artist-header">{selectedArtist.event}</div>
            <div className="artist-time">{selectedArtist.time}</div>
          </div>
          <button className="artist-button">
            {artistRouteId ? (
              <Link to={`/artist/${artistRouteId}`} className="artist-link">
                대표곡 정보 보기
              </Link>
            ) : (
              '대표곡 정보 보기'
            )}
          </button>
        </div>
      ) : (
        <div className="no-events">
          {selectedDate === '21'
            ? '해당 날짜에 토크쇼 일정이 없습니다.'
            : '해당 날짜에 아티스트 일정이 없습니다.'}
        </div>
      )}

      {/* 4. 모달 */}
      {isOpen && modalEvent && (
        <ScheduleDetailModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          event={modalEvent}
        />
      )}
    </div>
  );
}