// src/axios.js
import axios from 'axios';
import  keycloak, {getToken, isAuthenticated}  from './auth/AuthService';

// Create a global Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: 'https://147.102.246.150:8585', // Base URL for all requests
    data: {
      client_id: 'book-client', // create client in keycloak with same name
    //   client_secret: 'Rt4lHTYr3buoy4yW4DVuC7ilqswnHZew',
    //    client_secret: 's0yGZymSESFWw9OK5Cl7lc5LwwRjgGAP',
      grant_type: 'client_credentials',
    },
    withCredentials: true, // Send cookies with requests
    headers: {
        'Authorization': 'Bearer',
        // 'Content-Type': 'application/json', // Default content type
     }
});

// Optionally, you can add request/response interceptors here
axiosInstance.interceptors.request.use(
    (config) => {
        // You can modify the request config here (e.g., add headers)
        const token = getToken();
        config.headers['Authorization'] = `Bearer ${token}`
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

        const token = getToken();
        response.headers['Authorization'] = `Bearer ${token}`
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