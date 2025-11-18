
import { useState, useCallback, useEffect } from 'react';
import type { AttendanceRecord } from '../types';

const LOCAL_STORAGE_KEY = 'attendanceData';

const generateInitialData = (): AttendanceRecord[] => {
    // Check if data already exists to avoid re-seeding
    const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existingData) {
        try {
            return JSON.parse(existingData);
        } catch (e) {
            console.error("Failed to parse attendance data from localStorage", e);
            return [];
        }
    }
    // For this demo, let's not pre-populate any data.
    // The user will mark attendance, creating the records.
    return [];
}

export const useAttendanceStore = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  
  useEffect(() => {
      setAttendanceData(generateInitialData());
  }, []);

  const updateLocalStorage = (data: AttendanceRecord[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save attendance data to localStorage", e);
    }
  };

  const updateAttendance = useCallback((studentId: string, date: string, timeSlot: string, present: boolean) => {
    setAttendanceData(prevData => {
      const existingRecordIndex = prevData.findIndex(
        record =>
          record.studentId === studentId &&
          record.date === date &&
          record.timeSlot === timeSlot
      );

      let newData;
      if (existingRecordIndex > -1) {
        newData = [...prevData];
        newData[existingRecordIndex] = { ...newData[existingRecordIndex], present };
      } else {
        newData = [...prevData, { studentId, date, timeSlot, present }];
      }
      
      updateLocalStorage(newData);
      return newData;
    });
  }, []);

  const getStudentHistory = useCallback((studentId: string) => {
    return attendanceData.filter(record => record.studentId === studentId);
  }, [attendanceData]);

  return { attendanceData, updateAttendance, getStudentHistory };
};
