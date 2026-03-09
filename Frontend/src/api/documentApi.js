import api from './axios';

export const getAllDocuments = async () => {
    const response = await api.get('/api/students/all-documents');
    return response.data.data;
};

export const getAllPcpReports = async () => {
    const response = await api.get('/api/students/pcp-reports');
    return response.data.data;
};

export const addPcpReport = async (studentId, reportData) => {
    const response = await api.post(`/api/students/${studentId}/pcp-reports`, reportData);
    return response.data.data;
};

export const deletePcpReport = async (studentId, reportId) => {
    const response = await api.delete(`/api/students/${studentId}/pcp-reports/${reportId}`);
    return response.data;
};

export const uploadDocument = async (studentId, formData) => {
    const response = await api.post(`/api/students/${studentId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
};

export const deleteDocument = async (studentId, docId) => {
    const response = await api.delete(`/api/students/${studentId}/documents/${docId}`);
    return response.data;
};
