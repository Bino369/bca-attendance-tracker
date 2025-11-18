export interface Student {
  id: string;
  name: string;
  rollNo: number;
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  present: boolean;
}