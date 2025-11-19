
import type { Student, AttendanceRecord } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async getStudents(): Promise<Student[]> {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  async addStudent(student: Student): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Failed to add student');
    return response.json();
  },

  async getAttendance(date?: string): Promise<AttendanceRecord[]> {
    const url = date ? `${API_BASE_URL}/attendance?date=${date}` : `${API_BASE_URL}/attendance`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch attendance');
    return response.json();
  },

  async updateAttendance(record: AttendanceRecord): Promise<AttendanceRecord> {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error('Failed to update attendance');
    return response.json();
  }
};
