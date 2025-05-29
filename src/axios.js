// src/axios.js
import axios from 'axios';

// Create a global Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: 'http://147.102.246.150:8585', // Base URL for all requests
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json', // Default content type
    },
});

// Optionally, you can add request/response interceptors here
axiosInstance.interceptors.request.use(
    (config) => {
        // You can modify the request config here (e.g., add headers)
        console.log('Request Interceptor:', config);
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // You can modify the response here
        console.log('Response Interceptor:', response);
        return response;
    },
    (error) => {
        // Handle response errors
        return Promise.reject(error);
    }
);

// Export the configured Axios instance
export default axiosInstance;