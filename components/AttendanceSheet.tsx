
import React, { useState, useEffect, useMemo } from 'react';
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

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
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
  // Fix: Use local date parts to construct YYYY-MM-DD
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Auto-save state
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // UI State for absent list toggle
  const [showAbsentList, setShowAbsentList] = useState(false);

  const draftKey = `attendance_draft_${formattedDate}_${timeSlot}`;

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
    setAutoSaveStatus('idle');
    setShowAbsentList(false);

    // Check for existing draft
    const storedDraft = localStorage.getItem(draftKey);
    if (storedDraft) {
        setDraftAvailable(true);
    } else {
        setDraftAvailable(false);
    }
  }, [date, timeSlot, students, attendanceData, formattedDate, draftKey]);

  // Auto-save effect
  useEffect(() => {
    if (!hasChanges || isSubmitted) return;

    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify(currentAttendance));
        setAutoSaveStatus('saved');
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentAttendance, hasChanges, isSubmitted, draftKey]);

  const handleRestoreDraft = () => {
      const storedDraft = localStorage.getItem(draftKey);
      if (storedDraft) {
          try {
              const parsed = JSON.parse(storedDraft);
              setCurrentAttendance(parsed);
              setHasChanges(true);
              setDraftAvailable(false);
              setAutoSaveStatus('saved');
          } catch (e) {
              console.error("Failed to restore draft", e);
          }
      }
  };

  const handleDiscardDraft = () => {
      localStorage.removeItem(draftKey);
      setDraftAvailable(false);
  };

  const handleToggleChange = (studentId: string, present: boolean) => {
    setCurrentAttendance(prev => ({
        ...prev,
        [studentId]: present
    }));
    if (!hasChanges) {
      setHasChanges(true);
    }
    // If user interacts while draft prompt is showing, assume they want to proceed with current session
    if (draftAvailable) {
        setDraftAvailable(false);
    }
  };

  const handleSubmit = () => {
    Object.keys(currentAttendance).forEach((studentId) => {
        updateAttendance(studentId, currentAttendance[studentId]);
    });

    // Clear draft upon successful submission
    localStorage.removeItem(draftKey);

    setHasChanges(false);
    setIsSubmitted(true);
    setAutoSaveStatus('idle');
  };

  const totalStudents = students.length;
  
  // Derived state for real-time counts and list
  const { presentCount, absentCount, absentStudentsList } = useMemo(() => {
    let pCount = 0;
    const aList: Student[] = [];
    
    students.forEach(student => {
        const isPresent = currentAttendance[student.id] ?? true;
        if (isPresent) {
            pCount++;
        } else {
            aList.push(student);
        }
    });

    return {
        presentCount: pCount,
        absentCount: students.length - pCount,
        absentStudentsList: aList
    };
  }, [students, currentAttendance]);

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
          <button 
            onClick={() => absentCount > 0 && setShowAbsentList(!showAbsentList)}
            disabled={absentCount === 0}
            className={`relative p-2 sm:p-3 rounded-lg border flex flex-col items-center justify-center transition-colors duration-300 outline-none focus:ring-2 focus:ring-red-300 ${absentCount > 0 ? 'bg-red-50 border-red-200 cursor-pointer hover:bg-red-100' : 'bg-gray-50 border-gray-100 cursor-default'}`}
          >
               <div className={`flex items-center mb-1 ${absentCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                  <XCircleIcon />
                  <span className="ml-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Absent</span>
                  {absentCount > 0 && (showAbsentList ? <ChevronUpIcon /> : <ChevronDownIcon />)}
              </div>
               <span className={`text-xl sm:text-2xl font-bold transition-all ${absentCount > 0 ? 'text-red-800 scale-110' : 'text-gray-500'}`}>{absentCount}</span>
          </button>
       </div>
       
       {/* Collapsible Absent Student List */}
       {showAbsentList && absentCount > 0 && (
           <div className="mt-4 bg-red-50 rounded-lg border border-red-100 p-3 animate-fade-in">
                <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 border-b border-red-200 pb-1">Currently Absent ({absentCount})</h4>
                <div className="flex flex-wrap gap-2">
                    {absentStudentsList.map(student => (
                        <span key={student.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-red-800 border border-red-200 shadow-sm">
                            {student.rollNo}. {student.name}
                        </span>
                    ))}
                </div>
           </div>
       )}
      </div>
      
      <div className="p-4 sm:p-6 flex-grow relative">
        {draftAvailable && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-yellow-800">
                        <span className="font-bold">Unsaved draft found.</span> Do you want to continue where you left off?
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                        onClick={handleRestoreDraft}
                        className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-bold rounded border border-yellow-200 transition-colors"
                    >
                        <RefreshIcon /> Restore
                    </button>
                    <button 
                        onClick={handleDiscardDraft}
                        className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold rounded border border-gray-300 transition-colors"
                    >
                        <TrashIcon /> Discard
                    </button>
                </div>
            </div>
        )}

        <div className="space-y-2">
          {students.map(student => {
            const isPresent = currentAttendance[student.id] ?? true;

            return (
              <div key={student.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${isPresent ? 'bg-white border-gray-100 hover:bg-gray-50' : 'bg-red-50 border-red-300 shadow-md ring-1 ring-red-200'}`}>
                <div className="flex items-center overflow-hidden">
                   <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 transition-colors ${isPresent ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-700'}`}>
                     {student.rollNo}
                   </div>
                   <div className="flex flex-col">
                       <div className="flex items-center">
                           <span className={`font-medium truncate text-sm sm:text-base ${isPresent ? 'text-gray-800' : 'text-red-900 font-bold'}`}>{student.name}</span>
                           {!isPresent && <WarningIcon />}
                       </div>
                   </div>
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
            <div className="flex items-center text-xs font-medium text-gray-500 transition-opacity duration-500">
                {autoSaveStatus === 'saving' && <span className="flex items-center"><span className="animate-pulse mr-1">●</span> Saving draft...</span>}
                {autoSaveStatus === 'saved' && <span className="text-teal-600">Draft saved locally</span>}
            </div>
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
