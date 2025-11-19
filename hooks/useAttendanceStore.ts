
import { useState, useCallback, useEffect } from 'react';
import type { AttendanceRecord } from '../types';
import { api } from '../services/api';

const LOCAL_STORAGE_KEY = 'attendanceData';

export const useAttendanceStore = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
        try {
            // Attempt to fetch all attendance (or you could filter by date range to optimize)
            const data = await api.getAttendance();
            setAttendanceData(data);
            setIsOffline(false);
        } catch (e) {
            console.warn("Backend unreachable. Switching to LocalStorage mode.");
            setIsOffline(true);
            const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (localData) {
                try {
                    setAttendanceData(JSON.parse(localData));
                } catch (err) {
                    setAttendanceData([]);
                }
            }
        }
    };
    loadData();
  }, []);

  const updateLocalStorage = (data: AttendanceRecord[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save attendance data to localStorage", e);
    }
  };

  const updateAttendance = useCallback(async (studentId: string, date: string, timeSlot: string, present: boolean) => {
    // 1. Optimistic UI Update
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
      
      // If we are known to be offline, save to local storage immediately
      if (isOffline) {
          updateLocalStorage(newData);
      }
      return newData;
    });

    // 2. API Call (if not offline)
    if (!isOffline) {
        try {
            await api.updateAttendance({ studentId, date, timeSlot, present });
        } catch (e) {
            console.error("Failed to sync with backend, falling back to local storage", e);
            setIsOffline(true);
            // Re-read state to ensure we capture what was just optimistically set? 
            // For simplicity in this specific hook structure, we rely on the optimistic update 
            // already being in state, we just need to ensure persistence.
            // Since we can't easily access the calculated `newData` here without refactoring, 
            // we trigger a sync from current state in next render or just assume the user knows.
            // A safer bet for this specific codebase is to force a local save now:
            setAttendanceData(current => {
                updateLocalStorage(current);
                return current;
            });
        }
    }
  }, [isOffline]);

  const getStudentHistory = useCallback((studentId: string) => {
    return attendanceData.filter(record => record.studentId === studentId);
  }, [attendanceData]);

  return { attendanceData, updateAttendance, getStudentHistory, isOffline };
};
