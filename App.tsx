
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AttendanceDashboard } from './components/AttendanceDashboard';
import { StudentHistoryView } from './components/StudentHistoryView';
import { useAttendanceStore } from './hooks/useAttendanceStore';
import { useStudentStore } from './hooks/useStudentStore';
import type { Student } from './types';

type View = 'dashboard' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { attendanceData, updateAttendance, getStudentHistory, isOffline: attendanceOffline } = useAttendanceStore();
  const { students, isOffline: studentsOffline } = useStudentStore();

  // Aggregate offline status
  const isOffline = attendanceOffline || studentsOffline;

  const handleViewHistory = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('history');
  };

  const handleBackToDashboard = () => {
    setSelectedStudent(null);
    setCurrentView('dashboard');
  };
  
  const studentHistory = useMemo(() => {
    if (selectedStudent) {
      return getStudentHistory(selectedStudent.id);
    }
    return [];
  }, [selectedStudent, getStudentHistory]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header isOffline={isOffline} />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {currentView === 'dashboard' && (
          <AttendanceDashboard
            students={students}
            attendanceData={attendanceData}
            updateAttendance={updateAttendance}
            onViewHistory={handleViewHistory}
          />
        )}
        {currentView === 'history' && selectedStudent && (
          <StudentHistoryView
            student={selectedStudent}
            history={studentHistory}
            onBack={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
}

export default App;
