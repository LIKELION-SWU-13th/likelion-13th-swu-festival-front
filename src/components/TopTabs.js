import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const TopTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: '부스', path: '/booth' },
    { name: '별별취향', path: '/constellation' },
    { name: '공연', path: '/perform' },
  ];

  return (
    <TabContainer>
      {tabs.map((tab) => (
        <Tab
          key={tab.name}
          active={location.pathname === tab.path}
          onClick={() => navigate(tab.path)}
        >
          {tab.name}
        </Tab>
      ))}
    </TabContainer>
  );
};

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
`;

const Tab = styled.button`
  background: ${props => props.active ? '#4A4E96' : 'transparent'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
`;

export default TopTabs; 