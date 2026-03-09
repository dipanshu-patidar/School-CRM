import api from './axios';

export const getAllDocuments = async () => {
    const response = await api.get('/api/documents');
    return response.data.data;
};

export const getAllPcpReports = async () => {
    const response = await api.get('/api/pcp-reports');
    return response.data.data;
};

export const addPcpReport = async (studentId, reportData) => {
    const formData = new FormData();
    formData.append('studentId', studentId);

    Object.keys(reportData).forEach(key => {
        if (key === 'assessmentFile' && reportData[key]) {
            formData.append('assessmentFile', reportData[key]);
        } else if (reportData[key] !== null && reportData[key] !== undefined) {
            formData.append(key, reportData[key]);
        }
    });

    const response = await api.post('/api/pcp-reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
};

export const deletePcpReport = async (studentId, reportId) => {
    const response = await api.delete(`/api/pcp-reports/${reportId}`);
    return response.data;
};

export const uploadDocument = async (studentId, formData) => {
    // studentId should be appended to formData before calling this function
    const response = await api.post('/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
};

export const deleteDocument = async (studentId, docId) => {
    const response = await api.delete(`/api/documents/${docId}`);
    return response.data;
};

