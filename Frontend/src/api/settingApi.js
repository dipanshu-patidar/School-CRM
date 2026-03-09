import api from './axios';

export const getSettings = async () => {
    const response = await api.get('/api/settings');
    return response.data;
};

export const updateSettings = async (settingsData) => {
    const response = await api.put('/api/settings', settingsData);
    return response.data;
};
