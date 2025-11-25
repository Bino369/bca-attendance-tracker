
import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { AttendanceSheet } from './AttendanceSheet';
import { StudentList } from './StudentList';
import { TimeSlotSelector } from './TimeSlotSelector';
import type { Student, AttendanceRecord } from '../types';
import { exportToCsv } from '../utils/csv';

interface AttendanceDashboardProps {
  students: Student[];
  attendanceData: AttendanceRecord[];
  updateAttendance: (studentId: string, date: string, timeSlot: string, present: boolean) => void;
  onViewHistory: (student: Student) => void;
}

export function AttendanceDashboard({ students, attendanceData, updateAttendance, onViewHistory }: AttendanceDashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  // Fix: Use local date parts to construct YYYY-MM-DD to avoid timezone shifting (yesterday issue)
  const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const updateSheetAttendance = (studentId: string, present: boolean) => {
    if (selectedTimeSlot) {
      updateAttendance(studentId, formattedDate, selectedTimeSlot, present);
    }
  };

  const handleExportAll = (
    filterStatus: 'All' | 'Present' | 'Absent' = 'All',
    filterTime: string = 'All',
    filterDate: string = ''
  ) => {
    const headers = ['Roll No', 'Student Name', 'Date', 'Day', 'Time Slot', 'Status'];
    const studentMap = new Map(students.map(s => [s.id, s]));

    // --- Filtering Logic ---
    let filteredData = attendanceData.filter(record => {
      // 1. Status Filter
      if (filterStatus === 'Present' && !record.present) return false;
      if (filterStatus === 'Absent' && record.present) return false;

      // 2. Time Slot Filter
      if (filterTime !== 'All' && record.timeSlot !== filterTime) return false;

      // 3. Date Filter (Specific Date)
      if (filterDate && record.date !== filterDate) return false;

      return true;
    });

    const data = filteredData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.studentId.localeCompare(b.studentId))
      .map(record => {
        const student = studentMap.get(record.studentId);
        
        // Create date object safely for local time to get correct Day name
        const [year, month, day] = record.date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        return [
            student?.rollNo ?? 'N/A',
            student?.name ?? 'Unknown Student',
            record.date,
            dayName,
            record.timeSlot,
            record.present ? 'Present' : 'Absent'
        ];
    });

    if (data.length === 0) {
        let message = 'No attendance records found matching your current filters:\n';
        if (filterDate) message += `- Date: ${filterDate}\n`;
        if (filterTime !== 'All') message += `- Time: ${filterTime}\n`;
        if (filterStatus !== 'All') message += `- Status: ${filterStatus}\n`;
        message += '\nTry adjusting the filters to export data.';
        alert(message);
        return;
    }

    // --- Dynamic Filename Generation ---
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    
    let filenameParts = ['Attendance'];
    if (filterDate) filenameParts.push(filterDate);
    if (filterTime !== 'All') filenameParts.push(filterTime.replace(/[: ]/g, '').substring(0, 6)); // Shorten time for filename
    if (filterStatus !== 'All') filenameParts.push(filterStatus);
    
    const filename = `${filenameParts.join('_')}_${timestamp}.csv`;
    
    exportToCsv(filename, [headers, ...data]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
          {!selectedTimeSlot && (
            <TimeSlotSelector onSelectTimeSlot={setSelectedTimeSlot} />
          )}
        </div>
        <div className="lg:col-span-2">
          {selectedTimeSlot ? (
            <AttendanceSheet
              date={selectedDate}
              timeSlot={selectedTimeSlot}
              students={students}
              attendanceData={attendanceData}
              updateAttendance={updateSheetAttendance}
            />
          ) : (
             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-full flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Ready to take attendance?</h2>
              <p className="text-gray-500 text-center max-w-md">
                Select a date and a class hour from the panel on the left to display the attendance sheet.
              </p>
            </div>
          )}
        </div>
      </div>
      <StudentList students={students} onViewHistory={onViewHistory} onExportAll={handleExportAll} />
    </div>
  );
}
