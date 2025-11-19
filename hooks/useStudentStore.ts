
import { useState, useEffect } from 'react';
import type { Student } from '../types';
import { STUDENTS as MOCK_STUDENTS } from '../constants';
import { api } from '../services/api';

export const useStudentStore = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await api.getStudents();
                // If DB is empty, use mock data to seed (optional logic, helps in demo)
                if (data.length === 0) {
                    setStudents(MOCK_STUDENTS);
                    // Optionally seed the DB here
                } else {
                    setStudents(data);
                }
                setIsOffline(false);
            } catch (error) {
                console.warn("Backend unreachable. Using local mock data.");
                setStudents(MOCK_STUDENTS);
                setIsOffline(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return { students, loading, isOffline };
};
