import api from './axios';

export const getAllStaff = async () => {
    const response = await api.get('/api/staff');
    return response.data;
};

export const createStaff = async (staffData) => {
    const response = await api.post('/api/staff', staffData);
    return response.data;
};

export const updateStaff = async (id, staffData) => {
    const response = await api.put(`/api/staff/${id}`, staffData);
    return response.data;
};

export const deleteStaff = async (id) => {
    const response = await api.delete(`/api/staff/${id}`);
    return response.data;
};
