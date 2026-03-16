import axios from 'axios';
 
export const BASE_URL = 'http://localhost:5000';

// Set the base URL for the backend API
const api = axios.create({
    baseURL: BASE_URL, // Update this based on your environment
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
