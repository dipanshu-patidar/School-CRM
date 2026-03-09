import api from './axios';

export const getWorkshops = async () => {
    const response = await api.get('/api/workshops');
    return response.data;
};

export const createWorkshop = async (workshopData) => {
    const response = await api.post('/api/workshops', workshopData);
    return response.data;
};

export const updateWorkshop = async (id, workshopData) => {
    const response = await api.put(`/api/workshops/${id}`, workshopData);
    return response.data;
};

export const deleteWorkshop = async (id) => {
    const response = await api.delete(`/api/workshops/${id}`);
    return response.data;
};
