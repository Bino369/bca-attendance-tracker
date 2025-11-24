
import React, { useState } from 'react';
import type { Student } from '../types';
import { TIME_SLOTS } from '../constants';

interface StudentListProps {
  students: Student[];
  onViewHistory: (student: Student) => void;
  onExportAll: (filter: 'All' | 'Present' | 'Absent', timeSlot: string, date: string) => void;
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

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

export function StudentList({ students, onViewHistory, onExportAll }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [exportFilter, setExportFilter] = useState<'All' | 'Present' | 'Absent'>('All');
  const [exportTime, setExportTime] = useState<string>('All');
  const [exportDate, setExportDate] = useState<string>('');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toString().includes(searchTerm)
  );

  const hasActiveFilters = exportFilter !== 'All' || exportTime !== 'All' || exportDate !== '';

  const handleResetFilters = () => {
      setExportFilter('All');
      setExportTime('All');
      setExportDate('');
  };

  return (
    <div className="space-y-6 mt-8">
        {/* Division 1: Export Tools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg border border-teal-100 text-primary">
                        <DownloadIcon />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-gray-800">Data Export</h4>
                        <p className="text-xs text-gray-500">Generate CSV reports filtered by date and time</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                    <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 shadow-inner flex-grow sm:flex-grow-0 overflow-x-auto max-w-full">
                        <div className="flex items-center px-2 text-gray-400">
                            <FilterIcon />
                        </div>

                        {/* Date Filter */}
                        <input
                            type="date"
                            value={exportDate}
                            onChange={(e) => setExportDate(e.target.value)}
                            className="text-xs sm:text-sm border-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer hover:text-primary outline-none py-1 px-1 rounded hover:bg-white transition-colors"
                        />

                        <div className="w-px h-4 bg-gray-300 flex-shrink-0"></div>

                        {/* Time Filter */}
                        <select
                            value={exportTime}
                            onChange={(e) => setExportTime(e.target.value)}
                            className="text-xs sm:text-sm border-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer hover:text-primary outline-none py-1 pr-8 pl-1 rounded hover:bg-white transition-colors max-w-[100px] sm:max-w-none truncate"
                            style={{backgroundImage: 'none'}}
                        >
                            <option value="All">All Hours</option>
                            {TIME_SLOTS.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>

                        <div className="w-px h-4 bg-gray-300 flex-shrink-0"></div>

                        {/* Status Filter */}
                        <select
                            value={exportFilter}
                            onChange={(e) => setExportFilter(e.target.value as 'All' | 'Present' | 'Absent')}
                            className="text-xs sm:text-sm border-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer hover:text-primary outline-none py-1 pr-8 pl-1 rounded hover:bg-white transition-colors"
                            style={{backgroundImage: 'none'}}
                        >
                            <option value="All">All Status</option>
                            <option value="Present">Present Only</option>
                            <option value="Absent">Absent Only</option>
                        </select>
                    </div>
                    
                    {hasActiveFilters && (
                        <button 
                            onClick={handleResetFilters}
                            className="flex items-center px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Reset all filters"
                        >
                            <RefreshIcon />
                            <span className="ml-1 hidden sm:inline">Clear</span>
                        </button>
                    )}

                    <button
                        onClick={() => onExportAll(exportFilter, exportTime, exportDate)}
                        className="flex-grow sm:flex-grow-0 flex items-center justify-center text-sm text-white font-semibold py-2 px-5 rounded-lg bg-primary hover:bg-teal-700 transition-all shadow-md hover:shadow-lg transform active:scale-95 duration-150"
                    >
                        <span className="mr-2 hidden sm:inline"><DownloadIcon /></span>
                        <span className="sm:hidden mr-1"><DownloadIcon /></span>
                        {hasActiveFilters ? 'Export Filtered CSV' : 'Export Full CSV'}
                    </button>
                </div>
            </div>
        </div>

        {/* Division 2: Student Directory */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {/* Header & Search */}
            <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/30">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Student Directory</h3>
                        <p className="text-sm text-gray-500 mt-1">Total Students: <span className="font-semibold text-gray-700">{students.length}</span></p>
                    </div>
                    
                    <div className="relative w-full md:w-72 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition duration-200 ease-in-out shadow-sm"
                            placeholder="Search by name or roll no..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="divide-y divide-gray-50">
                {filteredStudents.length > 0 ? (
                    <ul className="divide-y divide-gray-50">
                        {filteredStudents.map(student => (
                        <li key={student.id} className="flex items-center justify-between p-4 hover:bg-teal-50/30 transition-colors group">
                            <div className="flex items-center flex-grow min-w-0">
                                <div className="w-10 h-10 rounded-full mr-4 bg-gradient-to-br from-teal-100 to-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                    {student.rollNo}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-gray-800 truncate group-hover:text-teal-700 transition-colors">{student.name}</span>
                                    <span className="text-xs text-gray-400">ID: {student.id.substring(0, 8)}...</span>
                                </div>
                            </div>
                            <div className="flex items-center flex-shrink-0 ml-4">
                                <button
                                    onClick={() => onViewHistory(student)}
                                    className="flex items-center text-xs sm:text-sm text-gray-600 hover:text-primary font-medium py-1.5 px-3 rounded-full bg-gray-50 hover:bg-white border border-gray-200 hover:border-primary/30 shadow-sm hover:shadow transition-all"
                                >
                                    <ChartBarIcon />
                                    <span className="hidden sm:inline ml-1">View History</span>
                                </button>
                            </div>
                        </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <SearchIcon />
                        </div>
                        <p className="text-lg font-medium text-gray-500">No students found</p>
                        <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
