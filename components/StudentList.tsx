
import React from 'react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onViewHistory: (student: Student) => void;
  onExportAll: () => void;
}

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


export function StudentList({ students, onViewHistory, onExportAll }: StudentListProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-700">Students</h3>
        <button
            onClick={onExportAll}
            title="Export all attendance data to CSV"
            className="flex items-center text-sm text-primary hover:text-teal-700 font-semibold py-1 px-3 rounded-full bg-teal-50 hover:bg-teal-100 transition-all"
        >
            <DownloadIcon />
            <span className="ml-1 hidden sm:inline">Export All</span>
        </button>
      </div>
      <ul className="space-y-3">
        {students.map(student => (
          <li key={student.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors group">
            <div className="flex items-center flex-grow min-w-0">
              <div className="w-10 h-10 rounded-full mr-4 bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {student.rollNo}
              </div>
              <span className="font-medium text-gray-800 truncate">{student.name}</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <button
                  onClick={() => onViewHistory(student)}
                  className="flex items-center text-sm text-primary hover:text-teal-700 font-semibold py-1 px-3 rounded-full bg-teal-50 hover:bg-teal-100 transition-all"
                >
                  <ChartBarIcon />
                  History
                </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
