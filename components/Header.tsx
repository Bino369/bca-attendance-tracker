
import React, { useState, useEffect } from 'react';

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end text-white min-w-[90px]">
      <div className="text-sm sm:text-lg font-mono font-bold leading-tight">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="text-[10px] sm:text-xs text-teal-100 font-medium">
        {time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
};

export function Header() {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
            <div className="flex-shrink-0">
                <CalendarIcon />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
            BCA Batch B
            </h1>
        </div>
        <RealTimeClock />
      </div>
    </header>
  );
}
