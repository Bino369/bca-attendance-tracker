import React from 'react';
import { TIME_SLOTS } from '../constants';

interface TimeSlotSelectorProps {
  onSelectTimeSlot: (timeSlot: string) => void;
}

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export function TimeSlotSelector({ onSelectTimeSlot }: TimeSlotSelectorProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-700 mb-4">Select Class Hour</h3>
      <div className="grid grid-cols-1 gap-2">
        {TIME_SLOTS.map(timeSlot => (
          <button
            key={timeSlot}
            onClick={() => onSelectTimeSlot(timeSlot)}
            className="group flex items-center w-full text-left p-3 text-base font-semibold text-primary hover:text-white bg-teal-50 hover:bg-primary border border-transparent hover:border-primary rounded-lg transition-all duration-200 ease-in-out"
          >
            <ClockIcon />
            {timeSlot}
          </button>
        ))}
      </div>
    </div>
  );
}