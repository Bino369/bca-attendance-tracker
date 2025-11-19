
import React, { useState } from 'react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onViewHistory: (student: Student) => void;
  onExportAll: (filter: 'All' | 'Present' | 'Absent') => void;
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

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);


export function StudentList({ students, onViewHistory, onExportAll }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [exportFilter, setExportFilter] = useState<'All' | 'Present' | 'Absent'>('All');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toString().includes(searchTerm)
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4 border-b pb-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xl font-bold text-gray-700">Students</h3>
            <div className="flex items-center space-x-2">
                <select
                    value={exportFilter}
                    onChange={(e) => setExportFilter(e.target.value as 'All' | 'Present' | 'Absent')}
                    className="text-xs sm:text-sm border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary py-1.5 pl-2 pr-8 bg-gray-50 border outline-none"
                >
                    <option value="All">All Status</option>
                    <option value="Present">Present Only</option>
                    <option value="Absent">Absent Only</option>
                </select>
                <button
                    onClick={() => onExportAll(exportFilter)}
                    title={`Export ${exportFilter} attendance data to CSV`}
                    className="flex items-center text-sm text-primary hover:text-teal-700 font-semibold py-1 px-3 rounded-full bg-teal-50 hover:bg-teal-100 transition-all"
                >
                    <DownloadIcon />
                    <span className="ml-1 hidden sm:inline">Export</span>
                </button>
            </div>
        </div>

        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <ul className="space-y-3">
            {filteredStudents.map(student => (
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
      ) : (
          <div className="text-center py-8 text-gray-500">
              <p>No students found matching "{searchTerm}"</p>
          </div>
      )}
    </div>
  );
}
