
import React, { useState, useEffect } from 'react';
import type { Student, AttendanceRecord } from '../types';

interface AttendanceSheetProps {
  date: Date;
  timeSlot: string;
  students: Student[];
  attendanceData: AttendanceRecord[];
  updateAttendance: (studentId: string, present: boolean) => void;
}

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      <span className={`ml-3 text-sm font-medium w-16 ${checked ? 'text-primary' : 'text-red-500 font-bold'}`}>
        {checked ? 'Present' : 'Absent'}
      </span>
    </label>
  );
};

export function AttendanceSheet({ date, timeSlot, students, attendanceData, updateAttendance }: AttendanceSheetProps) {
  const formattedDate = date.toISOString().split('T')[0];
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const initialData: Record<string, boolean> = {};
    students.forEach(student => {
        const record = attendanceData.find(
          r => r.studentId === student.id && r.date === formattedDate && r.timeSlot === timeSlot
        );
        initialData[student.id] = record ? record.present : true;
    });
    setCurrentAttendance(initialData);
    setHasChanges(false);
    setIsSubmitted(false);
  }, [date, timeSlot, students, attendanceData, formattedDate]);

  const handleToggleChange = (studentId: string, present: boolean) => {
    setCurrentAttendance(prev => ({
        ...prev,
        [studentId]: present
    }));
    if (!hasChanges) {
      setHasChanges(true);
    }
  };

  const handleSubmit = () => {
    Object.keys(currentAttendance).forEach((studentId) => {
        updateAttendance(studentId, currentAttendance[studentId]);
    });

    setHasChanges(false);
    setIsSubmitted(true);
  };

  const totalStudents = students.length;
  const presentCount = students.filter(s => currentAttendance[s.id] ?? true).length;
  const absentCount = totalStudents - presentCount;

  if (isSubmitted) {
     return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
             <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-1 text-gray-800">Attendance Sheet</h2>
                      <p className="text-base sm:text-lg text-gray-600 font-medium">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                   <div className="flex items-center bg-teal-50 text-primary px-4 py-2 rounded-full font-medium text-sm border border-teal-100">
                      <ClockIcon/>
                      {timeSlot}
                  </div>
                </div>
              </div>

             <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Attendance Saved!</h3>
                <p className="text-gray-500 mb-8">The attendance records for this session have been successfully stored.</p>

                <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-10">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center">
                        <span className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Total</span>
                        <span className="text-2xl font-bold text-blue-800">{totalStudents}</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center">
                        <span className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1">Present</span>
                        <span className="text-2xl font-bold text-green-800">{presentCount}</span>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center">
                        <span className="text-red-600 text-xs font-bold uppercase tracking-wider mb-1">Absent</span>
                        <span className="text-2xl font-bold text-red-800">{absentCount}</span>
                    </div>
                </div>

                <button 
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 text-sm font-semibold text-primary bg-teal-50 hover:bg-teal-100 rounded-full transition-colors"
                >
                    Edit Attendance
                </button>
            </div>
        </div>
     );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-4 sm:p-6 pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
          <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1 text-gray-800">Attendance Sheet</h2>
              <p className="text-base sm:text-lg text-gray-600 font-medium">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
           <div className="flex items-center bg-teal-50 text-primary px-4 py-2 rounded-full font-medium text-sm border border-teal-100">
              <ClockIcon/>
              {timeSlot}
          </div>
        </div>
      </div>

      {/* Sticky Stats Dashboard */}
      <div className="sticky top-[4.5rem] z-30 bg-white/95 backdrop-blur-sm border-y border-gray-100 px-4 sm:px-6 py-4 shadow-sm transition-all">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-100 flex flex-col items-center justify-center">
              <div className="flex items-center text-blue-600 mb-1">
                  <UsersIcon />
                  <span className="ml-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-blue-800">{totalStudents}</span>
          </div>
          <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-100 flex flex-col items-center justify-center">
               <div className="flex items-center text-green-600 mb-1">
                  <CheckCircleIcon />
                  <span className="ml-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Present</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-green-800">{presentCount}</span>
          </div>
          <div className={`p-2 sm:p-3 rounded-lg border flex flex-col items-center justify-center transition-colors duration-300 ${absentCount > 0 ? 'bg-red-100 border-red-200 animate-pulse-slow' : 'bg-gray-50 border-gray-100'}`}>
               <div className={`flex items-center mb-1 ${absentCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                  <XCircleIcon />
                  <span className="ml-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Absent</span>
              </div>
               <span className={`text-xl sm:text-2xl font-bold ${absentCount > 0 ? 'text-red-800' : 'text-gray-500'}`}>{absentCount}</span>
          </div>
       </div>
      </div>
      
      <div className="p-4 sm:p-6 flex-grow">
        <div className="space-y-2">
          {students.map(student => {
            const isPresent = currentAttendance[student.id] ?? true;

            return (
              <div key={student.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${isPresent ? 'bg-white border-transparent hover:bg-gray-50' : 'bg-red-50 border-red-100 shadow-sm'}`}>
                <div className="flex items-center overflow-hidden">
                   <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 transition-colors ${isPresent ? 'bg-teal-100 text-teal-800' : 'bg-red-200 text-red-800'}`}>
                     {student.rollNo}
                   </div>
                   <span className={`font-medium truncate text-sm sm:text-base ${isPresent ? 'text-gray-800' : 'text-red-800'}`}>{student.name}</span>
                </div>
                <Toggle 
                  checked={isPresent} 
                  onChange={(present) => handleToggleChange(student.id, present)}
                />
              </div>
            );
          })}
        </div>

         <div className="mt-8 flex justify-end items-center space-x-4 sticky bottom-4 z-20">
          <button
            onClick={handleSubmit}
            disabled={!hasChanges}
            className="bg-primary hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
