import api from './axios';

export const getAllAttendance = async () => {
    const response = await api.get('/api/attendance');
    return response.data;
};

export const addStudentAttendance = async (studentId, attendanceData) => {
    const response = await api.post('/api/attendance', { studentMongoId: studentId, ...attendanceData });
    return response.data;
};

export const deleteStudentAttendance = async (attendanceId) => {
    const response = await api.delete(`/api/attendance/${attendanceId}`);
    return response.data;
};
