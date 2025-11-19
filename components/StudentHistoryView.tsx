
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Student, AttendanceRecord } from '../types';
import { exportToCsv } from '../utils/csv';

interface StudentHistoryViewProps {
  student: Student;
  history: AttendanceRecord[];
  onBack: () => void;
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


export function StudentHistoryView({ student, history, onBack }: StudentHistoryViewProps) {
  const chartData = useMemo(() => {
    const presentCount = history.filter(r => r.present).length;
    const absentCount = history.length - presentCount;
    return [
      { name: 'Present', value: presentCount },
      { name: 'Absent', value: absentCount },
    ];
  }, [history]);

  const COLORS = ['#10B981', '#EF4444']; // Green-500, Red-500

  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleExport = () => {
    const headers = ['Date', 'Day', 'Time Slot', 'Status'];
    const data = sortedHistory.map(record => {
        // Create date object safely for local time
        const [year, month, day] = record.date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        return [
            record.date,
            dayName,
            record.timeSlot,
            record.present ? 'Present' : 'Absent'
        ];
    });
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${student.name.replace(/ /g, '_')}_Attendance_${timestamp}.csv`;
    exportToCsv(filename, [headers, ...data]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6 border-b pb-4 flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full mr-4 shadow-md bg-primary text-white flex items-center justify-center font-bold text-3xl flex-shrink-0">
            {student.rollNo}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-500">Roll No: {student.rollNo} | Attendance History</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button
            onClick={handleExport}
            className="flex items-center bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 px-4 rounded-lg transition-colors"
           >
            <DownloadIcon />
            Export CSV
           </button>
           <button
            onClick={onBack}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
           >
            <ArrowLeftIcon />
            Back to Dashboard
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col items-center justify-center bg-secondary p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Attendance Summary</h3>
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <p className="text-gray-500 text-center p-8">No attendance data recorded yet.</p>
          )}
        </div>
        <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Detailed Records</h3>
            <div className="overflow-auto rounded-lg border border-gray-200" style={{maxHeight: '400px'}}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedHistory.length > 0 ? sortedHistory.map((record, index) => (
                    <tr key={`${record.date}-${record.timeSlot}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.timeSlot}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {record.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan={3} className="text-center py-10 text-gray-500">No records to display.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
}
