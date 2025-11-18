
import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);


export function Calendar({ selectedDate, onDateChange }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const daysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
  
  const firstDayOfMonth = () => {
      return currentMonth.getDay();
  };

  const days = daysInMonth();
  const blanks = Array(firstDayOfMonth()).fill(null);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon /></button>
        <h2 className="text-lg font-semibold">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {weekDays.map(day => <div key={day} className="font-medium">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map(day => {
          const isSelected = selectedDate.toDateString() === day.toDateString();
          const isToday = new Date().toDateString() === day.toDateString();
          
          let classes = "w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 ";
          if (isSelected) {
            classes += "bg-primary text-white font-bold shadow-lg";
          } else if (isToday) {
            classes += "bg-pink-100 text-pink-600 font-semibold";
          } else {
            classes += "hover:bg-gray-200";
          }
          
          return (
            <div key={day.toString()} className={classes} onClick={() => onDateChange(day)}>
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
