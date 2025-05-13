import React from 'react';
import TopTabs from '../components/TopTabs';
import TodayBanner from './components/TodayBanner';

import './PerformPage.css';

export default function PerformPage() {
  const banners = [
    {
      header: '지금 하고있는 공연',
      event: 'SWURS',
      time: '15:00-15:30',
    },
  
  ];

  return (
    <div className="perform-page">
      <TopTabs />
      <TodayBanner banners={banners} />
    </div>
  );
}
