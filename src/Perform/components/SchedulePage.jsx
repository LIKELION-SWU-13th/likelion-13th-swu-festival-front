import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ReactComponent as ExclamationIcon } from '../../assets/iconoir_exclamation.svg';
import { ReactComponent as DesignMockup } from '../../assets/design-mockup.svg';
import ScheduleDetailModal from './ScheduleDetailModal';
import './SchedulePage.css';

import sorimadang from '../images/sorimadang.png';
import sel from '../images/sel.jpg';
import hyeyum from '../images/hyeyum.jpg';
import swurs from '../images/swurs.jpg';
import chug from '../images/chug.jpg';
import sake from '../images/sake.jpg';
import tippsy from '../images/tippsy.jpg';

// 동아리 공연 스케줄 데이터
export const scheduleData = [
  { date: '22', day: '목', start: '18:40', end: '20:20', title: '소리마당', description: `폭넓은 음악을 다루는 서울여대 중앙 노래패 밴드!\n서울여대 중앙 노래패 밴드로 위로와 공감의 음악을 합니다.`, imageUrl: sorimadang },
  { date: '22', day: '목', start: '18:00', end: '20:20', title: 'S.E.L', description: `서울여대 유일무이 중앙 락밴드! S.E.L.\n다채로운 락 사운드로 심장을 울리는 무대를 선사합니다.`, imageUrl: sel },
  { date: '22', day: '목', start: '18:00', end: '20:20', title: '한혜윰', description: `생각을 춤으로, 춤을 꿈으로!\n서울여대 탈춤 동아리로 50년 역사의 전통을 자랑합니다.`, imageUrl: hyeyum },
  { date: '23', day: '금', start: '15:00', end: '16:00', title: 'SWURS 응원대제전', description: `서울여대의 꽃, 막힘없이 피어라!\n서울여자대학교 응원단 동아리 SWURS`, imageUrl: swurs },
  { date: '23', day: '금', start: '16:30', end: '17:30', title: '청천벽력', description: `서울여대 유일무이 중앙 풍물패! 청천벽력`, imageUrl: chug },
  { date: '23', day: '금', start: '18:00', end: '19:00', title: 'S.A.K.E', description: `서울여대 유일 재즈 댄스 퍼포먼스 동아리! S.A.K.E.`, imageUrl: sake },
  { date: '23', day: '금', start: '19:30', end: '20:30', title: 'TIPSSY', description: `서울여대 유일 스트릿 댄스 동아리! TIPSSY`, imageUrl: tippsy },
];

// 네비게이션에 표시할 날짜 목록
const festivalDates = [
  { date: '21', day: '수' },
  { date: '22', day: '목' },
  { date: '23', day: '금' },
];

// 아티스트 ID 매핑
const artistIdMap = {
  '주창윤 교수님': 'juchang',
  '유다빈 밴드': 'yudabin',
  '이채연': 'ichaeyeon',
};

export default function SchedulePage({ guestSchedules }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramDate = searchParams.get('date');
  const defaultDate = festivalDates[0].date;
  const [selectedDate, setSelectedDate] = useState(paramDate || defaultDate);
  const [isOpen, setIsOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  // 날짜 선택 시 URL 쿼리 동기화
  useEffect(() => {
    setSearchParams({ date: selectedDate });
  }, [selectedDate, setSearchParams]);

  const filteredEvents = scheduleData.filter(item => item.date === selectedDate);
  const selectedArtist = guestSchedules.find(gs => gs.date === selectedDate);
  const artistRouteId = selectedArtist ? artistIdMap[selectedArtist.event] : null;

  return (
    <div className="schedule-page">
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

      <div className="schedule-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((item, idx) => (
            <div key={idx} className="event-card" onClick={() => { setModalEvent(item); setIsOpen(true); }}>
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

      <h2 className="section-title">
        {selectedDate === '21' ? '서랑제 특별 토크 콘서트' : '오늘의 아티스트'}
      </h2>

      {selectedArtist ? (
        <div className="artist-card">
          <img src={selectedArtist.imageUrl} alt={selectedArtist.event} className="artist-img" />
          <div className="artist-info">
            <div className="artist-header">{selectedArtist.event}</div>
            <div className={
              selectedDate === '21'
                ? 'artist-time artist-time-special'
                : 'artist-time'
            }>
              {selectedArtist.time}
            </div>
          </div>

          {artistRouteId ? (
            <Link to={`/artist/${artistRouteId}?date=${selectedDate}`} style={{ textDecoration: 'none' }}>
              <button className="artist-button">
                {selectedArtist.event === '주창윤 교수님'
                  ? '블로그 아카이빙 보기'
                  : '대표곡 정보 보기'}
              </button>
            </Link>
          ) : (
            <button className="artist-button" disabled>
              {selectedArtist.event === '주창윤 교수님'
                ? '블로그 아카이빙 보기'
                : '대표곡 정보 보기'}
            </button>
          )}
        </div>
      ) : (
        <div className="no-events">
          {selectedDate === '21'
            ? '해당 날짜에 토크쇼 일정이 없습니다.'
            : '해당 날짜에 아티스트 일정이 없습니다.'}
        </div>
      )}

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