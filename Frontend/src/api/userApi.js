import api from './axios';

export const updateProfile = async (userData) => {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/api/users/me');
    return response.data;
};

export const getStaffList = async () => {
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
