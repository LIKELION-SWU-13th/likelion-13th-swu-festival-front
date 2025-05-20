// src/Perform/PerformPage.jsx
import React, { useMemo } from 'react';
import TopTabs from '../../components/TopTabs';
import TodayBanner from '../components/TodayBanner';
import SchedulePage, { scheduleData } from '../components/SchedulePage';
import './PerformPage.css';

import juchang from '../images/juchang.png'
import yudabinImg from '../images/yudabin.png';
import ichaeyeonImg from '../images/ichaeyeon.png';

export default function PerformPage() {
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
    ? { header: '지금 하고 있는 공연', event: activeEvent.title, time: `${activeEvent.start}–${activeEvent.end}` }
    : { header: '서울여자대학교 사랑 대동제', event: '우리가 마음을 나누는 지금. 이곳에서', time: '5/21-23 11:00 - 21:30' };

  // 2) 오늘의 게스트
  const guestSchedules = [
    { date: '21', event: '주창윤 교수님', time: '18:00–19:30', imageUrl: juchang},
    { date: '22', event: '유다빈 밴드', time: '20:30–22:00', imageUrl: yudabinImg},
    { date: '23', event: '이채연', time: '20:00–21:00', imageUrl: ichaeyeonImg},
  ];

  // 3) TodayBanner에 넘길 배열
  const guestBanners = guestSchedules
    .filter(gs => gs.date === todayStr)
    .map(({ header, event, time }) => ({ header, event, time }));
  const banners = useMemo(() => [dynamicBanner, ...guestBanners], [dynamicBanner, guestBanners]);

  return (
    <div className="perform-page">
      
      {/* 1) 고정될 Header: TopTabs + TodayBanner */}
      <div className="header-wrapper">
        <TopTabs />
      </div>

      {/* 2) 이 영역만 스크롤 */}
      <div className="schedule-container">
        <SchedulePage guestSchedules={guestSchedules} />
      </div>
    </div>
  );
}
