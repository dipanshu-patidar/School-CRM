import api from './axios';

export const getAllAttendance = async () => {
    const response = await api.get('/api/students/attendance');
    return response.data;
};

// For individual student attendance, we still use the student API or relevant studentTabs endpoints
export const addStudentAttendance = async (studentId, attendanceData) => {
    const response = await api.post(`/api/students/${studentId}/attendance`, attendanceData);
    return response.data;
};

export const deleteStudentAttendance = async (studentId, attendanceId) => {
    const response = await api.delete(`/api/students/${studentId}/attendance/${attendanceId}`);
    return response.data;
};
