
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

  const formattedDate = selectedDate.toISOString().split('T')[0];

  const updateSheetAttendance = (studentId: string, present: boolean) => {
    if (selectedTimeSlot) {
      updateAttendance(studentId, formattedDate, selectedTimeSlot, present);
    }
  };

  const handleExportAll = (filterStatus: 'All' | 'Present' | 'Absent' = 'All') => {
    const headers = ['Roll No', 'Student Name', 'Date', 'Day', 'Time Slot', 'Status'];
    
    const studentMap = new Map(students.map(s => [s.id, s]));

    let filteredData = attendanceData;
    if (filterStatus === 'Present') {
        filteredData = attendanceData.filter(record => record.present);
    } else if (filterStatus === 'Absent') {
        filteredData = attendanceData.filter(record => !record.present);
    }

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
        alert(`No ${filterStatus !== 'All' ? filterStatus.toLowerCase() + ' ' : ''}attendance data has been recorded yet.`);
        return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filterSuffix = filterStatus === 'All' ? '' : `_${filterStatus}`;
    exportToCsv(`Attendance_Report${filterSuffix}_${timestamp}.csv`, [headers, ...data]);
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
