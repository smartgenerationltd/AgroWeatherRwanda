
import React from 'react';

const Sunny = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle cx="32" cy="32" r="10" fill="currentColor"/>
      <line x1="32" y1="16" x2="32" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="44" x2="32" y2="48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="48" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="32" x2="16" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="43.8" y1="20.2" x2="41" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="23" y1="41" x2="20.2" y2="43.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="43.8" y1="43.8" x2="41" y2="41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="23" y1="23" x2="20.2" y2="20.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </g>
  </svg>
);

const Cloudy = () => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.7,29.3c-1.2-6-6.4-10.6-12.7-10.6c-4.4,0-8.3,2.2-10.6,5.6c-0.5-0.1-1-0.2-1.6-0.2c-5,0-9,4-9,9s4,9,9,9h24 c4.4,0,8-3.6,8-8C56,33.1,52.3,29.3,47.7,29.3z" fill="currentColor"/>
    </svg>
);

const PartlyCloudy = () => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="27" cy="27" r="8" fill="currentColor"/>
        <path d="M47.7,29.3c-1.2-6-6.4-10.6-12.7-10.6c-4.4,0-8.3,2.2-10.6,5.6c-0.5-0.1-1-0.2-1.6-0.2c-5,0-9,4-9,9s4,9,9,9h24 c4.4,0,8-3.6,8-8C56,33.1,52.3,29.3,47.7,29.3z" fill="currentColor"/>
    </svg>
);

const Rainy = () => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.7,29.3c-1.2-6-6.4-10.6-12.7-10.6c-4.4,0-8.3,2.2-10.6,5.6c-0.5-0.1-1-0.2-1.6-0.2c-5,0-9,4-9,9s4,9,9,9h24 c4.4,0,8-3.6,8-8C56,33.1,52.3,29.3,47.7,29.3z" fill="currentColor"/>
        <line x1="26" y1="48" x2="22" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="34" y1="48" x2="30" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="42" y1="48" x2="38" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const Stormy = () => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.7,29.3c-1.2-6-6.4-10.6-12.7-10.6c-4.4,0-8.3,2.2-10.6,5.6c-0.5-0.1-1-0.2-1.6-0.2c-5,0-9,4-9,9s4,9,9,9h24 c4.4,0,8-3.6,8-8C56,33.1,52.3,29.3,47.7,29.3z" fill="currentColor"/>
        <polyline points="31,48 27,52 31,52 29,58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="39,48 35,52 39,52 37,58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Snowy = () => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.7,29.3c-1.2-6-6.4-10.6-12.7-10.6c-4.4,0-8.3,2.2-10.6,5.6c-0.5-0.1-1-0.2-1.6-0.2c-5,0-9,4-9,9s4,9,9,9h24 c4.4,0,8-3.6,8-8C56,33.1,52.3,29.3,47.7,29.3z" fill="currentColor"/>
        <path d="M24,54l-2-2l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32,54l-2-2l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M40,54l-2-2l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const icons: { [key: string]: React.FC } = {
  Sunny,
  Cloudy,
  PartlyCloudy,
  Rainy,
  Stormy,
  Snowy,
};

export const WeatherIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
  const IconComponent = icons[iconName] || Cloudy;
  return <IconComponent />;
};
