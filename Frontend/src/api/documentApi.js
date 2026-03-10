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

    const allowedKeys = [
        'dateOfService', 'serviceDescription', 'faceToFace', 'faceToFaceIndicator',
        'purpose', 'intervention', 'effectiveness', 'staffNotes', 'staffSignature', 'status'
    ];

    Object.keys(reportData).forEach(key => {
        if (key === 'assessmentFile' && reportData[key] instanceof File) {
            formData.append('assessmentFile', reportData[key]);
            return;
        }
        
        if (allowedKeys.includes(key) && reportData[key] !== null && reportData[key] !== undefined) {
            formData.append(key, reportData[key]);
        }
    });

    const response = await api.post('/api/pcp-reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
};

export const updatePcpReport = async (reportId, reportData) => {
    const formData = new FormData();
    
    // Define allowed keys for update to avoid sending metadata or populated objects
    const allowedKeys = [
        'dateOfService', 'serviceDescription', 'faceToFace', 'faceToFaceIndicator',
        'purpose', 'intervention', 'effectiveness', 'staffNotes', 'staffSignature', 'status'
    ];

    Object.keys(reportData).forEach(key => {
        if (key === 'assessmentFile') {
            if (reportData[key] instanceof File) {
                formData.append('assessmentFile', reportData[key]);
            }
            // If it's a string (URL), we don't need to append it again 
            // the backend updateReport will preserve the old one if no new file is sent
            return;
        }

        if (allowedKeys.includes(key) && reportData[key] !== null && reportData[key] !== undefined) {
            formData.append(key, reportData[key]);
        }
    });

    const response = await api.put(`/api/pcp-reports/${reportId}`, formData, {
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

export const updateDocument = async (docId, formData) => {
    // Update existing document with new data
    const response = await api.put(`/api/documents/${docId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
};

export const deleteDocument = async (studentId, docId) => {
    const response = await api.delete(`/api/documents/${docId}`);
    return response.data;
};

export const downloadDocument = async (docId) => {
    try {
        const response = await api.get(`/api/documents/${docId}/download`, {
            responseType: 'blob'
        });
        return response.data; // This is the blob itself
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
};

