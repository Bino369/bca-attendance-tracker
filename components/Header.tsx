
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  isOffline?: boolean;
}

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CloudOfflineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
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

export function Header({ isOffline }: HeaderProps) {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
            <div className="flex-shrink-0">
                <CalendarIcon />
            </div>
            <div className="flex items-center gap-3">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
                    BCA Batch B
                </h1>
                {isOffline && (
                    <div className="flex items-center bg-amber-500/20 border border-amber-200/40 text-amber-50 rounded-md px-2 py-1 text-xs font-bold animate-pulse shadow-sm backdrop-blur-sm" title="Offline Mode: Changes are saved locally">
                        <span className="mr-1"><CloudOfflineIcon /></span>
                        <span className="hidden sm:inline">OFFLINE</span>
                    </div>
                )}
            </div>
        </div>
        <RealTimeClock />
      </div>
    </header>
  );
}
