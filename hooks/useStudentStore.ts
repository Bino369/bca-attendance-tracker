
import { useState, useEffect } from 'react';
import type { Student } from '../types';
import { STUDENTS } from '../constants';

export const useStudentStore = () => {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        setStudents(STUDENTS);
    }, []);

    return { students };
};
