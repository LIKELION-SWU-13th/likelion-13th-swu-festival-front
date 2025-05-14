// src/Perform/PerformPage.jsx
import React, { useMemo } from 'react';
import TopTabs from '../../components/TopTabs';
import TodayBanner from '../components/TodayBanner';
import SchedulePage, { scheduleData } from '../components/SchedulePage';
import './PerformPage.css';

export default function PerformPage() {
  const banners = useMemo(() => {
    const now = new Date();
    const todayStr = String(now.getDate()).padStart(2, '0');

    // 1) “지금 진행 중인 공연” 배너
    const todayEvents = scheduleData.filter(item => item.date === todayStr);
    const activeEvent = todayEvents.find(evt => {
      const [sh, sm] = evt.start.split(':').map(Number);
      const [eh, em] = evt.end.split(':').map(Number);
      const start = new Date(); start.setHours(sh, sm, 0, 0);
      const end   = new Date(); end.setHours(eh, em, 0, 0);
      return now >= start && now <= end;
    });

    const dynamicBanner = activeEvent
      ? {
          header: '지금 하고 있는 공연',
          event: activeEvent.title,
          time: `${activeEvent.start}–${activeEvent.end}`,
        }
      : {
          header: '서울여자대학교 사랑 대동제',
          event: '우리가 마음을 나누는 지금. 이곳에서',
          time: '11:00 - 21:30',
        };

    // 2) “오늘의 게스트”를 여러 명 관리할 배열
    const guestSchedules = [
      {
        date: '21',
        header: '오늘의 토크쇼는?',
        event: '이채연',
        time: '20:00–21:00',
      },
      {
        date: '22',
        header: '오늘의 게스트는?',
        event: '유다빈 밴드',
        time: '20:00–21:00',
      },
      {
        date: '23',
        header: '오늘의 게스트는?',
        event: '이채연',
        time: '20:00–21:00',
      },

    ];

    // 오늘 날짜에 맞는 게스트를 모두 뽑아서 배너로 추가
    const guestBanners = guestSchedules
      .filter(gs => gs.date === todayStr)
      .map(({ header, event, time }) => ({ header, event, time }));

    // 최종 배열: 공연 배너 + (조건에 맞는) 게스트 배너들
    return [dynamicBanner, ...guestBanners];
  }, []);

  return (
    <div className="perform-page">
      <TopTabs />
      <TodayBanner banners={banners} />
      <SchedulePage />
    </div>
  );
}
